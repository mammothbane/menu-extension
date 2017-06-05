#!/usr/bin/env python

import pyowm
from geopy.geocoders import Nominatim

import json
import struct
import sys

with open('config.json') as f:
    owm_key = json.load(f)['OWM_KEY']

geo = Nominatim()
owm = pyowm.OWM(owm_key)

# Function to send a message to chrome.
def send_message(MSG_DICT):
    # Converts dictionary into string containing JSON format.
    msg_json = json.dumps(MSG_DICT, separators=(",", ":"))
    # Encodes string with UTF-8.
    msg_json_utf8 = msg_json.encode("utf-8")
    # Writes the message size. (Writing to buffer because writing bytes object.)
    sys.stdout.buffer.write(struct.pack("i", len(msg_json_utf8)))
    # Writes the message itself. (Writing to buffer because writing bytes object.)
    sys.stdout.buffer.write(msg_json_utf8)


# Function to read a message from chrome.
def read_message():
    # Reads the first 4 bytes of the message (which designates message length).
    text_length_bytes = sys.stdin.buffer.read(4)
    # Unpacks the first 4 bytes that are the message length. [0] required because unpack returns tuple with required data at index 0.
    text_length = struct.unpack("i", text_length_bytes)[0]
    # Reads and decodes the text (which is JSON) of the message.
    text_undecoded = sys.stdin.buffer.read(text_length).decode("utf-8")

    return json.loads(text_undecoded)

while True:
    msg = read_message()
    coords = msg['coords']

    loc = geo.reverse((coords.latitude, coords.longitude), exactly_one=True)
    obs = owm.weather_around_coords(coords.latitude, coords.longitude)

    weather = obs[0].get_weather()

    send_message({'loc': loc.address, 'weather': weather})
