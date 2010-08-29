#!/bin/bash

export NODE_PATH=`pwd`/includes/ws/:`pwd`/includes/paperboy/lib/

node server.js --port=8001

