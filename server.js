// server.js
import express from 'express';
import { Pool } from 'pg';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import cors from 'cors';
import dotenv from 'dotenv';
import axios from 'axios';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Database connection pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

// Test database connection
pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('Database connection error:', err);
  } else {
    console.log('Database connected successfully');
  }
});

// Authentication middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key', (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid or expired token' });
    }
    req.user = user;
    next();
  });
};

// ==================== THRIFT STORE ROUTES ====================

// Get all thrift stores (with optional filters)
app.get('/api/stores', async (req, res) => {
  const { city, min_rating, max_price, search } = req.query;
  
  try {
    let query = `
      SELECT 
        ts.*,
        tsa.full_address, tsa.city, tsa.state, tsa.latitude, tsa.longitude,
        tsc.phone_number, tsc.instagram_link, tsc.facebook_link,
        u.username as added_by_username
      FROM thrift_stores ts
      LEFT JOIN thrift_stores_address tsa ON ts.ts_id = tsa.ts_id
      LEFT JOIN thrift_stores_contacts tsc ON ts.ts_id = tsc.ts_id
      LEFT JOIN users u ON ts.added_by = u.user_id
      WHERE 1=1
    `;
    
    const params = [];
    let paramCount = 1;

    if (city) {
      query += ` AND LOWER(tsa.city) = LOWER($${paramCount})`;
      params.push(city);
      paramCount++;
    }

    if (min_rating) {
      query += ` AND ts.average_rating >= $${paramCount}`;
      params.push(min_rating);
      paramCount++;
    }

    if (max_price) {
      query += ` AND ts.price_range <= $${paramCount}`;
      params.push(max_price);
      paramCount++;
    }

    if (search) {
      query += ` AND (LOWER(ts.name) LIKE LOWER($${paramCount}) OR LOWER(ts.description) LIKE LOWER($${paramCount}))`;
      params.push(`%${search}%`);
      paramCount++;
    }

    query += ' ORDER BY ts.average_rating DESC, ts.total_ratings DESC';

    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: 'Server error', details: error.message });
  }
});

// Get single thrift store by ID
app.get('/api/stores/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      `SELECT 
        ts.*,
        tsa.unit_number, tsa.street_number, tsa.address_line_1, tsa.address_line_2,
        tsa.city, tsa.state, tsa.postal_code, tsa.full_address, 
        tsa.latitude, tsa.longitude,
        tsc.phone_number, tsc.instagram_link, tsc.facebook_link,
        u.username as added_by_username
      FROM thrift_stores ts
      LEFT JOIN thrift_stores_address tsa ON ts.ts_id = tsa.ts_id
      LEFT JOIN thrift_stores_contacts tsc ON ts.ts_id = tsc.ts_id
      LEFT JOIN users u ON ts.added_by = u.user_id
      WHERE ts.ts_id = $1`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Store not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: 'Server error', details: error.message });
  }
});

// Create new thrift store (requires authentication)
app.post('/api/stores', authenticateToken, async (req, res) => {
  const {
    name,
    description,
    price_range,
    operating_hours,
    google_maps_link,
    address,
    contact
  } = req.body;

  if (!name || !address || !address.full_address || !address.latitude || !address.longitude) {
    return res.status(400).json({ error: 'Name and complete address information are required' });
  }

  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    // Insert thrift store
    const storeResult = await client.query(
      `INSERT INTO thrift_stores (name, description, price_range, operating_hours, google_maps_link, added_by)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [name, description, price_range, operating_hours, google_maps_link, req.user.userId]
    );

    const storeId = storeResult.rows[0].ts_id;

    // Insert address
    await client.query(
      `INSERT INTO thrift_stores_address (
        ts_id, unit_number, street_number, address_line_1, address_line_2,
        city, state, postal_code, full_address, latitude, longitude
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)`,
      [
        storeId,
        address.unit_number,
        address.street_number,
        address.address_line_1,
        address.address_line_2,
        address.city,
        address.state,
        address.postal_code,
        address.full_address,
        address.latitude,
        address.longitude
      ]
    );

    // Insert contact (if provided)
    if (contact) {
      await client.query(
        `INSERT INTO thrift_stores_contacts (ts_id, phone_number, instagram_link, facebook_link)
         VALUES ($1, $2, $3, $4)`,
        [storeId, contact.phone_number, contact.instagram_link, contact.facebook_link]
      );
    }

    await client.query('COMMIT');

    // Fetch complete store data
    const completeStore = await pool.query(
      `SELECT 
        ts.*,
        tsa.full_address, tsa.city, tsa.state, tsa.latitude, tsa.longitude,
        tsc.phone_number, tsc.instagram_link, tsc.facebook_link
      FROM thrift_stores ts
      LEFT JOIN thrift_stores_address tsa ON ts.ts_id = tsa.ts_id
      LEFT JOIN thrift_stores_contacts tsc ON ts.ts_id = tsc.ts_id
      WHERE ts.ts_id = $1`,
      [storeId]
    );

    res.status(201).json({
      message: 'Store created successfully',
      store: completeStore.rows[0]
    });
  } catch (error) {
    await client.query('ROLLBACK');
    res.status(500).json({ error: 'Server error', details: error.message });
  } finally {
    client.release();
  }
});

// Update thrift store
app.put('/api/stores/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;
  const { name, description, price_range, operating_hours, google_maps_link } = req.body;

  try {
    const result = await pool.query(
      `UPDATE thrift_stores 
       SET name = COALESCE($1, name),
           description = COALESCE($2, description),
           price_range = COALESCE($3, price_range),
           operating_hours = COALESCE($4, operating_hours),
           google_maps_link = COALESCE($5, google_maps_link),
           updated_at = CURRENT_TIMESTAMP
       WHERE ts_id = $6
       RETURNING *`,
      [name, description, price_range, operating_hours, google_maps_link, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Store not found' });
    }

    res.json({
      message: 'Store updated successfully',
      store: result.rows[0]
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error', details: error.message });
  }
});

// Delete thrift store
app.delete('/api/stores/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query('DELETE FROM thrift_stores WHERE ts_id = $1 RETURNING *', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Store not found' });
    }

    res.json({ message: 'Store deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Server error', details: error.message });
  }
});

// Rate a thrift store
app.post('/api/stores/:id/rate', authenticateToken, async (req, res) => {
  const { id } = req.params;
  const { rating } = req.body;

  if (!rating || rating < 1 || rating > 5) {
    return res.status(400).json({ error: 'Rating must be between 1 and 5' });
  }

  try {
    const result = await pool.query(
      `UPDATE thrift_stores 
       SET total_ratings = total_ratings + 1,
           average_rating = ROUND((average_rating * total_ratings + $1) / (total_ratings + 1))
       WHERE ts_id = $2
       RETURNING *`,
      [rating, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Store not found' });
    }

    res.json({
      message: 'Rating added successfully',
      store: result.rows[0]
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error', details: error.message });
  }
});


// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!', details: err.message });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});