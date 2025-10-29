import pool from "../../connection.js";

// ✅ Create Invoice (auto-fetch client, company & employee from project)
export const createInvoice = async (req, res) => {
  try {
    const { invoice_no, project_id, issue_date, tax_rate, total_amount } = req.body;

    if (!invoice_no || !project_id) {
      return res.status(400).json({ message: "Invoice No and Project ID are required" });
    }

    // 🔹 Fetch related info via project → client → company → employee
    const projectData = await pool.query(
      `SELECT 
          p.id AS project_id,
          c.id AS client_id,
          c.company_id,
          c.emp_id
       FROM projects p
       JOIN clients c ON p.client_id = c.id
       WHERE p.id = $1`,
      [project_id]
    );

    if (projectData.rows.length === 0) {
      return res.status(404).json({ message: "Project not found or client link missing" });
    }

    const { client_id, company_id, emp_id } = projectData.rows[0];

    // 🔹 Insert invoice using fetched relations
    const result = await pool.query(
      `INSERT INTO invoices 
        (invoice_no, project_id, issue_date, tax_rate, total_amount)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [invoice_no, project_id, issue_date, tax_rate, total_amount]
    );

    res.status(201).json({
      message: "✅ Invoice created successfully",
      invoice: {
        ...result.rows[0],
        client_id,
        company_id,
        emp_id,
      },
    });
  } catch (err) {
    console.error("❌ Error creating invoice:", err.message);
    res.status(500).send("Server Error");
  }
};

// ✅ Get All Invoices (with project → client → company → employee info)
export const getAllInvoices = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT 
          i.*,
          p.name AS project_name,
          c.name AS client_name,
          co.name AS company_name,
          e.name AS employee_name
       FROM invoices i
       LEFT JOIN projects p ON i.project_id = p.id
       LEFT JOIN clients c ON p.client_id = c.id
       LEFT JOIN companies co ON c.company_id = co.id
       LEFT JOIN employees e ON c.emp_id = e.id
       ORDER BY i.id DESC`
    );
    res.status(200).json(result.rows);
  } catch (err) {
    console.error("❌ Error fetching invoices:", err.message);
    res.status(500).send("Server Error");
  }
};

// ✅ Get Invoice by ID
export const getInvoiceById = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      `SELECT 
          i.*,
          p.name AS project_name,
          c.name AS client_name,
          co.name AS company_name,
          e.name AS employee_name
       FROM invoices i
       LEFT JOIN projects p ON i.project_id = p.id
       LEFT JOIN clients c ON p.client_id = c.id
       LEFT JOIN companies co ON c.company_id = co.id
       LEFT JOIN employees e ON c.emp_id = e.id
       WHERE i.id = $1`,
      [id]
    );

    if (result.rows.length === 0)
      return res.status(404).json({ message: "Invoice not found" });

    res.status(200).json(result.rows[0]);
  } catch (err) {
    console.error("❌ Error fetching invoice:", err.message);
    res.status(500).send("Server Error");
  }
};

// ✅ Update Invoice
export const updateInvoice = async (req, res) => {
  try {
    const { id } = req.params;
    const { invoice_no, project_id, issue_date, tax_rate, total_amount } = req.body;

    const result = await pool.query(
      `UPDATE invoices 
       SET invoice_no = $1, project_id = $2, issue_date = $3,
           tax_rate = $4, total_amount = $5
       WHERE id = $6
       RETURNING *`,
      [invoice_no, project_id, issue_date, tax_rate, total_amount, id]
    );

    if (result.rows.length === 0)
      return res.status(404).json({ message: "Invoice not found" });

    res.status(200).json({
      message: "✅ Invoice updated successfully",
      invoice: result.rows[0],
    });
  } catch (err) {
    console.error("❌ Error updating invoice:", err.message);
    res.status(500).send("Server Error");
  }
};

// ✅ Delete Invoice
export const deleteInvoice = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query("DELETE FROM invoices WHERE id = $1 RETURNING *", [id]);

    if (result.rows.length === 0)
      return res.status(404).json({ message: "Invoice not found" });

    res.status(200).json({ message: "🗑️ Invoice deleted successfully" });
  } catch (err) {
    console.error("❌ Error deleting invoice:", err.message);
    res.status(500).send("Server Error");
  }
};
