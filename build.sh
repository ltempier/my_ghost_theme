#!/bin/bash

mkdir -p ./build
if [ -f ./build/theme.zip ]; then
   mv ./build/theme.zip ./build/theme.old.zip
fi
zip -r --exclude=*.zip ./build/theme.zip ./*




