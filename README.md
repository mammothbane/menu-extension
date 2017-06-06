# Simple Weather
This is a Chrome extension that uses websockets to fetch weather data from a local server. This data
is retrieved from OpenWeatherMap via PyOWM. There isn't any good reason that the extension doesn't
just get the data itself other than that the extension is supposed to use websockets.

## Server
The server requires Python 3.5+. Install dependencies with `pip`, grab an OWM token at
http://openweathermap.org/api and toss it in `server/config.json`, and just run `server.py` (making
sure local port 4000 is free).

## Extension
To install the Chrome extension, open up the extensions page at `chrome://extensions`, enable
developer mode, click `Load Unpacked Extension`, and point it at the root of this directory. If the
server's running, you should now have a functional little weather widget.
