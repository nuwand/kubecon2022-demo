import express from 'express'
import dotenv from 'dotenv'
import prisma from './dbClient'
import { getReasonPhrase, StatusCodes } from 'http-status-codes';
import { Prisma } from '@prisma/client';

const archivedTaskRoute = express.Router();

archivedTaskRoute.get(`/`, async (req, res) => {
    const { taskGroupId } = req.query;

    const tasks = await prisma.archivedTask.findMany({
        where: {
            taskGroupId: Number(taskGroupId)
        },
        orderBy: {
            updatedAt: 'asc'
        }
    })

    res.status(StatusCodes.OK).json(tasks);
})

archivedTaskRoute.get(`/:id`, async (req, res) => {
    const { id } = req.params;
    const task = await prisma.archivedTask.findUnique({
        where: {
            id: Number(id),
        },
    })

    if (!task) {
        res.status(StatusCodes.NOT_FOUND).send(getReasonPhrase(StatusCodes.NOT_FOUND));
    } else {
        res.status(StatusCodes.OK).json(task);
    }
})

archivedTaskRoute.post(`/`, async (req, res) => {
    const { title, userId, taskId, taskStatus, taskGroupId } = req.body;
    const task = await prisma.archivedTask.create({
        data: {
            userId: String(userId),
            taskId: taskId,
            title: title,
            taskStatus: taskStatus,
            taskGroupId: taskGroupId
        }
    });
    res.status(StatusCodes.CREATED).json(task);
})

archivedTaskRoute.delete(`/:id`, async (req, res) => {
    const { id } = req.params

    try {
        const task = await prisma.archivedTask.delete({
            where: {
                id: Number(id),
            },
        })
        res.status(StatusCodes.OK).json(task);
    } catch (e) {
        if (e instanceof Prisma.PrismaClientKnownRequestError) {
            console.log(e.message);
            res.status(StatusCodes.NOT_FOUND).send(getReasonPhrase(StatusCodes.NOT_FOUND));
        } else {
            throw e;
        }
    }
})

export { archivedTaskRoute };