import { Router } from 'express';
import {
  createClientTable,
  createClient,
  listClients,
  getClientById,
  updateClientById,
  deleteClientById,
} from '../controllers/pgClientController.js';

const router = Router();

// Table creation
router.post('/pg/clients/create-table', createClientTable);

// CRUD
router.post('/pg/clients', createClient);
router.get('/pg/clients', listClients);
router.get('/pg/clients/:id', getClientById);
router.put('/pg/clients/:id', updateClientById);
router.delete('/pg/clients/:id', deleteClientById);

export { router };
