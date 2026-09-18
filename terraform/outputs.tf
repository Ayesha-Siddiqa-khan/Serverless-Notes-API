output "api_endpoint" {
  description = "API Gateway endpoint URL"
  value       = "${aws_apigatewayv2_api.notes_api.api_endpoint}"
}

output "lambda_function_name" {
  description = "Lambda function name"
  value       = aws_lambda_function.notes_lambda.function_name
}

output "dynamodb_table_name" {
  description = "DynamoDB table name"
  value       = aws_dynamodb_table.notes_table.name
}
