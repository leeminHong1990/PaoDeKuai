@echo off
set curpath=%~dp0

cd ..
set KBE_ROOT=%cd%
set KBE_RES_PATH=%KBE_ROOT%/kbe/res/;%curpath%/;%curpath%/scripts/;%curpath%/res/
set KBE_BIN_PATH=%KBE_ROOT%/kbe/bin/server/
set UID=19760938


echo KBE_ROOT = %KBE_ROOT%
echo KBE_RES_PATH = %KBE_RES_PATH%
echo KBE_BIN_PATH = %KBE_BIN_PATH%
echo UID = %UID%

if defined KBE_ROOT (python %KBE_ROOT%/kbe\tools\server\pycluster\cluster_controller.py stop) else (python ..\kbe\tools\server\pycluster\cluster_controller.py stop)