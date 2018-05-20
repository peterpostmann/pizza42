output "rest_api_id" {
  value = "${aws_api_gateway_rest_api.api.id}"
}

output "invoke_url" {
  value = "${aws_api_gateway_deployment.gateway.invoke_url}"
}
