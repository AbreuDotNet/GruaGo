// API Service para conectar React con backend
const API_BASE_URL = 'http://localhost:3000/api';

class ApiService {
  static async get(endpoint) {
    const response = await fetch(`${API_BASE_URL}${endpoint}`);
    return response.json();
  }

  static async post(endpoint, data) {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return response.json();
  }

  // Users
  static getUsers = () => this.get('/users');
  static createUser = (data) => this.post('/users', data);

  // Drivers
  static getDrivers = () => this.get('/drivers');
  static createDriver = (data) => this.post('/drivers', data);

  // Tow Requests
  static getTowRequests = () => this.get('/tow-requests');
  static createTowRequest = (data) => this.post('/tow-requests', data);
}

export default ApiService;
