// Initialize demo data
export function initializeData() {
  // Check if admin user exists
  const users = JSON.parse(localStorage.getItem('users') || '[]');
  
  if (users.length === 0) {
    // Create admin user
    const adminUser = {
      id: 'admin_001',
      name: 'Admin User',
      email: 'admin@craftfolio.com',
      password: 'admin123',
      role: 'admin',
      createdAt: new Date().toISOString()
    };
    
    localStorage.setItem('users', JSON.stringify([adminUser]));
  }
}
