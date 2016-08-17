#!/bin/bash
#move into your git repo
cd /opt/ship-chip;

/usr/bin/git fetch;
LOCAL=$(/usr/bin/git rev-parse HEAD);
REMOTE=$(/usr/bin/git rev-parse @{u});

#if our local revision id doesn't match the remote, we will need to pull the changes
if [ $LOCAL != $REMOTE ]; then
    #stop the service before making changes
    systemctl stop shipchip.service;
    #pull and merge changes
    git pull origin master;
    #start the service reflecting new changes
    systemctl start shipchip.service;
fi