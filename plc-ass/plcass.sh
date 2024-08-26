#!/usr/bin/bash

echo "Stopping Apache 2 Server"
sudo systemctl stop apache2

echo "Starting XAMPP server"
sudo /opt/lampp/./manager-linux-x64.run &

echo "Starting Frontend Server"
cd /home/edwinooi/Desktop/Vite/plc-ass
npm run react &

echo "Starting Backend Server"
cd /home/edwinooi/Desktop/Vite/plc-ass/src/backend
npm run server &


# Wait for all background processes to finish
wait

echo "All nodes have been started."