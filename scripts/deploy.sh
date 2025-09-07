#!/bin/sh

if [ -n "$BUCKET" ]; then
  echo "Deploying to bucket: $BUCKET"
else
  echo "Missing BUCKET environemnt variable."
  exit 1
fi
BUILD_DIR=pwa/out

rm -rf $BUILD_DIR

# If "all" argument is passed, deploy all files
# otherwise deploy only index.html and js files.

if [ "$1" = "all" ]; then
npm run build -- all
[ $? -ne 0 ] && exit 1
  aws s3 sync $BUILD_DIR/ s3://$BUCKET/ --delete
else
npm run build
[ $? -ne 0 ] && exit 1
  # Upload JS files with aggressive cache.
  aws s3 sync $BUILD_DIR/js/ s3://$BUCKET/js/ --cache-control max-age=31536000,public
  # Upload index.html with short cache.
  aws s3 cp $BUILD_DIR/index.html s3://$BUCKET/index.html --cache-control max-age=300,public
fi
