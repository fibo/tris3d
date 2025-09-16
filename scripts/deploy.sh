#!/bin/sh
set -o errexit

if [ -n "$BUCKET" ]; then
  echo "Deploying to bucket: $BUCKET"
else
  echo "Missing BUCKET environemnt variable."
  exit 1
fi

BUILD_DIR=pwa/out
rm -rf $BUILD_DIR

npm run build

# If "all" argument is passed, upload all files
if [ "$1" = "all" ]; then
  aws s3 sync $BUILD_DIR/ s3://$BUCKET/ --delete --exclude "js/*" --exclude "index.html"
fi

# Upload JS files with aggressive cache.
aws s3 sync $BUILD_DIR/js/ s3://$BUCKET/js/ --cache-control max-age=31536000,public
# Upload HTML pages with short cache.
aws s3 cp $BUILD_DIR/index.html s3://$BUCKET/index.html --cache-control max-age=300,public
aws s3 cp $BUILD_DIR/index.html s3://$BUCKET/tma.html --cache-control max-age=300,public
