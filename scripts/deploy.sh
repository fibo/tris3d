#!/bin/sh

BUCKET=tris3d.inversive.net
BUILD_DIR=pwa/out
_1000YEARS_=31536000000

rm -rf $BUILD_DIR
npm run build
[ $? -ne 0 ] && exit 1

# If "all" argument is passed, deploy all files
# otherwise deploy only index.html and js files.

if [ "$1" = "all" ]; then
  aws s3 sync $BUILD_DIR/ s3://$BUCKET/ --delete
else
  # Upload JS files with aggressive cache.
  aws s3 sync $BUILD_DIR/js/ s3://$BUCKET/js/ --cache-control max-age=${_1000YEARS_},public
  # Upload index.html with no-cache pragma.
  aws s3 cp $BUILD_DIR/index.html s3://$BUCKET/index.html --cache-control no-cache,public
fi
