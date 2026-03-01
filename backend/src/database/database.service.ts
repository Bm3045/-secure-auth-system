import { Injectable } from '@nestjs/common';
import { Client } from 'pg';

@Injectable()
export class DatabaseService {
  private client: Client;
  private isConnected = false;

  constructor() {
    this.client = new Client({
      host: 'postgres',  // Use service name from docker-compose
      port: 5432,
      database: 'authdb',
      user: 'postgres',
      password: 'password',
    });
    this.connectWithRetry();
  }

  private async connectWithRetry(retries = 10, delay = 5000) {
    console.log('🔗 Connecting to PostgreSQL...');
    
    for (let i = 0; i < retries; i++) {
      try {
        await this.client.connect();
        this.isConnected = true;
        console.log('✅ Connected to PostgreSQL database');
        await this.initDatabase();
        return;
      } catch (error) {
        console.error(`❌ Database connection attempt ${i + 1}/${retries} failed:`, error.message);
        if (i < retries - 1) {
          console.log(`⏳ Retrying in ${delay / 1000} seconds...`);
          await new Promise(resolve => setTimeout(resolve, delay));
        } else {
          console.error('💥 All database connection attempts failed');
          // Don't throw error, just log it
        }
      }
    }
  }

  async initDatabase() {
    const createTableQuery = `
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;
    
    try {
      await this.client.query(createTableQuery);
      console.log('✅ Users table initialized');
    } catch (error) {
      console.error('❌ Table creation error:', error);
    }
  }

  async query(text: string, params?: any[]) {
    if (!this.isConnected) {
      throw new Error('Database not connected');
    }
    try {
      return await this.client.query(text, params);
    } catch (error) {
      console.error('Database query error:', error);
      throw error;
    }
  }
}