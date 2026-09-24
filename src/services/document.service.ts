import { StatusCodes } from "http-status-codes";
import prisma from "../config/database";
import { CustomException } from "../middlewares/errorHandler";
import { getUserPermissions } from "./rbac.service";
import { Prisma } from "../generated/prisma/browser";
import { DocumentQueryType } from "../validators/document.validator";
import { DOC_EVENTS } from "../events/document.events";
import { appEvents } from "../lib/events";
import { queueDocumentForProcessing } from "../queues/document.queue";

// interface ListDocumentsOptions {
//     page: number;
//     limit: number;
//     status?: string;
//     search?: string;
//     sortBy?: 'createdAt' | 'title' | 'chunkCount';
//     sortOrder?: 'asc' | 'desc';
// }


async function getDocument(documentId:string, authenticatedUserId?: string) {
    const doc = await prisma.document.findUnique({
        where: { id: documentId  },
        select: { id: true, status: true, error: true, ownerId: true, title: true, content: true, 
             createdAt: true, updatedAt: true, filename: true, fileSizeBytes: true },
    });

    if (!doc) {
        throw new CustomException('Document not found', StatusCodes.NOT_FOUND);
    }

    // Resource ownership check
    if (doc.ownerId !== authenticatedUserId) {
        // Admins can see everything
        const permissions = await getUserPermissions(authenticatedUserId || '');
        if (!permissions.has('users:manage')) {
            throw new CustomException('Document not found', StatusCodes.NOT_FOUND);
        }
    }

    return doc;
}

async function getAllDocuments(authenticatedUserId: string, options: DocumentQueryType) {
    const {
        page, limit,
        status, search,
        sortBy = 'createdAt',
        sortOrder = 'desc',
    } = options;

    const permissions = await getUserPermissions(authenticatedUserId || '');

    const where: Prisma.DocumentWhereInput = {
        ...(permissions.has('documents:read') ? { ownerId: authenticatedUserId } : {}),
        // deletedAt: null, // Soft delete filter (we'll add this today)
    };

    if (status) {
        // where.status = status;
    }

    if (search) {
        where.title = { contains: search, mode: 'insensitive' };
        // where.description = { contains: search, mode: 'insensitive' };
    }

    const [documents, total] = await Promise.all([
        prisma.document.findMany({
            where,
            orderBy: { [sortBy]: sortOrder },
            skip: (page - 1) * limit,
            take: limit,
            select: {
                id: true,
                title: true,
                // filename: true,
                // status: true,
                // chunkCount: true,
                createdAt: true,
                updatedAt: true,
            },
        }),
        prisma.document.count({ where }),
    ]);

    return {
        data: documents,
        meta: { page, limit, total },
    };

}

async function createDocument(data: { title: string; content: string; ownerId: string }) {
    const doc = await prisma.document.create({
        data: {
            title: data.title,
            content: data.content,
            ownerId: data.ownerId,
            fileSizeBytes: 10,
            filename: `${data.title}.txt`,
        },
    });

    const jobId = await queueDocumentForProcessing(doc.id, data.ownerId);
    
    appEvents.emit(DOC_EVENTS.CREATED, {
        userId: data.ownerId,
        documentId: doc.id,
        title: doc.title,
        fileSizeBytes: doc.fileSizeBytes,
    });
    return { document: doc, jobId };

}

async function deleteDocument(documentId: string, authenticatedUserId?: string) {
    const doc = await getDocument(documentId, authenticatedUserId);

    // Only the owner or an admin can delete the document
    if (doc.ownerId !== authenticatedUserId) {
        const permissions = await getUserPermissions(authenticatedUserId || '');
        if (!permissions.has('users:manage')) {
            throw new CustomException('Forbidden', StatusCodes.FORBIDDEN);
        }
    }

    // In document.service.ts deleteDocument:
    appEvents.emit(DOC_EVENTS.DELETED, {
        deletedBy: authenticatedUserId,
        documentId: doc.id,
        title: doc.title,
    });

    return prisma.document.delete({
        where: { id: documentId },
    });
}

const DocumentService = {
    getDocument,
    getAllDocuments,
    createDocument,
    deleteDocument
}

export default DocumentService;