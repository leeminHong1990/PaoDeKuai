#!/bin/sh

export ASSETS_ROOT=$(pwd)
export KBE_ROOT=$(cd ../; pwd)
export KBE_RES_PATH="$KBE_ROOT/kbe/res/:$ASSETS_ROOT:$ASSETS_ROOT/res/:$ASSETS_ROOT/scripts/"
export KBE_BIN_PATH="$KBE_ROOT/kbe/bin/server/"

echo KBE_ROOT = \"${KBE_ROOT}\"
echo KBE_RES_PATH = \"${KBE_RES_PATH}\"
echo KBE_BIN_PATH = \"${KBE_BIN_PATH}\"

$KBE_BIN_PATH/bots&

