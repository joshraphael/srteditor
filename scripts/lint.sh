#!/bin/bash
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
source $DIR/setup.sh
if [ $? -ne 0 ]; then
    ERROR='\033[0;31m'
    DEFAULT='\033[0m'
    echo -e "${ERROR}Error: Sourcing setup script${DEFAULT}"
    exit 1
fi
success "Sourced setup script"
if [ ! -f ".SETUP" ]; then
    npm install -g eslint
    if [ $? -ne 0 ]; then
        error "Could not install ESLint globally, try using sudo"
    fi
    success "Installed ESLint"
fi
if [ ! -f "srteditor.js" ]; then
    error "srteditor.js does not exist"
fi
success "srteditor.js exists"
if [ ! -f "srteditor.min.js" ]; then
    error "srteditor.min.js does not exist"
fi
success "srteditor.min.js exists"
eslint srteditor.js
if [ $? -ne 0 ]; then
    error "Could not lint srteditor.js"
fi
success "Linted srteditor.js"
eslint srteditor.min.js
if [ $? -ne 0 ]; then
    error "Could not lint srteditor.min.js"
fi
success "Linted srteditor.min.js"
