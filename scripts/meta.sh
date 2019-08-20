#!/bin/bash

if [[ $1 == "--deploy" ]]; then
    COMMIT=$CI_COMMIT_SHA
    BRANCH=$CI_COMMIT_REF_NAME
    URL=$CI_PAGES_URL
else
    COMMIT=$(git rev-parse --verify HEAD)
    BRANCH=$(git rev-parse --abbrev-ref HEAD)
    URL="localhost:$PORT"
fi
DEPLOY_TS=$(date -u --rfc-3339=ns)
echo -n "{\"url\": \"$URL\", \"commit\": \"$COMMIT\", \"branch\": \"$BRANCH\", \"deployTimestamp\": \"$DEPLOY_TS\"}"