import axios from 'axios';

// Function to get the JWT token from localStorage and include it in headers
export const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// // Example of making an authenticated API request
// const fetchProtectedData = async () => {
//   try {
//     const response = await axios.get('http://localhost:3001/api/protected', {
//       headers: getAuthHeaders(),
//     });
//     console.log('Protected data:', response.data);
//   } catch (error) {
//     console.error('Fetch error:', error.response?.data || error.message);
//   }
// };
// // fetchProtectedData();`  