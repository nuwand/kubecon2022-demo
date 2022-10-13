import express from 'express'
import dotenv from 'dotenv'
import prisma from './dbClient'
import { getReasonPhrase, StatusCodes } from 'http-status-codes';
import { Prisma } from '@prisma/client';

const userSettingsRoute = express.Router();

userSettingsRoute.get(`/:userId`, async (req, res) => {
    const { userId } = req.params;
    const userSettings = await prisma.userSettings.findUnique({
        where: {
            userId: userId as string
        },
    })

    if (!userSettings) {
        res.status(StatusCodes.NOT_FOUND).send(getReasonPhrase(StatusCodes.NOT_FOUND));
    } else {
        res.status(StatusCodes.OK).json(userSettings);
    }
})

userSettingsRoute.post(`/`, async (req, res) => {
    const { userId, settings } = req.body;
    const userSettings = await prisma.userSettings.create({
        data: {
            userId: userId,
            settings: settings,
        }
    });
    res.status(StatusCodes.CREATED).json(userSettings);
})

userSettingsRoute.put(`/:userId`, async (req, res) => {
    const { userId } = req.params;
    const { settings } = req.body;

    try {
        const userSettings = await prisma.userSettings.update({
            where: {
                userId: userId as string,
            },
            data: {
                settings: settings,
            }
        })
        res.status(StatusCodes.OK).json(userSettings);
    } catch (e) {
        if (e instanceof Prisma.PrismaClientKnownRequestError) {
            console.log(e.message);
            res.status(StatusCodes.NOT_FOUND).send(getReasonPhrase(StatusCodes.NOT_FOUND));
        } else {
            throw e;
        }
    }

})

userSettingsRoute.delete(`/:userId`, async (req, res) => {
    const { userId } = req.params

    try {
        const userSettings = await prisma.userSettings.delete({
            where: {
                userId: userId as string,
            },
        })
        res.status(StatusCodes.OK).json(userSettings);
    } catch (e) {
        if (e instanceof Prisma.PrismaClientKnownRequestError) {
            console.log(e.message);
            res.status(StatusCodes.NOT_FOUND).send(getReasonPhrase(StatusCodes.NOT_FOUND));
        } else {
            throw e;
        }
    }
})

export { userSettingsRoute };   