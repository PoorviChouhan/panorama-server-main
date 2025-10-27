import { pool } from '../app.js';

async function createEmployeeTable(req, res) {
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS employee (
      id SERIAL PRIMARY KEY,
      name VARCHAR(100) NOT NULL,
      position VARCHAR(50),
      working_on VARCHAR(50),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;
  try {
    await pool.query(createTableQuery);
    res.status(200).send('✅ Employee table created or already exists.');
  } catch (error) {
    res.status(500).send('❌ Error creating employee table: ' + error.message);
  }
}

async function createEmployee(req, res) {
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
}

async function listEmployees(req, res) {
  const selectQuery = `SELECT * FROM employee ORDER BY name ASC;`;
  try {
    const result = await pool.query(selectQuery);
    res.status(200).json(result.rows);
  } catch (error) {
    res.status(500).send('❌ Error fetching employees: ' + error.message);
  }
}

async function getEmployeeById(req, res) {
  const { id } = req.params;
  const selectQuery = `SELECT * FROM employee WHERE id = $1;`;
  try {
    const result = await pool.query(selectQuery, [id]);
    if (result.rows.length === 0) {
      return res.status(404).send('❌ Employee not found');
    }
    res.status(200).json(result.rows[0]);
  } catch (error) {
    res.status(500).send('❌ Error fetching employee: ' + error.message);
  }
}

async function updateEmployeeById(req, res) {
  const { id } = req.params;
  const { name, position, working_on } = req.body;

  const updateFields = [];
  const values = [];
  let paramCount = 1;

  if (name !== undefined) {
    updateFields.push(`name = $${paramCount}`);
    values.push(name);
    paramCount++;
  }
  if (position !== undefined) {
    updateFields.push(`position = $${paramCount}`);
    values.push(position);
    paramCount++;
  }
  if (working_on !== undefined) {
    updateFields.push(`working_on = $${paramCount}`);
    values.push(working_on);
    paramCount++;
  }

  if (updateFields.length === 0) {
    return res.status(400).send('❌ No fields to update');
  }

  updateFields.push(`updated_at = CURRENT_TIMESTAMP`);
  values.push(id);

  const updateQuery = `
    UPDATE employee 
    SET ${updateFields.join(', ')} 
    WHERE id = $${paramCount} 
    RETURNING *;
  `;

  try {
    const result = await pool.query(updateQuery, values);
    if (result.rows.length === 0) {
      return res.status(404).send('❌ Employee not found');
    }
    res.status(200).json(result.rows[0]);
  } catch (error) {
    res.status(500).send('❌ Error updating employee: ' + error.message);
  }
}

async function deleteEmployeeById(req, res) {
  const { id } = req.params;
  const deleteQuery = `DELETE FROM employee WHERE id = $1 RETURNING *;`;
  try {
    const result = await pool.query(deleteQuery, [id]);
    if (result.rows.length === 0) {
      return res.status(404).send('❌ Employee not found');
    }
    res.status(200).json({
      message: '✅ Employee deleted successfully',
      data: result.rows[0],
    });
  } catch (error) {
    res.status(500).send('❌ Error deleting employee: ' + error.message);
  }
}

export {
  createEmployeeTable,
  createEmployee,
  listEmployees,
  getEmployeeById,
  updateEmployeeById,
  deleteEmployeeById,
};
