import { Router } from 'express';
import {
  createEmployee,
  listEmployees,
  getEmployeeById,
  updateEmployeeById,
  deleteEmployeeById,
} from '../controllers/employeeController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = Router();

// RESTful routes under /api/v2/employees
router.post('/employees', authMiddleware, createEmployee);
router.get('/employees', authMiddleware, listEmployees);
router.get('/employees/:id', authMiddleware, getEmployeeById);
router.put('/employees/:id', authMiddleware, updateEmployeeById);
router.delete('/employees/:id', authMiddleware, deleteEmployeeById);

export { router };
