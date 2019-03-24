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
apt-get update -y > /dev/null
if [ $? -ne 0 ]; then
    error "Updating apt"
fi
success "Updated apt"
apt-get install openssh-client -y > /dev/null
if [ $? -ne 0 ]; then
    error "Installing OpenSSH Client"
fi
success "Installed OpenSSH Client"
apt-get install git -y >/dev/null
if [ $? -ne 0 ]; then
    error "Installing git"
fi
success "Installed git"
eval "$(ssh-agent -s)"
if [ $? -ne 0 ]; then
    error "Creating a SSH agent shell"
fi
success "Created SSH agent shell"
echo "$SSH_PRIVATE_KEY" | tr -d '\r' | ssh-add - > /dev/null
if [ $? -ne 0 ]; then
    error "Adding ssh key"
fi
success "Added ssh key"
mkdir -p ~/.ssh
if [ $? -ne 0 ]; then
    error "Making ssh folder"
fi
success "Created ssh folder"
chmod 700 ~/.ssh
if [ $? -ne 0 ]; then
    error "Setting access to ssh folder"
fi
success "Set Access for ssh folder"
