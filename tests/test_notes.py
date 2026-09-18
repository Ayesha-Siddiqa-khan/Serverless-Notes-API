import json
import os
import sys
from unittest.mock import MagicMock, patch

sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", "src"))

with patch("boto3.resource"):
    import lambda_function


def test_create_note_success():
    event = {
        "httpMethod": "POST",
        "path": "/notes",
        "body": json.dumps({"title": "Test", "content": "Content"}),
    }
    mock_table = MagicMock()
    mock_table.put_item.return_value = {}
    with patch.object(lambda_function, "_get_table", return_value=mock_table):
        result = lambda_function.lambda_handler(event, None)
    assert result["statusCode"] == 201
    body = json.loads(result["body"])
    assert body["message"] == "Note created successfully"
    assert "noteId" in body["note"]


def test_create_note_missing_fields():
    event = {
        "httpMethod": "POST",
        "path": "/notes",
        "body": json.dumps({"title": "Test"}),
    }
    result = lambda_function.lambda_handler(event, None)
    assert result["statusCode"] == 400


def test_create_note_invalid_json():
    event = {"httpMethod": "POST", "path": "/notes", "body": "not json"}
    result = lambda_function.lambda_handler(event, None)
    assert result["statusCode"] == 400


def test_get_notes():
    event = {"httpMethod": "GET", "path": "/notes"}
    mock_table = MagicMock()
    mock_table.scan.return_value = {"Items": [{"noteId": "1", "title": "T"}]}
    with patch.object(lambda_function, "_get_table", return_value=mock_table):
        result = lambda_function.lambda_handler(event, None)
    assert result["statusCode"] == 200
    body = json.loads(result["body"])
    assert len(body["notes"]) == 1


def test_get_note_found():
    event = {
        "httpMethod": "GET",
        "path": "/notes/abc123",
        "pathParameters": {"id": "abc123"},
    }
    mock_table = MagicMock()
    mock_table.get_item.return_value = {"Item": {"noteId": "abc123", "title": "T"}}
    with patch.object(lambda_function, "_get_table", return_value=mock_table):
        result = lambda_function.lambda_handler(event, None)
    assert result["statusCode"] == 200


def test_get_note_not_found():
    event = {
        "httpMethod": "GET",
        "path": "/notes/missing",
        "pathParameters": {"id": "missing"},
    }
    mock_table = MagicMock()
    mock_table.get_item.return_value = {}
    with patch.object(lambda_function, "_get_table", return_value=mock_table):
        result = lambda_function.lambda_handler(event, None)
    assert result["statusCode"] == 404


def test_delete_note_found():
    event = {
        "httpMethod": "DELETE",
        "path": "/notes/abc123",
        "pathParameters": {"id": "abc123"},
    }
    mock_table = MagicMock()
    mock_table.get_item.return_value = {"Item": {"noteId": "abc123"}}
    mock_table.delete_item.return_value = {}
    with patch.object(lambda_function, "_get_table", return_value=mock_table):
        result = lambda_function.lambda_handler(event, None)
    assert result["statusCode"] == 200


def test_delete_note_not_found():
    event = {
        "httpMethod": "DELETE",
        "path": "/notes/missing",
        "pathParameters": {"id": "missing"},
    }
    mock_table = MagicMock()
    mock_table.get_item.return_value = {}
    with patch.object(lambda_function, "_get_table", return_value=mock_table):
        result = lambda_function.lambda_handler(event, None)
    assert result["statusCode"] == 404


def test_unknown_route():
    event = {"httpMethod": "GET", "path": "/unknown"}
    result = lambda_function.lambda_handler(event, None)
    assert result["statusCode"] == 404
