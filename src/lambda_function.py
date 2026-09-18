import json
import os
import uuid
from datetime import datetime, timezone

import boto3
from botocore.exceptions import ClientError

_table = None


def _get_table():
    global _table
    if _table is None:
        dynamodb = boto3.resource("dynamodb")
        table_name = os.environ.get("NOTES_TABLE_NAME", "ServerlessNotes")
        _table = dynamodb.Table(table_name)
    return _table


def lambda_handler(event, context):
    method = event.get("httpMethod", "")
    path = event.get("path", "")
    path_params = event.get("pathParameters") or {}
    note_id = path_params.get("id")

    print(f"Processing request: {method} {path}")

    try:
        if method == "POST" and path == "/notes":
            return create_note(event)
        elif method == "GET" and path == "/notes":
            return get_notes()
        elif method == "GET" and path.startswith("/notes/") and note_id:
            return get_note(note_id)
        elif method == "DELETE" and path.startswith("/notes/") and note_id:
            return delete_note(note_id)
        else:
            return response(404, {"error": "Route not found"})
    except ClientError as e:
        print(f"DynamoDB error: {e.response['Error']['Message']}")
        return response(500, {"error": "Internal server error"})
    except Exception as e:
        print(f"Unexpected error: {str(e)}")
        return response(500, {"error": "Internal server error"})


def create_note(event):
    try:
        body = json.loads(event.get("body", "{}"))
    except json.JSONDecodeError:
        return response(400, {"error": "Invalid JSON"})

    title = body.get("title", "").strip()
    content = body.get("content", "").strip()

    if not title or not content:
        return response(400, {"error": "title and content are required"})

    note_id = str(uuid.uuid4())
    created_at = datetime.now(timezone.utc).isoformat()

    item = {
        "noteId": note_id,
        "title": title,
        "content": content,
        "createdAt": created_at,
    }

    table = _get_table()
    table.put_item(Item=item)
    print(f"Created note: {note_id}")

    return response(201, {"message": "Note created successfully", "note": item})


def get_notes():
    result = _get_table().scan()
    notes = result.get("Items", [])
    print(f"Retrieved {len(notes)} notes")
    return response(200, {"notes": notes})


def get_note(note_id):
    result = _get_table().get_item(Key={"noteId": note_id})
    item = result.get("Item")

    if not item:
        return response(404, {"error": "Note not found"})

    print(f"Retrieved note: {note_id}")
    return response(200, {"note": item})


def delete_note(note_id):
    t = _get_table()
    result = t.get_item(Key={"noteId": note_id})
    if not result.get("Item"):
        return response(404, {"error": "Note not found"})

    t.delete_item(Key={"noteId": note_id})
    print(f"Deleted note: {note_id}")

    return response(200, {"message": "Note deleted successfully"})


def response(status_code, body):
    return {
        "statusCode": status_code,
        "headers": {"Content-Type": "application/json"},
        "body": json.dumps(body),
    }
