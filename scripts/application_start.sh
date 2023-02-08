#!/bin/bash

echo 'run application_start.sh: ' >> /home/ec2-user/tiffincrm-server/deploy.log

echo 'pm2 restart server' >> /home/ec2-user/tiffincrm-server/deploy.log
pm2 restart server >> /home/ec2-user/tiffincrm-server/deploy.log