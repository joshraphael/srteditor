#!/bin/bash
SUCCESS='\033[0;32m'
ERROR='\033[0;31m'
DEFAULT='\033[0m'

success() {
    echo -e "${SUCCESS}Success: ${1}${DEFAULT}"
}

error() {
    echo -e "${ERROR}Error: ${1}${DEFAULT}"
    exit 1
}
