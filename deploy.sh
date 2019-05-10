#!/bin/bash

echo "building app..."
npm run build
echo "deploying app to production server..."
rsync -a ./dist/ cosmonaut@168.235.77.138:/var/www/html
echo "done!"
