#!/bin/bash
if [ ! -f ".SETUP" ]; then
    cp hooks/* .git/hooks
    touch .SETUP
fi;
