const request = require('supertest');
const app = require('../src/app.js').default || require('../src/app.js');

async function testApiCreate() {
  try {
    console.log('Sending POST /api/auth/users...');
    // Use a unique email to avoid duplicate error
    const uniqueEmail = `jane.doe.${Date.now()}@example.com`;
    const response = await request(app)
      .post('/api/auth/users')
      .send({
        name: "Jane Doe",
        email: uniqueEmail,
        phone: "+1234567890",
        password: "securePassword123",
        role_id: 1,
        branch_id: 1,
        designation: "HR Manager",
        department: "Human Resources",
        salary: 45000.00,
        shift: "Day",
        emergency_contact: "+1987654321",
        arrival_time: "09:00",
        leave_time: "17:00",
        salary_paid: false
      });
    
    console.log('Response Status:', response.status);
    console.log('Response Body:', JSON.stringify(response.body, null, 2));
  } catch (err) {
    console.error('Error during API request simulation:', err);
  }
}

testApiCreate();
