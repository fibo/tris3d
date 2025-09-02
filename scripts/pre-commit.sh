#!/bin/bash

npm test
[ $? -ne 0 ] && exit 1

EXIT_CODE=0

git diff --name-only --cached | grep -E '\.js$' | while read FILE
do
  [ -f "$FILE" ] || continue
  ./node_modules/.bin/eslint --fix "$FILE"
  git add "$FILE"
  [ $? -ne 0 ] && EXIT_CODE=1
done

exit $EXIT_CODE
