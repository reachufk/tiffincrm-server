#!/bin/bash

#give permission for everything in the tiffincrm-server directory
sudo chmod -R 777 /home/ec2-user/tiffincrm-server

#navigate into our working directory where we have all our github files
cd /home/ec2-user/tiffincrm-server

#add npm and node to path
export NVM_DIR="$HOME/.nvm"	
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"  # loads nvm	
[ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"  # loads nvm bash_completion (node is in path now)

#install node modules
npm install

#start our node app in the background
pm2 start server.js > app.out.log 2> app.err.log < /dev/null & 