'use strict';

const ALARM_NAME = 'update-weather';

let sock;

function setupSock() {
    sock = new WebSocket('ws://127.0.0.1:4000/');

    sock.onerror = function(err) {
        console.error('socket error!', err);
    };

    sock.onclose = function() {
        console.log('socket closed!');
    };

    sock.onmessage = function(content) {
        let data = JSON.parse(content.data);
        console.log('got message', data);

        chrome.storage.local.set({weather: data});

        let icon = 'clear';

        switch (data.weather.toLowerCase()) {
            case 'mist':
            case 'cloudy':
            case 'clouds':
                icon = 'cloudy';
                break;

            case 'rain':
                icon = 'rain';
                break;

            case 'snow':
                icon = 'snow';
                break;

            case 'thunderstorm':
            case 'thunder':
            case 'lightning':
            case 'storm':
                icon = 'thunder';
                break;

            case 'partly cloudy':
            case 'partly_cloudy':
                icon = 'partly_cloudy';
                break;
        }

        chrome.browserAction.setIcon({
            path: 'images/' + icon + '-38.png',
        });

        chrome.browserAction.setBadgeText({
            text: Math.round(data.temp).toString(),
        });
    };
}

setupSock();
push_loc();

function send(loc) {
    sock.send(JSON.stringify({
        lat: loc.coords.latitude,
        long: loc.coords.longitude,
    }));
}

function push_loc() {
    navigator.geolocation.getCurrentPosition(function(loc) {
        if (sock.readyState === WebSocket.OPEN) {
            send(loc);
        } else if (sock.readyState === WebSocket.CONNECTING) {
            sock.onopen = function() {
                send(loc);
            }
        } else {
            setupSock();
            sock.onopen = function() {
                send(loc);
            }
        }
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
    push_loc();
});

chrome.runtime.onMessage.addListener(function(msg) {
    if (msg !== 'requestUpdate') return;
    push_loc();
})
