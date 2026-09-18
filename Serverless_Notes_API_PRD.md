# Product Requirements Document (PRD)
# Serverless Notes API

**Project Type:** Beginner AWS Serverless Practice Project  
**Primary Goal:** Learn and practise AWS Lambda and related AWS services  
**Language:** Python  
**Core Architecture:** Client → API Gateway → AWS Lambda → DynamoDB  

---

## 1. Project Overview

Serverless Notes API is a small, beginner-friendly backend application designed to practise core AWS serverless services.

The application exposes a simple REST API that allows a user to:

- Create a note
- Retrieve all notes
- Retrieve a specific note
- Delete a note

The system is intentionally limited in scope so that the main learning focus remains on AWS Lambda, API Gateway, DynamoDB, IAM, and CloudWatch.

This is not intended to be a production-scale notes platform.

---

## 2. Learning Objectives

By completing this project, the learner should understand how to:

1. Create and configure an AWS Lambda function.
2. Write Lambda handler logic in Python.
3. Receive HTTP requests through Amazon API Gateway.
4. Parse API Gateway event data inside Lambda.
5. Return correctly formatted HTTP responses from Lambda.
6. Read and write data in Amazon DynamoDB.
7. Use IAM roles and policies to grant Lambda required permissions.
8. View Lambda logs in Amazon CloudWatch.
9. Troubleshoot common serverless application issues.
10. Configure environment variables instead of hard-coding environment-specific values.
11. Deploy and test a simple serverless API in AWS.

---

## 3. Problem Statement

A beginner learning AWS Lambda often understands individual AWS services conceptually but needs a small practical project that demonstrates how the services work together.

This project solves that learning problem by providing a simple API where:

- API Gateway accepts HTTP requests.
- Lambda executes application logic.
- DynamoDB stores note data.
- IAM controls service permissions.
- CloudWatch stores logs for debugging and monitoring.

The project is intentionally small enough to build manually in the AWS Management Console while still demonstrating a realistic serverless request flow.

---

## 4. Goals and Non-Goals

### 4.1 Goals

The MVP must:

- Provide four basic Notes API operations.
- Use AWS Lambda for application logic.
- Use Python for Lambda code.
- Use API Gateway to expose HTTP endpoints.
- Use DynamoDB for persistence.
- Use IAM permissions following least-privilege principles.
- Use CloudWatch for Lambda logs.
- Return consistent JSON responses.
- Handle common client and server errors.
- Be simple enough for a beginner to understand and deploy manually.

### 4.2 Non-Goals

The current MVP will not include:

- User authentication
- User registration
- Multi-user note ownership
- Note updates
- Search
- Tags
- Pagination
- File attachments
- Front-end application
- Kubernetes
- Docker
- Terraform
- CI/CD
- Complex observability platforms
- Microservices
- Event-driven workflows
- SQS
- SNS
- Step Functions
- Cognito

These may be considered later only as optional future improvements.

---

## 5. Target User

The primary target user is:

> A beginner or junior Cloud/DevOps Engineer learning AWS serverless development.

The user should have basic familiarity with:

- AWS Console
- Python fundamentals
- JSON
- HTTP methods
- Basic REST API concepts

Advanced AWS knowledge is not required.

---

## 6. Functional Requirements

### FR-01: Create Note

The API must allow a client to create a new note.

Required input:

- `title`
- `content`

The system must generate:

- `noteId`
- `createdAt`

The note must be stored in DynamoDB.

---

### FR-02: Retrieve All Notes

The API must allow a client to retrieve all notes stored in the DynamoDB table.

For this learning project, a DynamoDB `Scan` operation is acceptable.

Pagination is outside MVP scope.

---

### FR-03: Retrieve Specific Note

The API must allow a client to retrieve one note by `noteId`.

If the note does not exist, the API must return HTTP `404`.

---

### FR-04: Delete Note

The API must allow a client to delete a note by `noteId`.

The API should return an appropriate success response after deletion.

---

## 7. API Endpoints

| Method | Endpoint | Purpose |
|---|---|---|
| POST | `/notes` | Create a new note |
| GET | `/notes` | Retrieve all notes |
| GET | `/notes/{id}` | Retrieve one note |
| DELETE | `/notes/{id}` | Delete one note |

Base URL example after deployment:

```text
https://<api-id>.execute-api.<region>.amazonaws.com
```

---

## 8. Example Request and Response Behaviour

### 8.1 Create Note

**Request**

```http
POST /notes
Content-Type: application/json
```

```json
{
  "title": "Learn AWS Lambda",
  "content": "Build a simple serverless API."
}
```

**Successful Response**

```json
{
  "message": "Note created successfully",
  "note": {
    "noteId": "generated-uuid",
    "title": "Learn AWS Lambda",
    "content": "Build a simple serverless API.",
    "createdAt": "2026-09-17T12:00:00Z"
  }
}
```

Recommended status code:

```text
201 Created
```

---

### 8.2 Retrieve All Notes

**Request**

```http
GET /notes
```

**Successful Response**

```json
{
  "notes": [
    {
      "noteId": "abc123",
      "title": "Learn AWS Lambda",
      "content": "Build a simple serverless API.",
      "createdAt": "2026-09-17T12:00:00Z"
    }
  ]
}
```

Recommended status code:

```text
200 OK
```

---

### 8.3 Retrieve Specific Note

**Request**

```http
GET /notes/abc123
```

**Successful Response**

```json
{
  "note": {
    "noteId": "abc123",
    "title": "Learn AWS Lambda",
    "content": "Build a simple serverless API.",
    "createdAt": "2026-09-17T12:00:00Z"
  }
}
```

Recommended status code:

```text
200 OK
```

**Not Found Response**

```json
{
  "error": "Note not found"
}
```

Recommended status code:

```text
404 Not Found
```

---

### 8.4 Delete Note

**Request**

```http
DELETE /notes/abc123
```

**Successful Response**

```json
{
  "message": "Note deleted successfully"
}
```

Recommended status code:

```text
200 OK
```

---

## 9. AWS Architecture

### 9.1 Core Architecture

```text
Client
  |
  v
Amazon API Gateway
  |
  v
AWS Lambda
  |
  v
Amazon DynamoDB

AWS Lambda
  |
  +--> Amazon CloudWatch Logs

AWS IAM
  |
  +--> Controls Lambda permissions
```

### 9.2 Required Services

Only the following AWS services are required for MVP:

- AWS Lambda
- Amazon API Gateway
- Amazon DynamoDB
- AWS IAM
- Amazon CloudWatch

No additional AWS services are required.

---

## 10. Request Flow

### Create Note Flow

1. Client sends `POST /notes`.
2. API Gateway receives the HTTP request.
3. API Gateway invokes the Lambda function.
4. Lambda parses the request body.
5. Lambda validates `title` and `content`.
6. Lambda generates a UUID for `noteId`.
7. Lambda creates a UTC timestamp.
8. Lambda writes the note to DynamoDB.
9. DynamoDB confirms the operation.
10. Lambda returns an HTTP response to API Gateway.
11. API Gateway returns the response to the client.
12. Lambda logs are written to CloudWatch.

### Retrieve Note Flow

1. Client sends `GET /notes/{id}`.
2. API Gateway passes the path parameter to Lambda.
3. Lambda extracts the note ID.
4. Lambda queries DynamoDB using the partition key.
5. Lambda returns either:
   - `200` with the note, or
   - `404` if the note does not exist.

---

## 11. AWS Services and Responsibilities

| AWS Service | Responsibility |
|---|---|
| API Gateway | Expose HTTP API endpoints and invoke Lambda |
| Lambda | Execute application logic |
| DynamoDB | Store note records |
| IAM | Grant Lambda permissions to DynamoDB and CloudWatch |
| CloudWatch | Store Lambda logs and support troubleshooting |

---

## 12. Lambda Requirements

### 12.1 Runtime

Use:

```text
Python 3.x
```

Use a currently supported Python runtime available in AWS Lambda.

### 12.2 Lambda Function

For the MVP, use one Lambda function for all routes.

Suggested function name:

```text
serverless-notes-api
```

The function must inspect:

- HTTP method
- Route/path
- Path parameters
- Request body

It must route the request to the correct internal handler.

Example internal functions:

```python
create_note()
get_notes()
get_note()
delete_note()
```

### 12.3 Python Libraries

Use standard library modules where possible:

```python
import json
import os
import uuid
from datetime import datetime, timezone
```

Use AWS-provided `boto3` to communicate with DynamoDB.

### 12.4 Response Format

Lambda responses must include:

```python
{
    "statusCode": 200,
    "headers": {
        "Content-Type": "application/json"
    },
    "body": json.dumps(...)
}
```

### 12.5 Input Validation

For `POST /notes`, Lambda must verify:

- Body exists.
- Body contains valid JSON.
- `title` exists.
- `content` exists.
- `title` is not empty.
- `content` is not empty.

Invalid input must return HTTP `400`.

---

## 13. API Gateway Requirements

Use Amazon API Gateway to expose the Lambda function.

HTTP API is recommended because it is simpler and cost-effective for this learning project.

Required routes:

```text
POST   /notes
GET    /notes
GET    /notes/{id}
DELETE /notes/{id}
```

API Gateway must:

- Receive requests.
- Route requests to the Lambda function.
- Pass request body and path parameters.
- Return Lambda responses to the client.

Authentication is not required in the MVP.

CORS is only required if a browser-based front end is added later.

---

## 14. DynamoDB Requirements

### 14.1 Table Name

Suggested table name:

```text
ServerlessNotes
```

### 14.2 Partition Key

```text
noteId
```

Type:

```text
String
```

### 14.3 Suggested Item Structure

```json
{
  "noteId": "abc123",
  "title": "Learn AWS Lambda",
  "content": "Build a serverless notes API.",
  "createdAt": "2026-09-17T12:00:00Z"
}
```

### 14.4 Capacity Mode

Use:

```text
On-demand
```

This is simpler for a beginner project and avoids capacity planning.

### 14.5 Required DynamoDB Operations

Lambda will require:

```text
dynamodb:PutItem
dynamodb:GetItem
dynamodb:Scan
dynamodb:DeleteItem
```

Do not grant unnecessary DynamoDB permissions.

---

## 15. IAM Permission Requirements

The Lambda execution role must have permission to:

1. Write logs to CloudWatch.
2. Perform required DynamoDB actions on the notes table.

Recommended DynamoDB permissions:

```json
{
  "Effect": "Allow",
  "Action": [
    "dynamodb:PutItem",
    "dynamodb:GetItem",
    "dynamodb:Scan",
    "dynamodb:DeleteItem"
  ],
  "Resource": "<dynamodb-table-arn>"
}
```

Use AWS managed basic Lambda logging permissions where appropriate.

Do not use:

```text
AdministratorAccess
```

Do not grant:

```text
dynamodb:*
```

unless temporarily troubleshooting during learning, and remove it afterwards.

---

## 16. CloudWatch Logging Requirements

Lambda must produce useful logs for troubleshooting.

Recommended log events:

- Request method
- Requested route
- Generated note ID
- DynamoDB operation result
- Validation failures
- Exceptions

Do not log:

- AWS credentials
- Secrets
- Access keys
- Sensitive information

Example:

```python
print(f"Processing request: {method} {path}")
```

Unhandled exceptions should be logged before returning HTTP `500`.

---

## 17. Error Handling Requirements

The API must use meaningful HTTP status codes.

| Situation | Status Code |
|---|---:|
| Request successful | 200 |
| Note created | 201 |
| Invalid input | 400 |
| Note not found | 404 |
| Unsupported route/method | 404 or 405 |
| Internal application error | 500 |

Example `400` response:

```json
{
  "error": "title and content are required"
}
```

Example `500` response:

```json
{
  "error": "Internal server error"
}
```

Do not expose Python stack traces to API clients.

Detailed stack traces may be written to CloudWatch.

---

## 18. Security Requirements

The MVP must follow these practices:

- Do not hard-code AWS access keys.
- Do not store secrets in source code.
- Use the Lambda execution role for AWS access.
- Grant only required DynamoDB permissions.
- Use HTTPS through API Gateway.
- Validate request input.
- Do not expose internal exception details.
- Restrict IAM permissions to the specific DynamoDB table where practical.

Authentication is intentionally excluded from MVP.

---

## 19. Local Development and Testing Requirements

A developer should be able to write and test Python logic locally before deployment.

Suggested local tools:

- Python 3
- VS Code
- `pip`
- AWS CLI
- Postman, Bruno, Insomnia, or `curl`

AWS credentials should be configured using:

```bash
aws configure
```

or another supported AWS credential mechanism.

Credentials must never be committed to the project.

### Optional Local Unit Testing

Python functions that do not require AWS can be tested locally.

Example:

```bash
python -m pytest
```

Unit tests are useful but should not make the beginner MVP unnecessarily complex.

---

## 20. AWS Deployment Requirements

The initial version may be deployed manually using the AWS Console.

### Deployment Order

1. Create DynamoDB table.
2. Create Lambda execution IAM role.
3. Create Lambda function.
4. Add Lambda code.
5. Configure environment variables.
6. Attach required DynamoDB permissions.
7. Create API Gateway HTTP API.
8. Create the required routes.
9. Connect routes to Lambda.
10. Deploy API.
11. Test endpoints.
12. Review CloudWatch logs.

No Terraform, CloudFormation, SAM, CDK, or CI/CD is required for MVP.

---

## 21. Environment and Configuration Requirements

Do not hard-code the DynamoDB table name inside business logic.

Use a Lambda environment variable.

Recommended variable:

```text
NOTES_TABLE_NAME=ServerlessNotes
```

Python example:

```python
TABLE_NAME = os.environ["NOTES_TABLE_NAME"]
```

AWS region should normally be obtained automatically from the Lambda execution environment.

Do not configure static AWS credentials inside Lambda.

---

## 22. Testing and Acceptance Criteria

### AC-01: Create Note

Given a valid request:

```json
{
  "title": "Test",
  "content": "Test content"
}
```

When the client calls:

```text
POST /notes
```

Then:

- Response is `201`.
- A unique `noteId` is returned.
- A `createdAt` timestamp is returned.
- The note exists in DynamoDB.

---

### AC-02: Missing Required Field

Given:

```json
{
  "title": "Test"
}
```

When calling:

```text
POST /notes
```

Then:

- Response is `400`.
- An understandable JSON error is returned.
- No item is written to DynamoDB.

---

### AC-03: Retrieve Notes

When calling:

```text
GET /notes
```

Then:

- Response is `200`.
- Response body contains a `notes` array.

---

### AC-04: Retrieve Existing Note

Given an existing note ID:

When calling:

```text
GET /notes/{id}
```

Then:

- Response is `200`.
- Correct note is returned.

---

### AC-05: Retrieve Missing Note

Given a non-existent note ID:

When calling:

```text
GET /notes/{id}
```

Then:

- Response is `404`.
- Response contains an understandable error message.

---

### AC-06: Delete Note

Given an existing note:

When calling:

```text
DELETE /notes/{id}
```

Then:

- Response is `200`.
- Note is removed from DynamoDB.

---

### AC-07: Logging

For every Lambda invocation:

- A CloudWatch log stream exists.
- Basic request handling information is available.
- Exceptions are logged.

---

### AC-08: Security

The project must not contain:

- AWS access keys
- Secret access keys
- Hard-coded passwords
- Administrator IAM permissions

---

## 23. Troubleshooting Considerations

### Lambda Returns 500

Check:

- CloudWatch logs
- Python exceptions
- Environment variables
- DynamoDB table name
- IAM permissions

### AccessDeniedException

Likely causes:

- Missing DynamoDB permission
- Incorrect table ARN
- Lambda execution role does not contain required policy

Check the Lambda execution role.

### DynamoDB ResourceNotFoundException

Check:

- Table name
- AWS region
- Environment variable
- Table exists in same region as expected

### API Gateway Returns 404

Check:

- Route exists
- HTTP method is correct
- API is deployed
- URL is correct

### Invalid JSON

Check:

- Request `Content-Type`
- Request body format
- JSON parsing inside Lambda

### Lambda Cannot Write Logs

Check that the execution role has basic CloudWatch Logs permissions.

---

## 24. Suggested Project Folder Structure

```text
serverless-notes-api/
│
├── src/
│   ├── lambda_function.py
│   └── notes_service.py
│
├── tests/
│   └── test_notes.py
│
├── events/
│   ├── create_note.json
│   ├── get_notes.json
│   ├── get_note.json
│   └── delete_note.json
│
├── docs/
│   └── PRD.md
│
├── .gitignore
├── requirements.txt
└── README.md
```

For an even simpler beginner version:

```text
serverless-notes-api/
│
├── lambda_function.py
├── README.md
├── PRD.md
└── .gitignore
```

The simpler structure is acceptable for the first implementation.

---

## 25. Future Improvements

Everything in this section is outside the current MVP.

### 25.1 Update Notes

Add:

```text
PUT /notes/{id}
```

or:

```text
PATCH /notes/{id}
```

---

### 25.2 Authentication

Possible future services:

- Amazon Cognito
- JWT authorisation

Authentication must not be added to the beginner MVP.

---

### 25.3 Multi-User Notes

Associate notes with a user ID.

This would require changes to:

- Authentication
- DynamoDB access pattern
- IAM/application logic

---

### 25.4 Pagination

Replace unrestricted table scan behaviour with pagination using:

- `LastEvaluatedKey`
- `ExclusiveStartKey`

---

### 25.5 Infrastructure as Code

After the manual version works, optionally rebuild the infrastructure using:

- AWS SAM
- AWS CDK
- Terraform
- CloudFormation

This should happen only after the learner understands the manual architecture.

---

### 25.6 Automated Testing

Add:

- `pytest`
- mocked DynamoDB tests
- integration tests

---

### 25.7 CI/CD

Optionally deploy through:

- GitHub Actions
- AWS CodePipeline
- Another CI/CD platform

This is outside the current learning scope.

---

### 25.8 Monitoring Improvements

Possible future additions:

- CloudWatch alarms
- Custom metrics
- API Gateway metrics
- Lambda error alarms

---

## 26. Definition of Done

The MVP is complete when:

- DynamoDB table exists.
- Lambda is deployed successfully.
- API Gateway exposes all four required routes.
- `POST /notes` creates notes.
- `GET /notes` returns notes.
- `GET /notes/{id}` returns one note.
- `DELETE /notes/{id}` deletes a note.
- Invalid requests return appropriate errors.
- Lambda can access DynamoDB through IAM.
- Lambda writes logs to CloudWatch.
- No AWS credentials are hard-coded.
- All acceptance criteria pass.
- The project can be understood and reproduced by a beginner.

---

## 27. MVP Summary

### Required

- AWS Lambda
- API Gateway
- DynamoDB
- IAM
- CloudWatch
- Python
- Four API routes
- JSON request/response handling
- Basic validation
- Basic error handling
- Environment variable for table name
- Manual AWS deployment
- CloudWatch logging

### Not Required

- Authentication
- Front end
- Docker
- Kubernetes
- Terraform
- CI/CD
- Cognito
- SQS
- SNS
- Step Functions
- Advanced monitoring
- Multi-user architecture

The project should remain intentionally small until the learner is comfortable with the complete request lifecycle:

```text
Client
  ↓
API Gateway
  ↓
Lambda
  ↓
DynamoDB

Lambda
  ↓
CloudWatch
```
