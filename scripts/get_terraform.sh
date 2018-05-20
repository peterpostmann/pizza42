#!/bin/bash
# Local Setup

mkdir vendor
pushd vendor  > /dev/null
wget https://releases.hashicorp.com/terraform/0.11.7/terraform_0.11.7_linux_amd64.zip -O terraform.zip
unzip terraform.zip
popd > /dev/null