#!/bin/bash

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
uglifyjs $DIR/srteditor.js > $DIR/srteditor.min.js
python3 -mwebbrowser example.html