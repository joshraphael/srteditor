#!/bin/bash
apt-get update -y > /dev/null
if [ $? -ne 0 ]; then
    exit 1
fi
apt-get install openssh-client -y > /dev/null
if [ $? -ne 0 ]; then
    exit 1
fi
apt-get install git -y >/dev/null
if [ $? -ne 0 ]; then
    exit 1
fi
eval "$(ssh-agent -s)"
if [ $? -ne 0 ]; then
    exit 1
fi
echo "$SSH_PRIVATE_KEY" | tr -d '\r' | ssh-add - > /dev/null
if [ $? -ne 0 ]; then
    exit 1
fi
mkdir -p ~/.ssh
if [ $? -ne 0 ]; then
    exit 1
fi
chmod 700 ~/.ssh
if [ $? -ne 0 ]; then
    exit 1
fi
