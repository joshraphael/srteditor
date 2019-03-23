#!/bin/bash
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
source $DIR/mirror_setup.sh
if [ $? -ne 0 ]; then
    echo "Error setting up mirror stage"
    exit 1
fi
echo "Mirror setup complete"
ssh-keyscan -H 'github.com' >> ~/.ssh/known_hosts
if [ $? -ne 0 ]; then
    echo "Error adding github to known hosts"
    exit 1
fi
echo "Github added to know hosts"
git remote add github ${GITHUB_URL}
if [ $? -ne 0 ]; then
    echo "Error adding github to remote"
    exit 1
fi
git fetch github
echo "Github added to project remotes"
git push -u github HEAD:${CI_COMMIT_REF_NAME}
if [ $? -ne 0 ]; then
    echo "Error pushing to github"
    exit 1
fi
echo "Pushed to Github"
