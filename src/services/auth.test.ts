import pytest
from unittest.mock import patch, MagicMock
from src.services.auth import AuthService

@pytest.fixture
def auth_service():
    return AuthService()

def test_login_success(auth_service):
    # Arrange
    mock_response = MagicMock()
    mock_response.data = {
        'token': 'test-token',
        'user': {
            'id': '123',
            'name': 'Test User',
            'email': 'test@example.com'
        }
    }
    with patch('src.services.auth.axios.post', return_value=mock_response):
        # Act
        result = auth_service.login('test@example.com', 'password123')

        # Assert
        assert result['token'] == 'test-token'
        assert result['user']['id'] == '123'
        assert result['user']['name'] == 'Test User'
        assert result['user']['email'] == 'test@example.com'

def test_login_failure(auth_service):
    # Arrange
    mock_response = MagicMock()
    mock_response.response = {'data': {'message': 'Invalid credentials'}}
    with patch('src.services.auth.axios.post', side_effect=Exception(mock_response)):
        # Act & Assert
        with pytest.raises(Exception) as exc_info:
            auth_service.login('test@example.com', 'wrongpassword')
        assert str(exc_info.value) == 'Invalid credentials'

def test_logout(auth_service):
    # Arrange
    auth_service.token = 'test-token'
    # Act
    auth_service.logout()
    # Assert
    assert auth_service.token is None

def test_refresh_token_success(auth_service):
    # Arrange
    mock_response = MagicMock()
    mock_response.data = {'token': 'new-token'}
    with patch('src.services.auth.axios.post', return_value=mock_response):
        # Act
        auth_service.refreshToken()
        # Assert
        assert auth_service.token == 'new-token'

def test_refresh_token_failure(auth_service):
    # Arrange
    mock_response = MagicMock()
    mock_response.response = {'data': {'message': 'Token refresh failed'}}
    with patch('src.services.auth.axios.post', side_effect=Exception(mock_response)):
        # Act & Assert
        with pytest.raises(Exception) as exc_info:
            auth_service.refreshToken()
        assert str(exc_info.value) == 'Token refresh failed'

def test_is_authenticated_when_token_exists(auth_service):
    # Arrange
    auth_service.token = 'test-token'
    # Act
    result = auth_service.isAuthenticated()
    # Assert
    assert result is True

def test_is_authenticated_when_token_is_none(auth_service):
    # Arrange
    auth_service.token = None
    # Act
    result = auth_service.isAuthenticated()
    # Assert
    assert result is False