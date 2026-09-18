resource "aws_lambda_function" "notes_lambda" {
  function_name    = local.function_name
  filename         = data.archive_file.lambda_zip.output_path
  source_code_hash = data.archive_file.lambda_zip.output_base64sha256
  role             = aws_iam_role.lambda_role.arn
  handler          = "lambda_function.lambda_handler"
  runtime          = "python3.12"
  timeout          = 10
  memory_size      = 128

  environment {
    variables = {
      NOTES_TABLE_NAME = local.table_name
    }
  }
}

resource "aws_lambda_permission" "api_permission" {
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.notes_lambda.function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${aws_apigatewayv2_api.notes_api.execution_arn}/*/*"
}
