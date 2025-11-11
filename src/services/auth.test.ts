import pytest
from unittest.mock import patch, MagicMock
from src.services.auth import AuthService, LoginRequest, LoginResponse, ErrorResponse

@pytest.fixture
def auth_service():
    return AuthService()

@pytest.fixture
def login_request():
    return {
        "email": "test@example.com",
        "password": "securepassword"
    }

@pytest.fixture
def login_response():
    return {
        "token": "mocked_token",
        "user": {
            "id": "123",
            "name": "Test User",
            "email": "test@example.com"
        }
    }

@pytest.fixture
def error_response():
    return {
        "message": "Login failed"
    }

@patch('src.services.auth.localStorage')
@patch('src.services.auth.axios.create')
def test_login_success(mock_axios_create, mock_local_storage, auth_service, login_request, login_response):
    # Arrange
    mock_api = MagicMock()
    mock_axios_create.return_value = mock_api
    mock_api.post.return_value = MagicMock(status_code=200, data=login_response)

    # Act
    response = auth_service.login(login_request)

    # Assert
    assert response == login_response
    mock_local_storage.setItem.assert_called_once_with('token', login_response['token'])

@patch('src.services.auth.localStorage')
@patch('src.services.auth.axios.create')
def test_login_failure(mock_axios_create, mock_local_storage, auth_service, login_request, error_response):
    # Arrange
    mock_api = MagicMock()
    mock_axios_create.return_value = mock_api
    mock_api.post.side_effect = Exception("Login failed")

    # Act
    response = auth_service.login(login_request)

    # Assert
    assert response == error_response
    mock_local_storage.setItem.assert_not_called()

@patch('src.services.auth.localStorage')
def test_logout(auth_service, mock_local_storage):
    # Arrange
    auth_service.token = "mocked_token"

    # Act
    auth_service.logout()

    # Assert
    assert auth_service.token is None
    mock_local_storage.removeItem.assert_called_once_with('token')

@patch('src.services.auth.axios.create')
def test_fetch_user_profile_success(mock_axios_create, auth_service, login_response):
    # Arrange
    mock_api = MagicMock()
    mock_axios_create.return_value = mock_api
    mock_api.get.return_value = MagicMock(status_code=200, data=login_response['user'])

    # Act
    response = auth_service.fetchUserProfile()

    # Assert
    assert response == login_response['user']

@patch('src.services.auth.axios.create')
def test_fetch_user_profile_failure(mock_axios_create, auth_service, error_response):
    # Arrange
    mock_api = MagicMock()
    mock_axios_create.return_value = mock_api
    mock_api.get.side_effect = Exception("Failed to fetch user profile")

    # Act
    response = auth_service.fetchUserProfile()

    # Assert
    assert response == error_response

def test_is_authenticated_true(auth_service):
    # Arrange
    auth_service.token = "mocked_token"

    # Act
    result = auth_service.isAuthenticated()

    # Assert
    assert result is True

def test_is_authenticated_false(auth_service):
    # Arrange
    auth_service.token = None

    # Act
    result = auth_service.isAuthenticated()

    # Assert
    assert result is False
```
