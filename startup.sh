#!/bin/bash

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
WEBSITE=$DIR/website
WEBSITE_API=$WEBSITE/api
WEBSITE_JS=$WEBSITE/static/js
DEFAULT_PORT=4000
mkdir -p $WEBSITE_JS
mkdir -p $WEBSITE_API
if [[ $1 == "--deploy" ]]; then
    bash scripts/meta.sh $1 > $WEBSITE_API/meta.json
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
cd $WEBSITE
if [[ $1 != "--deploy" ]]; then
    uglifyjs $DIR/srteditor.js > $DIR/srteditor.min.js
fi
cp $DIR/srteditor.min.js $WEBSITE_JS
if [[ $1 == "--deploy" ]]; then
    bundle install
    bundle exec jekyll build -d $DIR/public
else
    bundle exec jekyll serve --port $PORT
fi