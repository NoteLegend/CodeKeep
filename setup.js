const fs = require('fs');
const path = require('path');

console.log('🚀 Setting up CodeKeep...\n');

// Create backend .env file
const backendEnv = `NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/codekeep
JWT_SECRET=your_super_secret_jwt_key_here_change_in_production_${Math.random().toString(36).substring(2, 15)}
JWT_EXPIRE=7d`;

const backendEnvPath = path.join(__dirname, 'backend', '.env');
if (!fs.existsSync(backendEnvPath)) {
  fs.writeFileSync(backendEnvPath, backendEnv);
  console.log('✅ Created backend/.env file');
} else {
  console.log('⚠️  backend/.env already exists');
}

// Create frontend .env file
const frontendEnv = `VITE_API_URL=http://localhost:5000/api`;

const frontendEnvPath = path.join(__dirname, 'frontend', '.env');
if (!fs.existsSync(frontendEnvPath)) {
  fs.writeFileSync(frontendEnvPath, frontendEnv);
  console.log('✅ Created frontend/.env file');
} else {
  console.log('⚠️  frontend/.env already exists');
}

console.log('\n🎉 Setup complete!');
console.log('\nNext steps:');
console.log('1. Make sure MongoDB is running');
console.log('2. Run: npm run install-all');
console.log('3. Run: npm run dev');
console.log('\nThe application will be available at http://localhost:5173');
