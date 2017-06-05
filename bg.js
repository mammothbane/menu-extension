'use strict';

const ALARM_NAME = 'update-weather';
const STORAGE_KEY = 'weather-latest';

let port;
let connected = false;

function connect() {
    if (port && connected) return;

    port = chrome.runtime.connectNative('com.avaglir.simple_weather');

    if (chrome.runtime.lastError) {
        console.error('Couldn\'t connect!', error);
        connected = false;
        port = undefined;
        return;
    }

    connected = true;
    port.onDisconnect = function() { connected = false };
    port.onMessage = function(content) {
        chrome.storage.local.set({STORAGE_KEY, content});
    };

    navigator.geolocation.getCurrentPosition(function(loc) {
        if (!port || !connected) {
            console.error('port disconnected!');
            return;
        }

        port.postMessage(loc);
    }, function(error) {
        console.error('Couldn\'t get current position!', error);
    });
}

chrome.runtime.onInstalled.addListener(function() {
    chrome.alarms.create(ALARM_NAME, {
        'periodInMinutes': 0.25,
    });
});

chrome.alarms.onAlarm.addListener(function(alarm) {
    if (alarm.name !== ALARM_NAME) return;
    connect();
});

chrome.runtime.onMessage.addListener(function(msg) {
    if (msg !== 'requestUpdate') return;
    connect();
})
