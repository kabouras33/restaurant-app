import pytest
from unittest.mock import patch, MagicMock
from src.services.api import (
    fetchReservations,
    createReservation,
    updateReservation,
    deleteReservation,
    fetchInventory,
    updateInventoryItem,
    deleteInventoryItem,
    processPayment,
    api
)
from axios import AxiosError

@pytest.fixture
def mock_auth_context():
    with patch('src.services.api.useAuth') as mock_use_auth:
        mock_use_auth.return_value = {'user': {'token': 'test-token'}}
        yield mock_use_auth

@pytest.fixture
def mock_axios():
    with patch('src.services.api.axios') as mock_axios:
        yield mock_axios

def test_fetch_reservations_success(mock_axios, mock_auth_context):
    # Arrange
    mock_axios.get.return_value = MagicMock(data={'reservations': []}, statusText='OK')
    
    # Act
    response = fetchReservations()
    
    # Assert
    assert response.data == {'reservations': []}
    assert response.message == 'OK'
    assert response.success is True
    mock_axios.get.assert_called_once_with('/reservations')

def test_fetch_reservations_error(mock_axios, mock_auth_context):
    # Arrange
    mock_axios.get.side_effect = AxiosError(response=MagicMock(data={'message': 'Error'}, status=400))
    
    # Act & Assert
    with pytest.raises(Exception) as exc_info:
        fetchReservations()
    assert exc_info.value.message == 'Error'
    assert exc_info.value.status == 400

def test_create_reservation_success(mock_axios, mock_auth_context):
    # Arrange
    reservation_data = {'date': '2023-10-10'}
    mock_axios.post.return_value = MagicMock(data={'reservationId': 1}, statusText='Created')
    
    # Act
    response = createReservation(reservation_data)
    
    # Assert
    assert response.data == {'reservationId': 1}
    assert response.message == 'Created'
    assert response.success is True
    mock_axios.post.assert_called_once_with('/reservations', reservation_data)

def test_create_reservation_error(mock_axios, mock_auth_context):
    # Arrange
    reservation_data = {'date': '2023-10-10'}
    mock_axios.post.side_effect = AxiosError(response=MagicMock(data={'message': 'Error'}, status=400))
    
    # Act & Assert
    with pytest.raises(Exception) as exc_info:
        createReservation(reservation_data)
    assert exc_info.value.message == 'Error'
    assert exc_info.value.status == 400

def test_update_reservation_success(mock_axios, mock_auth_context):
    # Arrange
    reservation_data = {'date': '2023-10-10'}
    mock_axios.put.return_value = MagicMock(data={'success': True}, statusText='OK')
    
    # Act
    response = updateReservation('1', reservation_data)
    
    # Assert
    assert response.data == {'success': True}
    assert response.message == 'OK'
    assert response.success is True
    mock_axios.put.assert_called_once_with('/reservations/1', reservation_data)

def test_update_reservation_error(mock_axios, mock_auth_context):
    # Arrange
    reservation_data = {'date': '2023-10-10'}
    mock_axios.put.side_effect = AxiosError(response=MagicMock(data={'message': 'Error'}, status=400))
    
    # Act & Assert
    with pytest.raises(Exception) as exc_info:
        updateReservation('1', reservation_data)
    assert exc_info.value.message == 'Error'
    assert exc_info.value.status == 400

def test_delete_reservation_success(mock_axios, mock_auth_context):
    # Arrange
    mock_axios.delete.return_value = MagicMock(data={'success': True}, statusText='OK')
    
    # Act
    response = deleteReservation('1')
    
    # Assert
    assert response.data == {'success': True}
    assert response.message == 'OK'
    assert response.success is True
    mock_axios.delete.assert_called_once_with('/reservations/1')

def test_delete_reservation_error(mock_axios, mock_auth_context):
    # Arrange
    mock_axios.delete.side_effect = AxiosError(response=MagicMock(data={'message': 'Error'}, status=400))
    
    # Act & Assert
    with pytest.raises(Exception) as exc_info:
        deleteReservation('1')
    assert exc_info.value.message == 'Error'
    assert exc_info.value.status == 400

def test_fetch_inventory_success(mock_axios, mock_auth_context):
    # Arrange
    mock_axios.get.return_value = MagicMock(data={'inventory': []}, statusText='OK')
    
    # Act
    response = fetchInventory()
    
    # Assert
    assert response.data == {'inventory': []}
    assert response.message == 'OK'
    assert response.success is True
    mock_axios.get.assert_called_once_with('/inventory')

def test_fetch_inventory_error(mock_axios, mock_auth_context):
    # Arrange
    mock_axios.get.side_effect = AxiosError(response=MagicMock(data={'message': 'Error'}, status=400))
    
    # Act & Assert
    with pytest.raises(Exception) as exc_info:
        fetchInventory()
    assert exc_info.value.message == 'Error'
    assert exc_info.value.status == 400

def test_update_inventory_item_success(mock_axios, mock_auth_context):
    # Arrange
    item_data = {'name': 'item1'}
    mock_axios.put.return_value = MagicMock(data={'success': True}, statusText='OK')
    
    # Act
    response = updateInventoryItem('1', item_data)
    
    # Assert
    assert response.data == {'success': True}
    assert response.message == 'OK'
    assert response.success is True
    mock_axios.put.assert_called_once_with('/inventory/1', item_data)

def test_update_inventory_item_error(mock_axios, mock_auth_context):
    # Arrange
    item_data = {'name': 'item1'}
    mock_axios.put.side_effect = AxiosError(response=MagicMock(data={'message': 'Error'}, status=400))
    
    # Act & Assert
    with pytest.raises(Exception) as exc_info:
        updateInventoryItem('1', item_data)
    assert exc_info.value.message == 'Error'
    assert exc_info.value.status == 400

def test_delete_inventory_item_success(mock_axios, mock_auth_context):
    # Arrange
    mock_axios.delete.return_value = MagicMock(data={'success': True}, statusText='OK')
    
    # Act
    response = deleteInventoryItem('1')
    
    # Assert
    assert response.data == {'success': True}
    assert response.message == 'OK'
    assert response.success is True
    mock_axios.delete.assert_called_once_with('/inventory/1')

def test_delete_inventory_item_error(mock_axios, mock_auth_context):
    # Arrange
    mock_axios.delete.side_effect = AxiosError(response=MagicMock(data={'message': 'Error'}, status=400))
    
    # Act & Assert
    with pytest.raises(Exception) as exc_info:
        deleteInventoryItem('1')
    assert exc_info.value.message == 'Error'
    assert exc_info.value.status == 400

def test_process_payment_success(mock_axios, mock_auth_context):
    # Arrange
    payment_data = {'amount': 100}
    mock_axios.post.return_value = MagicMock(data={'transactionId': '123'}, statusText='OK')
    
    # Act
    response = processPayment(payment_data)
    
    # Assert
    assert response.data == {'transactionId': '123'}
    assert response.message == 'OK'
    assert response.success is True
    mock_axios.post.assert_called_once_with('/payments', payment_data)

def test_process_payment_error(mock_axios, mock_auth_context):
    # Arrange
    payment_data = {'amount': 100}
    mock_axios.post.side_effect = AxiosError(response=MagicMock(data={'message': 'Error'}, status=400))
    
    # Act & Assert
    with pytest.raises(Exception) as exc_info:
        processPayment(payment_data)
    assert exc_info.value.message == 'Error'
    assert exc_info.value.status == 400