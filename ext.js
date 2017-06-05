'use strict';

const STORAGE_KEY = 'weather-latest';

function updateDom() {

    chrome.storage.local.get(STORAGE_KEY, function(weather_data) {
        if (weather_data.hasOwnProperty('coords')) {
            console.log(weather_data);


            document.getElementById('loading').style.display = 'none';
            document.getElementById('weather-wrap').style.display = 'flex';
        } else {
            document.getElementById('loading').style.display = 'flex';
            document.getElementById('weather-wrap').style.display = 'none';

            chrome.runtime.sendMessage('requestUpdate');
        }
    });
}

document.addEventListener('DOMContentLoaded', function() {
    updateDom();

    chrome.storage.onChanged.addListener(function(deltas, ns) {
        if (deltas.some(function(key) { key === STORAGE_KEY })) {
            updateDom();
        }
    });
});
