import type { Request, Response, NextFunction } from "express";
import DocumentService from "../services/document.service";
import { StatusCodes } from "http-status-codes";
import { documentQueue } from "../queues/document.queue";
import { CustomException } from "../middlewares/errorHandler";

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
            const documents = await DocumentService.getAllDocuments(authenticatedUserId || '', request.query as any);
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
    },

    getProcessingStatus: async (request: Request, response: Response, next: NextFunction): Promise<void> => {
        try {
            const documentId = String(request.params.id);
            const authenticatedUserId = request.user?.id;
            const doc = await DocumentService.getDocument(documentId, authenticatedUserId);

            if (!doc || doc.ownerId !== authenticatedUserId) {
                throw new CustomException('Document not found or access denied', StatusCodes.NOT_FOUND);
            }

            // Try to find the active job for this document
            const jobs = await documentQueue.getJobs(['active', 'waiting']);
            const activeJob = jobs.find(
                j => j.data.documentId === documentId
            );

            response.json({
                success: true,
                data: {
                    status: doc.status,
                    error: doc.error,
                    progress: activeJob ? await activeJob.progress : null,
                },
            });
        } catch (error) {
            next(error);
        }
    }
}