#!/bin/bash

echo "building app..."
npm run build
echo "deploying app to production server..."
scp -r ./dist cosmonaut@168.235.77.138:/var/www/html
echo "done!"
