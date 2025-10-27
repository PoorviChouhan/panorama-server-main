import pool from "../../connection.js";

// CREATE project
export const createProject = async (req, res) => {
  const { name, client_id, emp_id, billing_amt, days, leaves, active } = req.body;

  if (!name || !client_id || !emp_id) {
    return res.status(400).json({ message: "Name, Client ID, and Employee ID are required" });
  }

  try {
    const result = await pool.query(
      `INSERT INTO projects 
       (name, client_id, emp_id, billing_amt, days, leaves, active)
       VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
      [
        name,
        client_id,
        emp_id,
        billing_amt || 0,
        days || 0,
        leaves || 0,
        active !== undefined ? active : true
      ]
    );

    res.status(201).json({
      message: "✅ Project created successfully",
      project: result.rows[0],
    });
  } catch (err) {
    console.error("❌ Error in createProject:", err);
    res.status(500).send("Server Error");
  }
};

// GET all projects
export const getAllProjects = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT p.*, c.name AS client_name 
       FROM projects p
       JOIN clients c ON p.client_id = c.id
       ORDER BY p.id ASC`
    );
    res.status(200).json(result.rows);
  } catch (err) {
    console.error("❌ Error in getAllProjects:", err);
    res.status(500).send("Server Error");
  }
};

// GET project by ID
export const getProjectById = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(`SELECT * FROM projects WHERE id=$1`, [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Project not found" });
    }
    res.status(200).json(result.rows[0]);
  } catch (err) {
    console.error("❌ Error in getProjectById:", err);
    res.status(500).send("Server Error");
  }
};

// UPDATE project
export const updateProject = async (req, res) => {
  const { id } = req.params;
  const { name, client_id, emp_id, billing_amt, days, leaves, active } = req.body;

  try {
    const result = await pool.query(
      `UPDATE projects 
       SET name=$1, client_id=$2, emp_id=$3, billing_amt=$4, days=$5, leaves=$6, active=$7
       WHERE id=$8 RETURNING *`,
      [name, client_id, emp_id, billing_amt, days, leaves, active, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Project not found" });
    }

    res.status(200).json({
      message: "✅ Project updated successfully",
      project: result.rows[0],
    });
  } catch (err) {
    console.error("❌ Error in updateProject:", err);
    res.status(500).send("Server Error");
  }
};

// DELETE project
export const deleteProject = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(`DELETE FROM projects WHERE id=$1 RETURNING *`, [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Project not found" });
    }
    res.status(200).json({ message: "✅ Project deleted successfully" });
  } catch (err) {
    console.error("❌ Error in deleteProject:", err);
    res.status(500).send("Server Error");
  }
};
