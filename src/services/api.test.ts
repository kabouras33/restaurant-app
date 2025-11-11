import pytest
from unittest.mock import patch, MagicMock
from src.services.api import (
    login,
    fetchReservations,
    createReservation,
    fetchInventory,
    updateInventory,
    processPayment,
    apiClient
)
from requests.exceptions import Timeout

@pytest.fixture
def mock_api_client():
    with patch('src.services.api.apiClient') as mock:
        yield mock

@pytest.fixture
def mock_use_auth():
    with patch('src.services.api.useAuth') as mock:
        yield mock

def test_login_success(mock_api_client):
    # Arrange
    mock_response = MagicMock()
    mock_response.data = {
        'data': {'token': 'test_token', 'user': {'id': '1', 'name': 'John Doe', 'email': 'john@example.com'}},
        'message': 'Login successful',
        'success': True
    }
    mock_api_client.post.return_value = mock_response

    # Act
    response = login('john@example.com', 'password123')

    # Assert
    assert response['data']['token'] == 'test_token'
    assert response['message'] == 'Login successful'
    assert response['success'] is True

def test_login_failure(mock_api_client):
    # Arrange
    mock_api_client.post.side_effect = Exception('Login failed')

    # Act & Assert
    with pytest.raises(Exception, match='Login failed'):
        login('john@example.com', 'wrongpassword')

def test_fetch_reservations_success(mock_api_client):
    # Arrange
    mock_response = MagicMock()
    mock_response.data = {'data': [], 'message': 'Fetched successfully', 'success': True}
    mock_api_client.get.return_value = mock_response

    # Act
    response = fetchReservations()

    # Assert
    assert response['data'] == []
    assert response['message'] == 'Fetched successfully'
    assert response['success'] is True

def test_fetch_reservations_failure(mock_api_client):
    # Arrange
    mock_api_client.get.side_effect = Exception('Failed to fetch reservations')

    # Act & Assert
    with pytest.raises(Exception, match='Failed to fetch reservations'):
        fetchReservations()

def test_create_reservation_success(mock_api_client):
    # Arrange
    mock_response = MagicMock()
    mock_response.data = {'data': {'reservationId': '123'}, 'message': 'Created successfully', 'success': True}
    mock_api_client.post.return_value = mock_response

    # Act
    response = createReservation({'date': '2023-10-10'})

    # Assert
    assert response['data']['reservationId'] == '123'
    assert response['message'] == 'Created successfully'
    assert response['success'] is True

def test_create_reservation_failure(mock_api_client):
    # Arrange
    mock_api_client.post.side_effect = Exception('Failed to create reservation')

    # Act & Assert
    with pytest.raises(Exception, match='Failed to create reservation'):
        createReservation({'date': '2023-10-10'})

def test_fetch_inventory_success(mock_api_client):
    # Arrange
    mock_response = MagicMock()
    mock_response.data = {'data': [], 'message': 'Inventory fetched', 'success': True}
    mock_api_client.get.return_value = mock_response

    # Act
    response = fetchInventory()

    # Assert
    assert response['data'] == []
    assert response['message'] == 'Inventory fetched'
    assert response['success'] is True

def test_fetch_inventory_failure(mock_api_client):
    # Arrange
    mock_api_client.get.side_effect = Exception('Failed to fetch inventory')

    # Act & Assert
    with pytest.raises(Exception, match='Failed to fetch inventory'):
        fetchInventory()

def test_update_inventory_success(mock_api_client):
    # Arrange
    mock_response = MagicMock()
    mock_response.data = {'data': {'inventoryId': '456'}, 'message': 'Updated successfully', 'success': True}
    mock_api_client.put.return_value = mock_response

    # Act
    response = updateInventory({'item': 'New Item'})

    # Assert
    assert response['data']['inventoryId'] == '456'
    assert response['message'] == 'Updated successfully'
    assert response['success'] is True

def test_update_inventory_failure(mock_api_client):
    # Arrange
    mock_api_client.put.side_effect = Exception('Failed to update inventory')

    # Act & Assert
    with pytest.raises(Exception, match='Failed to update inventory'):
        updateInventory({'item': 'New Item'})

def test_process_payment_success(mock_api_client):
    # Arrange
    mock_response = MagicMock()
    mock_response.data = {'data': {'paymentId': '789'}, 'message': 'Payment processed', 'success': True}
    mock_api_client.post.return_value = mock_response

    # Act
    response = processPayment({'amount': 100})

    # Assert
    assert response['data']['paymentId'] == '789'
    assert response['message'] == 'Payment processed'
    assert response['success'] is True

def test_process_payment_failure(mock_api_client):
    # Arrange
    mock_api_client.post.side_effect = Exception('Failed to process payment')

    # Act & Assert
    with pytest.raises(Exception, match='Failed to process payment'):
        processPayment({'amount': 100})

def test_api_client_timeout(mock_api_client):
    # Arrange
    mock_api_client.post.side_effect = Timeout

    # Act & Assert
    with pytest.raises(Timeout):
        login('john@example.com', 'password123')

def test_request_interceptor_adds_auth_header(mock_use_auth, mock_api_client):
    # Arrange
    mock_use_auth.return_value.user = {'token': 'test_token'}

    # Act
    apiClient.interceptors.request.handlers[0].fulfilled({'headers': {}})

    # Assert
    assert mock_api_client.post.call_args[1]['headers']['Authorization'] == 'Bearer test_token'

def test_response_interceptor_handles_unauthorized(mock_use_auth, mock_api_client):
    # Arrange
    mock_error = MagicMock()
    mock_error.response = MagicMock(status=401, data={'message': 'Unauthorized'})

    # Act
    with pytest.raises(Exception, match='Unauthorized'):
        apiClient.interceptors.response.handlers[0].rejected(mock_error)

    # Assert
    mock_use_auth.return_value.logout.assert_called_once()