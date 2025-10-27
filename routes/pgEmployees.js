import { Router } from 'express';
// import { authMiddleware } from '../middleware/authMiddleware.js';
import {
  createEmployeeTable,
  createEmployee,
  listEmployees,
  getEmployeeById,
  updateEmployeeById,
  deleteEmployeeById,
} from '../controllers/pgEmployeeController.js';

const router = Router();

// Table creation (admin/setup)
router.post('/pg/employees/create-table', createEmployeeTable);

// CRUD
router.post('/pg/employees', createEmployee);
router.get('/pg/employees', listEmployees);
router.get('/pg/employees/:id', getEmployeeById);
router.put('/pg/employees/:id', updateEmployeeById);
router.delete('/pg/employees/:id', deleteEmployeeById);

export { router };
