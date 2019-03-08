#!/bin/bash
if [ ! -f ".SETUP" ]; then
    npm install -g uglify-js
    if [ $? -ne 0 ]; then
        echo "could not install uglify-js golbally, try using sudo"
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
mkdir -p minify_test
if [ $? -ne 0 ]; then
    echo "could not make minify test directory"
    exit 1
fi
cp srteditor.min.js minify_test/srteditor.actual.min.js
if [ $? -ne 0 ]; then
    echo "could not copy existing minified file into test directory"
    exit 1
fi
uglifyjs srteditor.js > minify_test/srteditor.expected.min.js
if [ $? -ne 0 ]; then
    echo "could not uglify srteditor.js"
    exit 1
fi
cd minify_test
if [ $? -ne 0 ]; then
    exit 1
fi
diff srteditor.expected.min.js srteditor.actual.min.js
if [ $? -ne 0 ]; then
    echo "existing minified file does not match expected"
    exit 1
fi 
