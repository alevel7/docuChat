import { Router } from 'express';
import { authenticate } from '../middlewares/auth.middleware';
import { createDocumentSchema, documentParamsSchema, listDocumentsSchema } from '../validators/document.validator';
import { validate } from '../middlewares/validate';
import { requirePermission } from '../middlewares/authorize.middleware';
import { DocumentController } from '../controllers/documentController';

export const documentRoutes = Router();
documentRoutes.use(authenticate); // All document routes require auth

// Anyone with documents:read can list documents
documentRoutes.get('/',
    requirePermission('documents:read'),
    validate(listDocumentsSchema),
    DocumentController.listDocuments
);

documentRoutes.get('/:id',
    requirePermission('documents:read'), 
    validate(documentParamsSchema),
    DocumentController.getADocument
);

// // Only documents:create can upload
documentRoutes.post('/',
    requirePermission('documents:create'),
    validate(createDocumentSchema),
    DocumentController.createDocument
);

// // Only documents:delete can delete (admin only)
documentRoutes.delete('/:id',
    requirePermission('admin:documents:delete', 'documents:delete'),
    validate(documentParamsSchema),
    DocumentController.deleteDocument
);

documentRoutes.get('/:id/processing-status',
    authenticate,
    requirePermission('documents:read'),
    DocumentController.getProcessingStatus
)

export default documentRoutes;
