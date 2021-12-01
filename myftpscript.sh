#!/bin/bash

HOST="nas.myelintek.net"
USER="sergiy"
PASSWORD="qweasd"

TARGET=$1
SOURCE=$2
ALL_FILES="${@:3}"

ftp -inv $HOST <<EOF
pass
user $USER $PASSWORD
cd $SOURCE
lcd $TARGET
mget $ALL_FILES
bye
EOF

