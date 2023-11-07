const API_BASE_URL = 'https://traineeapp.azurewebsites.net/api';

export const fetchCustomers = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/customers`);
    if (!response.ok) {
      throw new Error('Failed to fetch customer data');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    throw new Error(error.message);
  }
};

export const fetchTrainings = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/trainings`);
    if (!response.ok) {
      throw new Error('Failed to fetch training data');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    throw new Error(error.message);
  }
};