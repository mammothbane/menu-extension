#!/usr/bin/env python

import pyowm
import geocoder
import websockets

import asyncio
import json

with open('config.json') as f:
    owm_key = json.load(f)['OWM_KEY']

owm = pyowm.OWM(owm_key)


async def weather(sock, path):
    print('handling socket at path', path)
    while True:
        print('waiting for data')
        msg = await sock.recv()
        print('got message!')
        print(msg)

        msg = json.loads(msg)
        lat = msg['lat']
        lng = msg['long']

        loc = geocoder.google([lat, lng], method='reverse')
        obs = owm.weather_around_coords(lat, lng)

        weather = obs[0].get_weather()
        status = weather.get_status()
        temp = weather.get_temperature('fahrenheit')['temp']

        await sock.send(json.dumps({'loc': loc.city, 'weather': status, 'temp': temp}))


server = websockets.serve(weather, 'localhost', 4000)

asyncio.get_event_loop().run_until_complete(server)
asyncio.get_event_loop().run_forever()
