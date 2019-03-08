#!/bin/bash
source mirror_setup.sh
ssh-keyscan -H 'github.com' >> ~/.ssh/known_hosts
git remote add github ${GITHUB_URL}
git push -u github ${CI_COMMIT_REF_NAME}
