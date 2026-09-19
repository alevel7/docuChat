import { Router } from 'express';
import { authenticate } from '../middlewares/auth.middleware';
import prisma from '../config/database';
import { createDocumentSchema, documentParamsSchema, listDocumentsSchema } from '../validators/document.validator';
import { validate } from '../middlewares/validate';

export const documentRoutes = Router();
documentRoutes.use(authenticate); // All document routes require auth

// documentRoutes.get('/',
//     validate(listDocumentsSchema),
//     listDocuments
// );

// documentRoutes.post('/',
//     validate(createDocumentSchema),
//     createDocument
// );

// documentRoutes.get('/:id',
//     validate(documentParamsSchema),
//     getDocument
// );

// documentRoutes.delete('/:id',
//     validate(documentParamsSchema),
//     deleteDocument
// );

