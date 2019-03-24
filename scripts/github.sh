#!/bin/bash
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
source $DIR/mirror_setup.sh
if [ $? -ne 0 ]; then
    error "Setting up mirror stage"
fi
success "Mirror setup complete"
ssh-keyscan -H 'github.com' >> ~/.ssh/known_hosts
if [ $? -ne 0 ]; then
    error "Adding Github to known hosts"
fi
success "Github added to know hosts"
git remote add github ${GITHUB_URL}
if [ $? -ne 0 ]; then
    error "Adding Github to remote"
fi
success "Github added to project remotes"
git checkout -b ${CI_COMMIT_REF_NAME}
if [ $? -ne 0 ]; then
    error "Checking out branch '${CI_COMMIT_REF_NAME}'"
fi
success "Created branch '${CI_COMMIT_REF_NAME}'"
git push -u github ${CI_COMMIT_REF_NAME}
if [ $? -ne 0 ]; then
    error "Pushing to github"
fi
success "Pushed to Github"
