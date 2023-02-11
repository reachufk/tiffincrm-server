#!/bin/bash

# Install nvm
curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.35.3/install.sh | bash

# Load nvm
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"

# Install Node.js
nvm install 16

# Use Node.js version 14
nvm use 16

# Install pm2
npm install -g pm2