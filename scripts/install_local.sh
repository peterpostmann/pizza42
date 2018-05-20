#!/bin/bash
# Local Setup

trap "kill 0" SIGINT

pushd () {
  command pushd "$@" > /dev/null
}

popd () {
  command popd "$@" > /dev/null
}

echo "DynamoDB Local"
pushd ./../infra/local/ddb_local
npm install
npm run-script start &
popd

echo "DynamoDB Proxy"
pushd ./../infra/local/ddb_proxy
npm install
npm run-script start &
popd

echo "Wait for DynamoDB Local..."
sleep 10

echo "Terraform"
PATH="$PATH:$PWD/vendor"
if ! command -v terraform >/dev/null; then
  ./get_terraform.sh
fi
pushd ./../infra/local
terraform init
terraform apply -input=false -auto-approve
popd

echo "Backend"
pushd ./../backend
npm install
popd

echo "Frontend"
pushd ./../frontend
npm install
popd

kill 0
