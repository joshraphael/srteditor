#!/bin/bash
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
source $DIR/scripts/setup.sh
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
        error "Could not install uglify-js"
    fi
    success "Installed uglify-js"
    npm install -g eslint
    if [ $? -ne 0 ]; then
        error "Could not install ESLint"
    fi
    success "Installed ESLint"
    cp $DIR/scripts/setup.sh $DIR/.git/hooks
    if [ $? -ne 0 ]; then
        error "Could not copy setup script into hooks"
    fi
    success "Copied setup script into hooks"
    cp $DIR/hooks/* $DIR/.git/hooks
    if [ $? -ne 0 ]; then
        error "Could not copy hook script(s) into git hooks"
    fi
    success "Copied hook script(s) into git hooks"
    touch .SETUP
    if [ $? -ne 0 ]; then
        error "Could not create setup file"
    fi
    success "Created setup file"
else
    success "Setup hook(s) already exist"
fi;
