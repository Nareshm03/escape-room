const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: './backend/.env' });

async function setupDatabase() {
  const pool = new Pool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
  });

  try {
    // Create database if it doesn't exist
    await pool.query(`CREATE DATABASE ${process.env.DB_NAME}`);
    console.log(`Database ${process.env.DB_NAME} created successfully`);
  } catch (error) {
    if (error.code === '42P04') {
      console.log(`Database ${process.env.DB_NAME} already exists`);
    } else {
      console.error('Error creating database:', error.message);
    }
  }

  await pool.end();

  // Connect to the created database and run schema
  const dbPool = new Pool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
  });

  try {
    const schema = fs.readFileSync(path.join(__dirname, 'database', 'schema.sql'), 'utf8');
    const queries = schema.split(';').filter(query => query.trim());
    
    for (const query of queries) {
      if (query.trim()) {
        await dbPool.query(query);
      }
    }
    
    console.log('Database schema created successfully');
  } catch (error) {
    console.error('Error setting up schema:', error.message);
  }

  await dbPool.end();
}

setupDatabase();