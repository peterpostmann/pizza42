#!/bin/bash
# Local Setup

trap "kill 0" SIGINT

pushd () {
  command pushd "$@" > /dev/null
}

popd () {
  command popd "$@" > /dev/null
}

# DynamoDB Local
pushd ./../infra/local/ddb_local
npm run-script start &
popd

# Backend
pushd ./../backend
npm run-script start &
popd

# Frontend
pushd ./../frontend
npm run-script start &
popd

read -p "Press enter to kill all processes"

kill 0
