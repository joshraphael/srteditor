#!/bin/bash

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
WEBSITE=$DIR/website
WEBSITE_JS=$WEBSITE/static/js
mkdir -p $WEBSITE_JS
cd $WEBSITE
if [[ $1 != "--deploy" ]]; then
    uglifyjs $DIR/srteditor.js > $DIR/srteditor.min.js
fi
cp $DIR/srteditor.min.js $WEBSITE_JS
if [[ $1 == "--deploy" ]]; then
    bundle install
    bundle exec jekyll build -d $DIR/public
    #cp -r public $DIR
else
    bundle exec jekyll serve
fi