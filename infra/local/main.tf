# Infrastructure (local)

terraform {
  required_version = ">= 0.11.0"
}

provider "aws" {
  region = "${var.region}"

  endpoints {
    dynamodb = "http://localhost:${var.ddb_proxy_port}"
  }
}

# DynamoDB
module "ddb" {
  source = "../ddb"
  prefix = "${var.name}-"
}

# Config

resource "local_file" "backend_conf" {
  filename = "${path.root}/../../backend/config/config.local.json"

  content = <<EOF
{
  "url_port": "${var.url_port}",
  "api_port": "${var.api_port}",
  "aws_region": "${var.region}",
  "aws_ddb_endpoint": "http://localhost:${var.ddb_port}",
  "aws_ddb_port": "${var.ddb_port}",
  "aws_ddb_proxy_port": "${var.ddb_proxy_port}",
  "aws_ddb_table_orders": "${module.ddb.prefix}orders"
}
EOF
}

resource "local_file" "frontend_conf" {
  filename = "${path.root}/../../frontend/config/config.local.json"

  content = <<EOF
{
  "api_url": "http://localhost:${var.api_port}",
  "api_port": "${var.api_port}"
}
EOF
}
