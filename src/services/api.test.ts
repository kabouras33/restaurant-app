import pytest
from unittest.mock import patch, MagicMock
from src.services.api import (
    login,
    fetchReservations,
    createReservation,
    fetchInventory,
    updateInventory,
    fetchNotifications,
    apiClient
)
from requests.exceptions import Timeout

# Helper function to mock axios responses
def mock_axios_response(data=None, message='Success', success=True, status_code=200):
    response = MagicMock()
    response.status_code = status_code
    response.data = {
        'data': data,
        'message': message,
        'success': success
    }
    return response

# Test login function
@patch('src.services.api.apiClient.post')
def test_login_success(mock_post):
    # Arrange
    mock_post.return_value = mock_axios_response(data={'token': 'fake-token'})
    email = 'test@example.com'
    password = 'password123'
    
    # Act
    response = login(email, password)
    
    # Assert
    assert response['data']['token'] == 'fake-token'
    assert response['message'] == 'Success'
    assert response['success'] is True

@patch('src.services.api.apiClient.post')
def test_login_failure(mock_post):
    # Arrange
    mock_post.side_effect = Exception('Login failed')
    email = 'test@example.com'
    password = 'wrongpassword'
    
    # Act & Assert
    with pytest.raises(Exception) as excinfo:
        login(email, password)
    assert str(excinfo.value) == 'Login failed'

# Test fetchReservations function
@patch('src.services.api.apiClient.get')
def test_fetch_reservations_success(mock_get):
    # Arrange
    mock_get.return_value = mock_axios_response(data=[{'id': 1, 'name': 'Reservation 1'}])
    
    # Act
    response = fetchReservations()
    
    # Assert
    assert response['data'][0]['name'] == 'Reservation 1'
    assert response['message'] == 'Success'
    assert response['success'] is True

@patch('src.services.api.apiClient.get')
def test_fetch_reservations_network_error(mock_get):
    # Arrange
    mock_get.side_effect = Timeout('Network error')
    
    # Act & Assert
    with pytest.raises(Exception) as excinfo:
        fetchReservations()
    assert str(excinfo.value) == 'Network error'

# Test createReservation function
@patch('src.services.api.apiClient.post')
def test_create_reservation_success(mock_post):
    # Arrange
    reservation_data = {'name': 'New Reservation'}
    mock_post.return_value = mock_axios_response(data=reservation_data)
    
    # Act
    response = createReservation(reservation_data)
    
    # Assert
    assert response['data']['name'] == 'New Reservation'
    assert response['message'] == 'Success'
    assert response['success'] is True

@patch('src.services.api.apiClient.post')
def test_create_reservation_failure(mock_post):
    # Arrange
    mock_post.side_effect = Exception('Creation failed')
    reservation_data = {'name': 'New Reservation'}
    
    # Act & Assert
    with pytest.raises(Exception) as excinfo:
        createReservation(reservation_data)
    assert str(excinfo.value) == 'Creation failed'

# Test fetchInventory function
@patch('src.services.api.apiClient.get')
def test_fetch_inventory_success(mock_get):
    # Arrange
    mock_get.return_value = mock_axios_response(data=[{'id': 1, 'item': 'Inventory Item 1'}])
    
    # Act
    response = fetchInventory()
    
    # Assert
    assert response['data'][0]['item'] == 'Inventory Item 1'
    assert response['message'] == 'Success'
    assert response['success'] is True

@patch('src.services.api.apiClient.get')
def test_fetch_inventory_failure(mock_get):
    # Arrange
    mock_get.side_effect = Exception('Fetch failed')
    
    # Act & Assert
    with pytest.raises(Exception) as excinfo:
        fetchInventory()
    assert str(excinfo.value) == 'Fetch failed'

# Test updateInventory function
@patch('src.services.api.apiClient.put')
def test_update_inventory_success(mock_put):
    # Arrange
    inventory_id = '123'
    inventory_data = {'item': 'Updated Inventory Item'}
    mock_put.return_value = mock_axios_response(data=inventory_data)
    
    # Act
    response = updateInventory(inventory_id, inventory_data)
    
    # Assert
    assert response['data']['item'] == 'Updated Inventory Item'
    assert response['message'] == 'Success'
    assert response['success'] is True

@patch('src.services.api.apiClient.put')
def test_update_inventory_failure(mock_put):
    # Arrange
    mock_put.side_effect = Exception('Update failed')
    inventory_id = '123'
    inventory_data = {'item': 'Updated Inventory Item'}
    
    # Act & Assert
    with pytest.raises(Exception) as excinfo:
        updateInventory(inventory_id, inventory_data)
    assert str(excinfo.value) == 'Update failed'

# Test fetchNotifications function
@patch('src.services.api.apiClient.get')
def test_fetch_notifications_success(mock_get):
    # Arrange
    mock_get.return_value = mock_axios_response(data=[{'id': 1, 'notification': 'Notification 1'}])
    
    # Act
    response = fetchNotifications()
    
    # Assert
    assert response['data'][0]['notification'] == 'Notification 1'
    assert response['message'] == 'Success'
    assert response['success'] is True

@patch('src.services.api.apiClient.get')
def test_fetch_notifications_failure(mock_get):
    # Arrange
    mock_get.side_effect = Exception('Fetch failed')
    
    # Act & Assert
    with pytest.raises(Exception) as excinfo:
        fetchNotifications()
    assert str(excinfo.value) == 'Fetch failed'