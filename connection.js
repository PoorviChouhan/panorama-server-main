import { pool, app } from './app.js';

// ✅ Endpoint to create employee table
app.post('/create-employee-table', async (req, res) => {
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS employee (
      id SERIAL PRIMARY KEY,
      name VARCHAR(100) NOT NULL,
      position VARCHAR(50),
      salary NUMERIC(10, 2),
      hire_date DATE DEFAULT CURRENT_DATE
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
  const { name, position, salary } = req.body;
  const insertQuery = `
    INSERT INTO employee (name, position, salary)
    VALUES ($1, $2, $3) RETURNING *;
  `;
  try {
    const result = await pool.query(insertQuery, [name, position, salary]);
    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).send('❌ Error inserting employee: ' + error.message);
  }
});

// ✅ Start the Express server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
