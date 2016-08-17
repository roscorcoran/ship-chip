#!/bin/bash
#move into your git repo
cd /opt/ship-chip;

git fetch;
LOCAL=$(git rev-parse HEAD);
REMOTE=$(git rev-parse @{u});

#if our local revision id doesn't match the remote, we will need to pull the changes
if [ $LOCAL != $REMOTE ]; then
    #stop the service before making changes
    service chip-ship stop;
    #pull and merge changes
    git pull origin master;
    #start the service reflecting new changes
    service chip-ship start;
fi