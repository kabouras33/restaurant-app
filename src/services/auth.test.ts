import pytest
from unittest.mock import patch, MagicMock
from src.services.auth import login, register, logout, getToken, isAuthenticated

# Mock data
mock_login_data = {
    "email": "test@example.com",
    "password": "password123"
}

mock_register_data = {
    "name": "Test User",
    "email": "test@example.com",
    "password": "password123"
}

mock_auth_response = {
    "token": "mockToken",
    "user": {
        "id": "1",
        "name": "Test User",
        "email": "test@example.com"
    }
}

@pytest.fixture
def mock_local_storage(mocker):
    mocker.patch('src.services.auth.localStorage.getItem', return_value=None)
    mocker.patch('src.services.auth.localStorage.setItem')
    mocker.patch('src.services.auth.localStorage.removeItem')

@pytest.fixture
def mock_window_location(mocker):
    mocker.patch('src.services.auth.window.location.href', new_callable=mocker.PropertyMock)

@pytest.fixture
def mock_axios_post(mocker):
    return mocker.patch('src.services.auth.api.post')

def test_login_success(mock_axios_post, mock_local_storage):
    # Arrange
    mock_axios_post.return_value = MagicMock(data=mock_auth_response)

    # Act
    result = login(mock_login_data)

    # Assert
    mock_axios_post.assert_called_once_with('/auth/login', mock_login_data)
    assert result == mock_auth_response
    localStorage.setItem.assert_called_once_with('token', mock_auth_response['token'])

def test_login_failure(mock_axios_post, mock_local_storage):
    # Arrange
    mock_axios_post.side_effect = Exception("Login failed")

    # Act & Assert
    with pytest.raises(Exception, match='Login failed. Please check your credentials.'):
        login(mock_login_data)

def test_register_success(mock_axios_post, mock_local_storage):
    # Arrange
    mock_axios_post.return_value = MagicMock(data=mock_auth_response)

    # Act
    result = register(mock_register_data)

    # Assert
    mock_axios_post.assert_called_once_with('/auth/register', mock_register_data)
    assert result == mock_auth_response
    localStorage.setItem.assert_called_once_with('token', mock_auth_response['token'])

def test_register_failure(mock_axios_post, mock_local_storage):
    # Arrange
    mock_axios_post.side_effect = Exception("Registration failed")

    # Act & Assert
    with pytest.raises(Exception, match='Registration failed. Please try again.'):
        register(mock_register_data)

def test_logout(mock_local_storage, mock_window_location):
    # Act
    logout()

    # Assert
    localStorage.removeItem.assert_called_once_with('token')
    assert window.location.href == '/login'

def test_get_token(mock_local_storage):
    # Arrange
    localStorage.getItem.return_value = 'mockToken'

    # Act
    token = getToken()

    # Assert
    assert token == 'mockToken'

def test_get_token_no_token(mock_local_storage):
    # Arrange
    localStorage.getItem.return_value = None

    # Act
    token = getToken()

    # Assert
    assert token is None

def test_is_authenticated_true(mock_local_storage):
    # Arrange
    localStorage.getItem.return_value = 'mockToken'

    # Act
    result = isAuthenticated()

    # Assert
    assert result is True

def test_is_authenticated_false(mock_local_storage):
    # Arrange
    localStorage.getItem.return_value = None

    # Act
    result = isAuthenticated()

    # Assert
    assert result is False