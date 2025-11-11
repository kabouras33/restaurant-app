import pytest
from unittest.mock import patch, Mock
from src.services.auth import login, register, logout, getCurrentUser, api
import localStorageMock from 'localStorageMock'

@pytest.fixture(autouse=True)
def setup_and_teardown():
    # Setup: Mock localStorage
    localStorageMock.clear()
    yield
    # Teardown: Clear localStorage
    localStorageMock.clear()

@patch('src.services.auth.api.post')
def test_login_successful(mock_post):
    # Arrange
    mock_response = Mock()
    mock_response.data = {
        'token': 'fake-token',
        'user': {
            'id': '1',
            'name': 'John Doe',
            'email': 'john@example.com'
        }
    }
    mock_post.return_value = mock_response
    login_data = {'email': 'john@example.com', 'password': 'securepassword'}

    # Act
    result = login(login_data)

    # Assert
    assert result['token'] == 'fake-token'
    assert result['user']['name'] == 'John Doe'
    assert localStorageMock.getItem('authToken') == 'fake-token'

@patch('src.services.auth.api.post')
def test_login_failure(mock_post):
    # Arrange
    mock_post.side_effect = Exception('Invalid email or password')
    login_data = {'email': 'wrong@example.com', 'password': 'wrongpassword'}

    # Act & Assert
    with pytest.raises(Exception, match='Invalid email or password'):
        login(login_data)

@patch('src.services.auth.api.post')
def test_register_successful(mock_post):
    # Arrange
    mock_response = Mock()
    mock_response.data = {
        'token': 'new-token',
        'user': {
            'id': '2',
            'name': 'Jane Doe',
            'email': 'jane@example.com'
        }
    }
    mock_post.return_value = mock_response
    register_data = {'name': 'Jane Doe', 'email': 'jane@example.com', 'password': 'securepassword'}

    # Act
    result = register(register_data)

    # Assert
    assert result['token'] == 'new-token'
    assert result['user']['name'] == 'Jane Doe'
    assert localStorageMock.getItem('authToken') == 'new-token'

@patch('src.services.auth.api.post')
def test_register_failure(mock_post):
    # Arrange
    mock_post.side_effect = Exception('Registration error')
    register_data = {'name': 'Jane Doe', 'email': 'jane@example.com', 'password': 'weak'}

    # Act & Assert
    with pytest.raises(Exception, match='Registration error'):
        register(register_data)

def test_logout():
    # Arrange
    localStorageMock.setItem('authToken', 'some-token')

    # Act
    logout()

    # Assert
    assert localStorageMock.getItem('authToken') is None

@patch('src.services.auth.api.get')
def test_get_current_user_successful(mock_get):
    # Arrange
    mock_response = Mock()
    mock_response.data = {
        'id': '3',
        'name': 'Alice',
        'email': 'alice@example.com'
    }
    mock_get.return_value = mock_response

    # Act
    result = getCurrentUser()

    # Assert
    assert result['name'] == 'Alice'
    assert result['email'] == 'alice@example.com'

@patch('src.services.auth.api.get')
def test_get_current_user_failure(mock_get):
    # Arrange
    mock_get.side_effect = Exception('Failed to fetch current user')

    # Act
    result = getCurrentUser()

    # Assert
    assert result is None