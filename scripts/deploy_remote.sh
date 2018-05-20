#!/bin/bash
# Deploy Remote

pushd () {
  command pushd "$@" > /dev/null
}

popd () {
  command popd "$@" > /dev/null
}

# Backend
pushd ./../backend
npm run-script deploy
popd

# Frontend
pushd ./../frontend
npm run-script build
npm run-script deploy
popd

