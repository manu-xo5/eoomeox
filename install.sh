#!/bin/bash

if [ -d "./eoomeox" ]; then
cp ./eoomeox/releases/eoomeox-0.0.0.AppImage $HOME/Applications/
else
cp ./releases/eoomeox-0.0.0.AppImage $HOME/Applications/
fi
