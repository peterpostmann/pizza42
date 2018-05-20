variable "region" {
  description = "Region"
}

variable "name" {
  description = "Name of this application"
}

variable "ddb_port" {
  description = "DynamoDB local port"
}

variable "ddb_proxy_port" {
  description = "DynamoDB local proxy port"
}

variable "api_port" {
  description = "Local dev server port (backend)"
}

variable "url_port" {
  description = "Local dev server port (frontend)"
}
