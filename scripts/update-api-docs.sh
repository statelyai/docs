#!/bin/bash
set -e

# enter the xstate submodule
cd xstate
# check out the latest version
git co next
# install dependencies
yarn
# build .d.ts
yarn build
# enter the core package
cd packages/core
# run API Extractor to generate temp/xstate.api.json
../../../node_modules/@microsoft/api-extractor/bin/api-extractor run --config ../../../config/xstate.api-extractor.json --local --diagnostics
# go back to the docs git root
cd ../../..
# run API Documenter to generate API Docs Markdown
./node_modules/@microsoft/api-documenter/bin/api-documenter generate --input-folder ./temp/xstate --output-folder ./api/xstate
# remove temporary API Extractor doc model file
rm temp/xstate/xstate.api.json
rmdir temp/xstate
rmdir temp
