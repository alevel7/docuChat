import { StatusCodes } from "http-status-codes";
import prisma from "../config/database";
import { CustomException } from "../middlewares/errorHandler";
import { getUserPermissions } from "./rbac.service";


async function getDocument(documentId:string, authenticatedUserId?: string) {
    const doc = await prisma.document.findUnique({
        where: { id: documentId  },
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

async function getAllDocuments(authenticatedUserId?: string) {
    const permissions = await getUserPermissions(authenticatedUserId || '');

    if (permissions.has('documents:read')) {
        // Admins can see everything
        return prisma.document.findMany();
    } else {
        // Regular users can only see their own documents
        return prisma.document.findMany({
            where: { ownerId: authenticatedUserId },
        });
    }
}

async function createDocument(data: { title: string; content: string; ownerId: string }) {
    return prisma.document.create({
        data: {
            title: data.title,
            content: data.content,
            ownerId: data.ownerId,
        },
    });
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