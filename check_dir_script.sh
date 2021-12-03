#!/bin/bash

SPECIFIC_DIR="$1"

if [ -d "/mnt/c/mlcommon/$SPECIFIC_DIR" ];
    then echo 'Exists';
    else echo 'Not found';
fi