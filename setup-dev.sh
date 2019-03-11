#!/bin/bash
if [ ! -f ".SETUP" ]; then
    npm install -g uglify-js
    if [ $? -ne 0 ]; then
        exit 1
    fi 
    npm install -g eslint
    if [ $? -ne 0 ]; then
        exit 1
    fi
    cp hooks/* .git/hooks
    if [ $? -ne 0 ]; then
        exit 1
    fi
    touch .SETUP
fi;
