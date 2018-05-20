output "api" {
  value = "${module.api_gateway.invoke_url}"
}

output "url" {
  value = "http://${aws_s3_bucket.frontend.website_endpoint}, https://${aws_s3_bucket.frontend.bucket_prefix}.s3.${var.region}.amazonaws.com/index.html"
}
