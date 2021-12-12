#!/bin/bash

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
WEBSITE=$DIR/website
WEBSITE_API=$WEBSITE/api
WEBSITE_JS=$WEBSITE/static/js
WEBSITE_DOWNLOAD=$WEBSITE/download
DEFAULT_PORT=4000
mkdir -p $WEBSITE_JS
mkdir -p $WEBSITE_API
mkdir -p $WEBSITE_DOWNLOAD
if [[ $1 == "--deploy" ]]; then
    bash scripts/meta.sh $1 > $WEBSITE_API/meta.json
    apt-get update
    apt-get install zip
else
    if [[ ! -z "$PORT" ]]; then
        if [[ ! ($PORT =~ ^([0-9]{1,5})$ && $PORT -gt 1499 && $PORT -lt 65536) ]]; then
            echo "Bad port, setting to default: $DEFAULT_PORT"
            PORT=$DEFAULT_PORT
        fi
    else
        PORT=$DEFAULT_PORT
    fi
    bash scripts/meta.sh $PORT > $WEBSITE_API/meta.json
fi
zip $WEBSITE_DOWNLOAD/srteditor.zip srteditor.js srteditor.min.js README.md LICENSE
tar -cf $WEBSITE_DOWNLOAD/srteditor.tar srteditor.js srteditor.min.js README.md LICENSE
cd $WEBSITE
if [[ $1 != "--deploy" ]]; then
    uglifyjs $DIR/srteditor.js > $DIR/srteditor.min.js
fi
cp $DIR/srteditor.min.js $WEBSITE_JS
bundle install
if [[ $1 == "--deploy" ]]; then
    bundle exec jekyll build -d $DIR/public
else
    bundle exec jekyll serve --host 0.0.0.0 --port $PORT
fi
