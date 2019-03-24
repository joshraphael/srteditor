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
    npm install -g uglify-js
    if [ $? -ne 0 ]; then
        error "Could not install uglify-js golbally, try using sudo"
    fi
    success "Installed uglify-js"
fi
if [ ! -f "srteditor.js" ]; then
    error "srteditor.js does not exist"
fi
success "srteditor.js exists"
if [ ! -f "srteditor.min.js" ]; then
    error "srteditor.min.js does not exist"
fi
success "srteditor.min.js exists"
mkdir -p minify_test
if [ $? -ne 0 ]; then
    error "Could not make minify test directory"
fi
success "Created minify test directory"
cp srteditor.min.js minify_test/srteditor.actual.min.js
if [ $? -ne 0 ]; then
    error "Could not copy existing minified file into test directory"
fi
success "Copied existing minified file into test directory"
uglifyjs srteditor.js > minify_test/srteditor.expected.min.js
if [ $? -ne 0 ]; then
    error "Could not uglify srteditor.js"
fi
success "Uglified srteditor.js"
cd minify_test
if [ $? -ne 0 ]; then
    error "Could not change directory to minify test directory"
fi
success "Changed directory to minify test directory"
diff srteditor.expected.min.js srteditor.actual.min.js
if [ $? -ne 0 ]; then
    error "Existing minified file does not match expected"
fi
success "Existing minified file matched expected minified file"
