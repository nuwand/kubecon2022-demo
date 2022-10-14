import express from 'express'
import prisma from './dbClient'
import { StatusCodes, getReasonPhrase } from 'http-status-codes';
import { Prisma, TaskGroup } from '@prisma/client';

const taskGroupRoute = express.Router();

const defaultTaskGroups: string[] = ["Urgent and important",
  "Urgent, not important",
  "Important, not urgent",
  "Not urgent and not important"];

taskGroupRoute.get(`/`, async (req, res) => {
  const { userId } = req.query;

  var taskGroups = await prisma.taskGroup.findMany({
    where: {
      userId: {
        equals: userId as string
      }
    },
    orderBy: {
      updatedAt: 'asc'
    }
  })

  if (Array.isArray(taskGroups) && taskGroups.length == 0) {
    // no task groups available yet.
    taskGroups = await seedDefaultTaskGroups(userId as string);
  }


  res.status(StatusCodes.OK).json(taskGroups);
})

async function seedDefaultTaskGroups(userId: string): Promise<TaskGroup[]> {
  const taskGroups: TaskGroup[] = [];

  for (var index in defaultTaskGroups) {
    try {
      const taskGroup = await prisma.taskGroup.create({
        data: {
          title: defaultTaskGroups[index],
          userId: userId
        }
      });
      taskGroups.push(taskGroup);
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        console.log(e.message);
      } else {
        throw e;
      }
    }
  }

  return taskGroups;
}

taskGroupRoute.get(`/:id`, async (req, res) => {
  const { id } = req.params;
  const taskGroup = await prisma.taskGroup.findUnique({
    where: {
      id: Number(id),
    },
  })
  if (!taskGroup) {
    res.status(StatusCodes.NOT_FOUND).send(getReasonPhrase(StatusCodes.NOT_FOUND));
  } else {
    res.status(StatusCodes.OK).json(taskGroup);
  }
})

taskGroupRoute.post(`/`, async (req, res) => {
  const { title, userId } = req.body;
  const taskGroup = await prisma.taskGroup.create({
    data: {
      title: title,
      userId: userId
    }
  });
  res.status(StatusCodes.CREATED).json(taskGroup);
})

taskGroupRoute.put(`/:id`, async (req, res) => {
  const { id } = req.params;
  const { title } = req.body;

  try {
    const taskGroup = await prisma.taskGroup.update({
      where: {
        id: Number(id)
      },
      data: {
        title: title
      }
    })
    res.status(StatusCodes.OK).json(taskGroup);
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      console.log(e.message);
      res.status(StatusCodes.NOT_FOUND).send(getReasonPhrase(StatusCodes.NOT_FOUND));
    } else {
      throw e;
    }
  }
})

taskGroupRoute.delete(`/:id`, async (req, res) => {
  const { id } = req.params

  try {
    const taskGroup = await prisma.taskGroup.delete({
      where: {
        id: Number(id),
      },
    })
    res.status(StatusCodes.OK).json(taskGroup);
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      console.log(e.message);
      res.status(StatusCodes.NOT_FOUND).send(getReasonPhrase(StatusCodes.NOT_FOUND));
    } else {
      throw e;
    }

  }
})


export { taskGroupRoute };   