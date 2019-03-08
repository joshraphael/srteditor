#!/bin/bash
if [ ! -f ".SETUP" ]; then
    npm install -g eslint
    if [ $? -ne 0 ]; then
        echo "could not install eslint globally, try using sudo"
        exit 1
    fi
fi
if [ ! -f "srteditor.js" ]; then
    echo "srteditor.js does not exist"
    exit 1
fi
if [ ! -f "srteditor.min.js" ]; then
    echo "srteditor.min.js does not exist"
    exit 1
fi
eslint srteditor.js
if [ $? -ne 0 ]; then
    echo "could not lint srteditor.js"
    exit 1
fi
eslint srteditor.min.js
if [ $? -ne 0 ]; then
    echo "could not lint srteditor.min.js"
    exit 1
fi
