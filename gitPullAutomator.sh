#!/bin/bash

while :
do
    result=$(git pull);
    if [ "$result" != "Already up-to-date." ]; then
        fuser -k 12224
    fi
    sleep 15
done