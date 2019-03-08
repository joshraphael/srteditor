#!/bin/bash
if [ ! -f ".SETUP" ]; then
    npm install -g uglify-js
    npm install -g eslint
    cp hooks/* .git/hooks
    touch .SETUP
fi;
