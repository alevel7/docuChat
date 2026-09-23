import type { Request, Response, NextFunction } from "express";
import DocumentService from "../services/document.service";
import { StatusCodes } from "http-status-codes";

export const DocumentController = {
    getADocument: async (request: Request, response: Response, next: NextFunction): Promise<void> => {
        try {
            const documentId = String(request.params.id);
            const authenticatedUserId = request.user?.id;
            const document = await DocumentService.getDocument(documentId, authenticatedUserId);
            response.status(StatusCodes.OK).json({ data: document });
        } catch (error) {
            next(error);
        }
    },

    listDocuments: async (request: Request, response: Response, next: NextFunction): Promise<void> => {
        try {
            // Implement logic to list documents based on user permissions
            const authenticatedUserId = request.user?.id;
            const documents = await DocumentService.getAllDocuments(authenticatedUserId);
            response.status(StatusCodes.OK).json({ data: documents });
        } catch (error) {
            next(error);
        }
    },

    createDocument: async (request: Request, response: Response, next: NextFunction): Promise<void> => {
        try {
            // Implement logic to create a new document
            const { title, content } = request.body;
            const ownerId = request.user?.id;

            if (!ownerId) {
                throw new Error('Authenticated user ID is missing');
            }

            const newDocument = await DocumentService.createDocument({ title, content, ownerId });
            response.status(StatusCodes.CREATED).json({ data: newDocument });
        } catch (error) {
            next(error);
        }
    },

    deleteDocument: async (request: Request, response: Response, next: NextFunction): Promise<void> => {
        try {
            const documentId = String(request.params.id);
            const authenticatedUserId = request.user?.id;

            await DocumentService.deleteDocument(documentId, authenticatedUserId);
            response.status(StatusCodes.NO_CONTENT).send();
        } catch (error) {
            next(error);
        }
    }
}