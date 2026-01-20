let express = require('express');
let path = require('path');
const cors = require('cors')
const { Pool } = require('pg');
require('dotenv').config();
const { DATABASE_URL } = process.env;

let app = express();
app.use(cors());
app.use(express.json());

// Database connection pool
const pool = new Pool({
  connectionString: DATABASE_URL,
  ssl: {
    require: true,
  },
});

async function getPostgresVersion() {
  const client = await pool.connect();
  try {
    const res = await client.query('SELECT version()');
    console.log(res.rows[0])
  } finally {
    client.release();
  }
}

getPostgresVersion();

/**
 * GET all thrift stores (FULL DATA)
 * GET /stores
 */
app.get('/stores', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        ts.TS_id,
        ts.name,
        ts.description,
        ts.average_rating,
        ts.total_ratings,
        ts.price_range,
        ts.operating_hours,
        ts.google_maps_link,
        jsonb_build_object(
          'unit_number', a.unit_number,
          'address_line_1', a.address_line_1,
          'address_line_2', a.address_line_2,
          'city', a.city,
          'state', a.state,
          'postal_code', a.postal_code,
          'full_address', a.full_address,
          'latitude', a.latitude,
          'longitude', a.longitude
        ) AS address,
        jsonb_build_object(
          'phone_number', c.phone_number,
          'instagram_link', c.instagram_link,
          'facebook_link', c.facebook_link
        ) AS contacts
      FROM thrift_stores ts
      LEFT JOIN thrift_stores_address a
        ON a.TS_id = ts.TS_id
      LEFT JOIN thrift_stores_contacts c
        ON c.TS_id = ts.TS_id
      ORDER BY ts.TS_id;
    `);

    res.status(200).json(result.rows);
  } catch (err) {
    console.error('GET /stores error:', err.message);
    res.status(500).json({ error: err.message });
  }
});


/**
 * GET a specific thrift store by ID (FULL DATA)
 * GET /stores/:id
 */
app.get('/stores/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      `
      SELECT
        ts.TS_id AS id,
        ts.name,
        ts.description,
        ts.average_rating,
        ts.total_ratings,
        ts.price_range,
        ts.operating_hours,
        ts.google_maps_link,
        ts.created_at,
        ts.updated_at,

        jsonb_build_object(
          'unit_number', a.unit_number,
          'address_line_1', a.address_line_1,
          'address_line_2', a.address_line_2,
          'city', a.city,
          'state', a.state,
          'postal_code', a.postal_code,
          'full_address', a.full_address,
          'latitude', a.latitude,
          'longitude', a.longitude
        ) AS address,

        jsonb_build_object(
          'phone_number', c.phone_number,
          'instagram_link', c.instagram_link,
          'facebook_link', c.facebook_link
        ) AS contacts

      FROM thrift_stores ts
      LEFT JOIN thrift_stores_address a
        ON a.TS_id = ts.TS_id
      LEFT JOIN thrift_stores_contacts c
        ON c.TS_id = ts.TS_id
      WHERE ts.TS_id = $1;
      `,
      [id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({
        status: 'error',
        message: `Thrift store not found for id: ${id}`
      });
    }

    res.status(200).json({
      status: 'success',
      data: result.rows[0]
    });

  } catch (err) {
    console.error('GET /stores/:id error:', err.message);
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch thrift store'
    });
  }
});


/**
 * POST - Create a new thrift store
 * POST /api/stores
 */

// That means:
// Insert into thrift_stores
// Get the newly created id
// Insert into thrift_stores_address using that id
// Insert into thrift_stores_contacts using that id
app.post('/stores', async (req, res) => {
  const client = await pool.connect();

  try {
    const {
      name,
      description,
      price_range,
      operating_hours,
      google_maps_link,
      added_by,
      address,
      contacts
    } = req.body;

    const fullAddress = `${address.unit_number ? `${address.unit_number}, ` : ''}${address.address_line_1}, ${address.address_line_2 ? `${address.address_line_2}, ` : ''} ${address.postal_code}, ${address.city}, ${address.state}`
    

    if (!name || !address) {
      return res.status(400).json({
        error: 'Name and address are required'
      });
    }

    await client.query('BEGIN');

    // 1️⃣ Insert main store
    const storeResult = await client.query(
      `
      INSERT INTO thrift_stores (name, description, price_range, operating_hours, google_maps_link, added_by)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING ts_id
      `,
      [name, description, price_range, operating_hours, google_maps_link, added_by]
    );

    const storeId = storeResult.rows[0].ts_id;

    // 2️⃣ Insert address
    await client.query(
      `
      INSERT INTO thrift_stores_address
      (ts_id, unit_number, address_line_1, address_line_2, city, state, postal_code, full_address, latitude, longitude)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      `,
      [
        storeId,
        address.unit_number,
        address.address_line_1,
        address.address_line_2,
        address.city,
        address.state,
        address.postal_code,
        fullAddress,
        address.latitude,
        address.longitude
      ]
    );

    // 3️⃣ Insert contacts
    await client.query(
      `
      INSERT INTO thrift_stores_contacts
      (ts_id, phone_number, instagram_link, facebook_link)
      VALUES ($1, $2, $3, $4)
      `,
      [
        storeId,
        contacts.phone_number || null,
        contacts.instagram_link || null,
        contacts.facebook_link || null
      ]
    );

    await client.query('COMMIT');

    res.status(201).json({
      message: 'Store created successfully',
      store_id: storeId
    });

  } catch (err) {
    await client.query('ROLLBACK');
    console.error(err);
    res.status(500).json({ error: 'Failed to create store' });
  } finally {
    client.release();
  }
});

/**
 * PUT - Update a thrift store given an id
 * PUT /api/stores/:id
 */
app.put('/stores/:id', async (req, res) => {
  const client = await pool.connect();
  const { id } = req.params;

  try {
    const {
      name,
      description,
      price_range,
      operating_hours,
      google_maps_link,
      added_by,
      address,
      contacts
    } = req.body;

    // Check if the thrift store exists 
    const checkQuery = await client.query('SELECT * FROM thrift_stores WHERE ts_id = $1', [id]);
    if (checkQuery.rowCount === 0){
      return res.status(404).json({ error: `Thrift store not found for thrift store ID: ${id}` });
    }

    await client.query('BEGIN');

    /**
     * 1️⃣ Update thrift_stores
     */
    const storeResult = await client.query(
      `
      UPDATE thrift_stores
      SET
        name = COALESCE($1, name),
        description = COALESCE($2, description),
        price_range = COALESCE($3, price_range),
        operating_hours = COALESCE($4, operating_hours),
        google_maps_link = COALESCE($5, google_maps_link),
        updated_at = NOW()
      WHERE ts_id = $6
      RETURNING *
      `,
      [name, description, price_range, operating_hours, google_maps_link, id]
    );

    if (storeResult.rows.length === 0) {
      throw new Error('STORE_NOT_FOUND');
    }

    /**
     * 2️⃣ Update address (only if provided)
     */
    if (address) {

      const fullAddress = `${address.unit_number ? `${address.unit_number}, ` : ''}${address.address_line_1}, ${address.address_line_2 ? `${address.address_line_2}, ` : ''} ${address.postal_code}, ${address.city}, ${address.state}`
      
      await client.query(
        `
        UPDATE thrift_stores_address
        SET
          unit_number = COALESCE($1, unit_number),
          address_line_1 = COALESCE($2, address_line_1),
          address_line_2 = COALESCE($3, address_line_2),
          city = COALESCE($4, city),
          state = COALESCE($5, state),
          postal_code = COALESCE($6, postal_code),
          full_address = COALESCE($7, full_address),
          latitude = COALESCE($8, latitude),
          longitude = COALESCE($9, longitude),
          updated_at = NOW()
        WHERE ts_id = $10
        `,
        [
          address.unit_number,
          address.address_line_1,
          address.address_line_2,
          address.city,
          address.state,
          address.postal_code,
          fullAddress,
          address.latitude,
          address.longitude,
          id,
        ]
      );
    }

    /**
     * 3️⃣ Update contacts (only if provided)
     */
    if (contacts) {
      await client.query(
        `
        UPDATE thrift_stores_contacts
        SET
          phone_number = COALESCE($1, phone_number),
          instagram_link = COALESCE($2, instagram_link),
          facebook_link = COALESCE($3, facebook_link)
        WHERE ts_id = $4
        `,
        [
          contacts.phone_number,
          contacts.instagram_link,
          contacts.facebook_link,
          id
        ]
      );
    }

    await client.query('COMMIT');

    /**
     * 4️⃣ Fetch the complete updated store with all related data
     */
    const completeStoreResult = await client.query(
      `
      SELECT 
        ts.*,
        json_build_object(
          'unit_number', addr.unit_number,
          'address_line_1', addr.address_line_1,
          'address_line_2', addr.address_line_2,
          'city', addr.city,
          'state', addr.state,
          'postal_code', addr.postal_code,
          'full_address', addr.full_address,
          'latitude', addr.latitude,
          'longitude', addr.longitude
        ) as address,
        json_build_object(
          'phone_number', cont.phone_number,
          'instagram_link', cont.instagram_link,
          'facebook_link', cont.facebook_link
        ) as contacts
      FROM thrift_stores ts
      LEFT JOIN thrift_stores_address addr ON ts.TS_id = addr.TS_id
      LEFT JOIN thrift_stores_contacts cont ON ts.TS_id = cont.TS_id
      WHERE ts.TS_id = $1
      `,
      [id]
    );

    res.status(200).json({
      'status': 'success',
      store_id: id,
      'data': completeStoreResult.rows[0], 
      'message': 'Store updated successfully',
    });

  } catch (err) {
    await client.query('ROLLBACK');
    if (err.message === 'STORE_NOT_FOUND') {
      return res.status(404).json({ error: 'Store not found' });
    }
    console.error('Full error:', err);
    console.error('Error message:', err.message);
    console.error('Error stack:', err.stack);
    res.status(500).json({ 
      error: 'Failed to update store',
      details: err.message  // Remove this in production!
    });
  }
});

/**
 * DELETE a thrift store by ID
 * DELETE /stores/:id
 */
app.delete('/stores/:id', async (req, res) => {
  const { id } = req.params;
  const client = await pool.connect();

  try {
    const result = await client.query(
      `
      DELETE FROM thrift_stores
      WHERE TS_id = $1
      RETURNING TS_id;
      `,
      [id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({
        message: `Thrift store not found for id: ${id}`
      });
    }

    // Successful delete — no response body
    res.status(204).json({ 'status' : 'success', 'message' : 'Thrift store deleted successfully' })

  } catch (err) {
    console.error('DELETE /stores/:id error:', err.message);
    res.status(500).json({
      message: 'Failed to delete thrift store'
    });
  } finally {
    client.release();
  }
});

// Catch 404 and forward to error handler
app.use((req, res) => {
  res.status(404).sendFile(path.join(__dirname + '/404.html'));
})

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '/index.html'));
})

app.listen(3000, () => {
  console.log('Server is running on port 3000');
})