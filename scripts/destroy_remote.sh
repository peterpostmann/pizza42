#!/bin/bash
# Local Setup

trap "kill 0" SIGINT

pushd () {
  command pushd "$@" > /dev/null
}

popd () {
  command popd "$@" > /dev/null
}
# Terraform
PATH="$PATH:$PWD/vendor"
if ! command -v terraform >/dev/null; then
  ./get_terraform.sh
fi
pushd ./../infra/remote
terraform destroy -auto-approve
popd
