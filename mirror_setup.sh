#!/bin/bash
apt-get update -y > /dev/null
apt-get install openssh-client -y > /dev/null
apt-get install git -y >/dev/null
eval "$(ssh-agent -s)"
echo "$SSH_PRIVATE_KEY" | tr -d '\r' | ssh-add - > /dev/null
mkdir -p ~/.ssh
chmod 700 ~/.ssh
