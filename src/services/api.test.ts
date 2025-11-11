import pytest
from unittest.mock import patch, MagicMock
from src.services.api import (
    login,
    fetchUserProfile,
    updateUserProfile,
    fetchReservations,
    createReservation,
    fetchInventory,
    updateInventoryItem,
    apiClient
)
from axios import AxiosResponse

# Helper function to create a mock AxiosResponse
def create_mock_response(data, status=200):
    mock_response = MagicMock(spec=AxiosResponse)
    mock_response.data = {'data': data, 'message': 'Success', 'success': True}
    mock_response.status_code = status
    return mock_response

# Helper function to create a mock error response
def create_mock_error_response(message, status=400):
    mock_response = MagicMock(spec=AxiosResponse)
    mock_response.data = {'message': message}
    mock_response.status_code = status
    return mock_response

@pytest.fixture
def mock_api_client():
    with patch('src.services.api.apiClient') as mock:
        yield mock

def test_login_success(mock_api_client):
    # Arrange
    mock_response = create_mock_response({'token': 'fake-token', 'user': {'id': '1', 'name': 'John Doe', 'email': 'john@example.com'}})
    mock_api_client.post.return_value = mock_response

    # Act
    result = login('john@example.com', 'password')

    # Assert
    assert result['token'] == 'fake-token'
    assert result['user']['name'] == 'John Doe'
    mock_api_client.post.assert_called_with('/auth/login', {'email': 'john@example.com', 'password': 'password'})

def test_login_failure(mock_api_client):
    # Arrange
    mock_api_client.post.side_effect = Exception('Invalid credentials')

    # Act & Assert
    with pytest.raises(Exception, match='Invalid credentials'):
        login('john@example.com', 'wrongpassword')

def test_fetch_user_profile_success(mock_api_client):
    # Arrange
    mock_response = create_mock_response({'id': '1', 'name': 'John Doe', 'email': 'john@example.com'})
    mock_api_client.get.return_value = mock_response

    # Act
    result = fetchUserProfile()

    # Assert
    assert result['name'] == 'John Doe'
    mock_api_client.get.assert_called_with('/user/profile')

def test_fetch_user_profile_failure(mock_api_client):
    # Arrange
    mock_api_client.get.side_effect = Exception('User not found')

    # Act & Assert
    with pytest.raises(Exception, match='User not found'):
        fetchUserProfile()

def test_update_user_profile_success(mock_api_client):
    # Arrange
    mock_response = create_mock_response({'id': '1', 'name': 'Jane Doe', 'email': 'jane@example.com'})
    mock_api_client.put.return_value = mock_response

    # Act
    result = updateUserProfile({'name': 'Jane Doe'})

    # Assert
    assert result['name'] == 'Jane Doe'
    mock_api_client.put.assert_called_with('/user/profile', {'name': 'Jane Doe'})

def test_update_user_profile_failure(mock_api_client):
    # Arrange
    mock_api_client.put.side_effect = Exception('Update failed')

    # Act & Assert
    with pytest.raises(Exception, match='Update failed'):
        updateUserProfile({'name': 'Jane Doe'})

def test_fetch_reservations_success(mock_api_client):
    # Arrange
    mock_response = create_mock_response([{'id': '1', 'item': 'Room 101'}])
    mock_api_client.get.return_value = mock_response

    # Act
    result = fetchReservations()

    # Assert
    assert len(result) == 1
    assert result[0]['item'] == 'Room 101'
    mock_api_client.get.assert_called_with('/reservations')

def test_fetch_reservations_failure(mock_api_client):
    # Arrange
    mock_api_client.get.side_effect = Exception('No reservations found')

    # Act & Assert
    with pytest.raises(Exception, match='No reservations found'):
        fetchReservations()

def test_create_reservation_success(mock_api_client):
    # Arrange
    mock_response = create_mock_response({'id': '1', 'item': 'Room 101'})
    mock_api_client.post.return_value = mock_response

    # Act
    result = createReservation({'item': 'Room 101'})

    # Assert
    assert result['item'] == 'Room 101'
    mock_api_client.post.assert_called_with('/reservations', {'item': 'Room 101'})

def test_create_reservation_failure(mock_api_client):
    # Arrange
    mock_api_client.post.side_effect = Exception('Reservation failed')

    # Act & Assert
    with pytest.raises(Exception, match='Reservation failed'):
        createReservation({'item': 'Room 101'})

def test_fetch_inventory_success(mock_api_client):
    # Arrange
    mock_response = create_mock_response([{'id': '1', 'name': 'Item A'}])
    mock_api_client.get.return_value = mock_response

    # Act
    result = fetchInventory()

    # Assert
    assert len(result) == 1
    assert result[0]['name'] == 'Item A'
    mock_api_client.get.assert_called_with('/inventory')

def test_fetch_inventory_failure(mock_api_client):
    # Arrange
    mock_api_client.get.side_effect = Exception('Inventory not found')

    # Act & Assert
    with pytest.raises(Exception, match='Inventory not found'):
        fetchInventory()

def test_update_inventory_item_success(mock_api_client):
    # Arrange
    mock_response = create_mock_response({'id': '1', 'name': 'Updated Item'})
    mock_api_client.put.return_value = mock_response

    # Act
    result = updateInventoryItem('1', {'name': 'Updated Item'})

    # Assert
    assert result['name'] == 'Updated Item'
    mock_api_client.put.assert_called_with('/inventory/1', {'name': 'Updated Item'})

def test_update_inventory_item_failure(mock_api_client):
    # Arrange
    mock_api_client.put.side_effect = Exception('Update failed')

    # Act & Assert
    with pytest.raises(Exception, match='Update failed'):
        updateInventoryItem('1', {'name': 'Updated Item'})