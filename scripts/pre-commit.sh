#!/bin/bash

EXIT_CODE=0

git diff --name-only --cached | grep -E '\.js$' | while read FILE
do
  ./node_modules/.bin/eslint --fix "$FILE"
  git add "$FILE"
  [ $? -ne 0 ] && EXIT_CODE=1
done

exit $EXIT_CODE
