# Serverless Notes API

A beginner-friendly AWS serverless project built with Lambda, API Gateway, DynamoDB, and Python.

## Architecture

```
Client → API Gateway → Lambda → DynamoDB
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/notes` | Create a note |
| GET | `/notes` | List all notes |
| GET | `/notes/{id}` | Get a note |
| DELETE | `/notes/{id}` | Delete a note |

## Project Structure

```
src/                  - Lambda function code
tests/                - Unit tests
events/               - Sample API Gateway events
terraform/            - AWS infrastructure (IaC)
k8s/                  - Kubernetes manifests
.github/workflows/    - CI/CD pipeline
```

## Local Development

```bash
pip install -r requirements.txt
python -m pytest tests/ -v
```

## Deploy

### Terraform (Windows)
```bash
cd terraform
run-terraform.bat
```

### Terraform (Linux/Mac)
```bash
cd terraform
chmod +x scripts/deploy.sh
./scripts/deploy.sh
```

### Docker
```bash
docker build -t serverless-notes-api .
```

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `NOTES_TABLE_NAME` | DynamoDB table name | `ServerlessNotes` |
