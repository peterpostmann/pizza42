# Infrastructure (based on AWS)

terraform {
  required_version = ">= 0.11.0"
}

provider "aws" {
  region = "${var.region}"
}

data "aws_caller_identity" "current" {}

# DynamoDB
module "ddb" {
  source = "../ddb"
  prefix = "${var.name}-"
}

# IAM Role for Lambda function

resource "aws_iam_role" "iam_role_lambda" {
  name = "${var.name}-lambda"

  assume_role_policy = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": {
        "Service": "lambda.amazonaws.com"
      },
      "Action": "sts:AssumeRole"
    }
  ]
}
EOF
}

resource "aws_iam_role_policy_attachment" "AWSLambdaBasicExecutionRole" {
  role       = "${aws_iam_role.iam_role_lambda.name}"
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole"
}

resource "aws_iam_role_policy" "DynamoDBWriteAccess" {
  name = "DynamoDBWriteAccess"
  role = "${aws_iam_role.iam_role_lambda.id}"

  policy = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Action": [
        "dynamodb:PutItem",
        "dynamodb:Query"
      ],
      "Effect": "Allow",
      "Resource": [
        "${lookup(module.ddb.table_arns, "orders")}",
        "${lookup(module.ddb.table_arns, "orders")}/*"
      ]
    }
  ]
}
EOF
}

# Backend Deployment File

data "archive_file" "backend" {
  type        = "zip"
  source_dir  = "${path.root}/../../backend"
  output_path = "${path.module}/backend.zip"
}

# Lambda Function for Handling Requests

resource "aws_lambda_function" "main" {
  filename      = "${data.archive_file.backend.output_path}"
  function_name = "${var.name}-main"
  role          = "${aws_iam_role.iam_role_lambda.arn}"
  handler       = "lambda.handler"
  runtime       = "nodejs8.10"

  depends_on = ["data.archive_file.backend"]
}

# API Gateway

module "api_gateway" {
  source = "apigw_lambda"
  name   = "${var.name}"
  uri    = "${aws_lambda_function.main.invoke_arn}"
}

# Grant GW access to Lambda

resource "aws_lambda_permission" "apigw" {
  statement_id  = "AllowAPIGatewayInvoke"
  action        = "lambda:InvokeFunction"
  function_name = "${aws_lambda_function.main.function_name}"
  principal     = "apigateway.amazonaws.com"

  source_arn = "arn:aws:execute-api:${var.region}:${data.aws_caller_identity.current.account_id}:${module.api_gateway.rest_api_id}/*/*/*"
}

# Frontend Server

resource "aws_s3_bucket" "frontend" {
  bucket_prefix = "${var.name}-"
  acl           = "public-read"

  website {
    index_document = "index.html"
  }
}

resource "aws_s3_bucket_policy" "PublicRead" {
  bucket = "${aws_s3_bucket.frontend.id}"

  policy = <<EOF
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Principal": "*",
            "Action": "s3:GetObject",
            "Resource": "${aws_s3_bucket.frontend.arn}/*"
        }
    ]
}
EOF
}

# Workaround: S3 does not support https

# Config

resource "local_file" "backend_deploy_conf" {
  filename = "${path.root}/../../backend/config/config.deploy.json"

  content = <<EOF
{
  "aws_region": "${var.region}",
  "aws_lambda_main_name": "${aws_lambda_function.main.function_name}",
  "aws_lambda_main_role": "${aws_iam_role.iam_role_lambda.arn}",
  "aws_lambda_main_handler": "${aws_lambda_function.main.handler}",
  "aws_lambda_main_runtime": "${aws_lambda_function.main.runtime}"
}
EOF
}

resource "local_file" "backend_conf" {
  filename = "${path.root}/../../backend/config/config.json"

  content = <<EOF
{
  "aws_ddb_endpoint": "https://dynamodb.${var.region}.amazonaws.com",
  "aws_ddb_table_orders": "${module.ddb.prefix}orders"
}
EOF
}

resource "local_file" "frontend_deploy_conf" {
  filename = "${path.root}/../../frontend/config/config.deploy.json"

  content = <<EOF
{
  "aws_s3_bucket": "${aws_s3_bucket.frontend.id}",
  "aws_region": "${var.region}"
}
EOF
}

resource "local_file" "frontend_conf" {
  filename = "${path.root}/../../frontend/config/config.json"

  content = <<EOF
{
  "api_url": "${module.api_gateway.invoke_url}"
}
EOF
}
