#!/bin/bash

#install pm2
npm install -g pm2

#Stopping existing node servers
echo "Stopping any existing node servers"
pm2 stop