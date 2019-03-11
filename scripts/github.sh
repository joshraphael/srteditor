#!/bin/bash
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
source $DIR/mirror_setup.sh
if [ $? -ne 0 ]; then
    exit 1
fi
ssh-keyscan -H 'github.com' >> ~/.ssh/known_hosts
if [ $? -ne 0 ]; then
    exit 1
fi
git remote add github ${GITHUB_URL}
if [ $? -ne 0 ]; then
    exit 1
fi
git push -u github ${CI_COMMIT_REF_NAME}
if [ $? -ne 0 ]; then
    exit 1
fi
