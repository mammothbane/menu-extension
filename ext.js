'use strict';

function update() {
    chrome.storage.local.get('weather', function(weather_data) {
        let weatherDiv = document.getElementById('weather-wrap');
        let loadingDiv = document.getElementById('loading');

        let weatherSpan = document.getElementById('weather');
        let locSpan = document.getElementById('location');

        if (weather_data.hasOwnProperty('weather')) {
            let weather = weather_data.weather;

            weatherSpan.innerHTML = Math.round(weather.temp) + '° and ' + weather.weather.toLowerCase();
            locSpan.innerHTML = weather.loc;

            loadingDiv.style.display = 'none';
            weatherDiv.style.display = 'flex';
        } else {
            weatherSpan.innerHTML = '';
            locSpan.innerHTML = '';

            loadingDiv.style.display = 'flex';
            weatherDiv.style.display = 'none';

            chrome.browserAction.setIcon({
                path: 'images/clear-38.png',
            });

            chrome.browserAction.setBadgeText({
                text: '',
            });

            chrome.runtime.sendMessage('requestUpdate');
        }
    });
}

document.addEventListener('DOMContentLoaded', function() {
    update();

    chrome.storage.onChanged.addListener(function(deltas, ns) {
        if (deltas.hasOwnProperty('weather')) {
            update();
        }
    });
});
