import axios from 'axios';

const API_URL = 'http://localhost:4001/api';

export async function getAPI(endpoint, headers = {}) {
  try {
    const response = await axios.get(`${API_URL}/${endpoint}`, { headers });
    return response.data;
  } catch (error) {
    console.error('Error fetching data:', error);
    throw error;
  }

}

export async function postAPI(endpoint, data, headers = {}) {
  try {
    const response = await axios.post(`${API_URL}/${endpoint}`, data, { headers });
    return response.data;
  } catch (error) {
    console.error('Error posting data:', error);
    throw error;
  } 
}

export async function putAPI(endpoint, data, headers = {}) {
  try {
    const response = await axios.put(`${API_URL}/${endpoint}`, data, { headers });
    return response.data;
  } catch (error) {
    console.error('Error updating data:', error);
    throw error;
  }
}   

export async function deleteAPI(endpoint, headers = {}) {
  try {
    const response = await axios.delete(`${API_URL}/${endpoint}`, { headers });
    return response.data;
  } catch (error) {
    console.error('Error deleting data:', error);
    throw error;
  }
}