import { pool, app } from './app.js';

// ✅ Endpoint to create employee table
app.post('/create-employee-table', async (req, res) => {
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS employee (
      id SERIAL PRIMARY KEY,
      name VARCHAR(100) NOT NULL,
      position VARCHAR(50),
      working_on VARCHAR(50)
    );
  `;
  try {
    await pool.query(createTableQuery);
    res.status(200).send('✅ Employee table created or already exists.');
  } catch (error) {
    res.status(500).send('❌ Error creating table: ' + error.message);
  }
});

// ✅ Endpoint to add employee data
app.post('/add-employee', async (req, res) => {
  const { name, position, working_on } = req.body;
  const insertQuery = `
    INSERT INTO employee (name, position, working_on)
    VALUES ($1, $2, $3) RETURNING *;
  `;
  try {
    const result = await pool.query(insertQuery, [name, position, working_on]);
    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).send('❌ Error inserting employee: ' + error.message);
  }
});

// ✅ Endpoint to create client table
app.post('/create-client-table', async (req, res) => {
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS client (
      id SERIAL PRIMARY KEY,
      client_name VARCHAR(100) NOT NULL,
      client_address TEXT NOT NULL,
      client_state VARCHAR(50) NOT NULL,
      client_pin_code VARCHAR(6) NOT NULL CHECK (client_pin_code ~ '^[0-9]{6}$'),
      gst_number VARCHAR(15) NOT NULL UNIQUE CHECK (gst_number ~ '^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$'),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;
  try {
    await pool.query(createTableQuery);
    res.status(200).send('✅ Client table created or already exists.');
  } catch (error) {
    res.status(500).send('❌ Error creating client table: ' + error.message);
  }
});

// ✅ Endpoint to add client data
app.post('/add-client', async (req, res) => {
  const {
    client_name,
    client_address,
    client_state,
    client_pin_code,
    gst_number,
  } = req.body;
  const insertQuery = `
    INSERT INTO client (client_name, client_address, client_state, client_pin_code, gst_number)
    VALUES ($1, $2, $3, $4, $5) RETURNING *;
  `;
  try {
    const result = await pool.query(insertQuery, [
      client_name,
      client_address,
      client_state,
      client_pin_code,
      gst_number,
    ]);
    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).send('❌ Error inserting client: ' + error.message);
  }
});

// ✅ Endpoint to get all clients
app.get('/clients', async (req, res) => {
  const selectQuery = `SELECT * FROM client ORDER BY client_name ASC;`;
  try {
    const result = await pool.query(selectQuery);
    res.status(200).json(result.rows);
  } catch (error) {
    res.status(500).send('❌ Error fetching clients: ' + error.message);
  }
});

// ✅ Endpoint to get client by ID
app.get('/clients/:id', async (req, res) => {
  const { id } = req.params;
  const selectQuery = `SELECT * FROM client WHERE id = $1;`;
  try {
    const result = await pool.query(selectQuery, [id]);
    if (result.rows.length === 0) {
      return res.status(404).send('❌ Client not found');
    }
    res.status(200).json(result.rows[0]);
  } catch (error) {
    res.status(500).send('❌ Error fetching client: ' + error.message);
  }
});

// ✅ Endpoint to update client by ID
app.put('/clients/:id', async (req, res) => {
  const { id } = req.params;
  const {
    client_name,
    client_address,
    client_state,
    client_pin_code,
    gst_number,
  } = req.body;

  // Build dynamic update query based on provided fields
  const updateFields = [];
  const values = [];
  let paramCount = 1;

  if (client_name !== undefined) {
    updateFields.push(`client_name = $${paramCount}`);
    values.push(client_name);
    paramCount++;
  }
  if (client_address !== undefined) {
    updateFields.push(`client_address = $${paramCount}`);
    values.push(client_address);
    paramCount++;
  }
  if (client_state !== undefined) {
    updateFields.push(`client_state = $${paramCount}`);
    values.push(client_state);
    paramCount++;
  }
  if (client_pin_code !== undefined) {
    updateFields.push(`client_pin_code = $${paramCount}`);
    values.push(client_pin_code);
    paramCount++;
  }
  if (gst_number !== undefined) {
    updateFields.push(`gst_number = $${paramCount}`);
    values.push(gst_number);
    paramCount++;
  }

  if (updateFields.length === 0) {
    return res.status(400).send('❌ No fields to update');
  }

  updateFields.push(`updated_at = CURRENT_TIMESTAMP`);
  values.push(id);

  const updateQuery = `
    UPDATE client 
    SET ${updateFields.join(', ')} 
    WHERE id = $${paramCount} 
    RETURNING *;
  `;

  try {
    const result = await pool.query(updateQuery, values);
    if (result.rows.length === 0) {
      return res.status(404).send('❌ Client not found');
    }
    res.status(200).json(result.rows[0]);
  } catch (error) {
    res.status(500).send('❌ Error updating client: ' + error.message);
  }
});

// ✅ Endpoint to delete client by ID
app.delete('/clients/:id', async (req, res) => {
  const { id } = req.params;
  const deleteQuery = `DELETE FROM client WHERE id = $1 RETURNING *;`;
  try {
    const result = await pool.query(deleteQuery, [id]);
    if (result.rows.length === 0) {
      return res.status(404).send('❌ Client not found');
    }
    res.status(200).json({
      message: '✅ Client deleted successfully',
      data: result.rows[0],
    });
  } catch (error) {
    res.status(500).send('❌ Error deleting client: ' + error.message);
  }
});

// ✅ Start the Express server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
