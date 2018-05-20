# Amazon DynamoDB Table

variable "prefix" {
  description = "dynamodb table name prefix"
}

resource "aws_dynamodb_table" "dynamodb_table_orders" {
  name           = "${var.prefix}orders"
  read_capacity  = 5
  write_capacity = 5
  hash_key       = "user_id"
  range_key      = "order_id"

  attribute = [
    {
      name = "order_id"
      type = "S"
    },
    {
      name = "user_id"
      type = "S"
    },
    {
      name = "date"
      type = "S"
    },
  ]

  local_secondary_index {
    name            = "Date"
    range_key       = "date"
    projection_type = "ALL"
  }
}

output "table_arns" {
  value = {
    orders = "${aws_dynamodb_table.dynamodb_table_orders.arn}"
  }
}

output "prefix" {
  value = "${var.prefix}"
}
