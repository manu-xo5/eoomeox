#!/bin/bash

if [ -d $HOME/.local/share/applications ]; then
  mkdir -p $HOME/.local/share/applications
fi

if [ -d "./eoomeox" ]; then
  cp ./eoomeox/releases/eoomeox-0.0.0.AppImage $HOME/Applications/emeox.AppImage
  cp ./eoomeox/emeox.desktop $HOME/.local/share/applications/emeox.desktop
else
  cp ./releases/eoomeox-0.0.0.AppImage $HOME/Applications/emeox.AppImage
  cp ./emeox.desktop $HOME/.local/share/applications/emeox.desktop
fi

chmod +x $HOME/Applications/emeox.AppImage
