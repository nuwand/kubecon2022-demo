import express from 'express'
import { StatusCodes, getReasonPhrase } from 'http-status-codes';

const taskStatusRoute = express.Router();

interface TaskStatus {
  id: Number;
  userId: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

const defaultTaskStatus: TaskStatus[] = [{
  id: 1, userId: "", name: "Open",
  createdAt: Date().toLocaleString(),
  updatedAt: Date().toLocaleString()
},
{
  id: 2, userId: "", name: "InProgress",
  createdAt: Date().toLocaleString(),
  updatedAt: Date().toLocaleString()
},
{
  id: 3, userId: "", name: "Completed",
  createdAt: Date().toLocaleString(),
  updatedAt: Date().toLocaleString()
}];

taskStatusRoute.get(`/`, async (req, res) => {
  const { userId } = req.query;
  const copyOfStatuses: TaskStatus[] = JSON.parse(JSON.stringify(defaultTaskStatus));
  copyOfStatuses.forEach(status => status.userId = userId as string);
  res.status(StatusCodes.OK).json(copyOfStatuses);
})

taskStatusRoute.get(`/:id`, async (req, res) => {
  const { id } = req.params;
  const taskStatus: TaskStatus[] = defaultTaskStatus.filter(t => t.id === Number(id));

  if (taskStatus.length == 0) {
    res.status(StatusCodes.NOT_FOUND).send(getReasonPhrase(StatusCodes.NOT_FOUND));
  } else {
    res.status(StatusCodes.OK).json(taskStatus[0]);
  }
})

taskStatusRoute.post(`/`, async (req, res) => {
  const { name, userId } = req.body;
  console.log("creating a new task status is not supported: " + name);
  res.status(StatusCodes.NOT_IMPLEMENTED);
})

taskStatusRoute.put(`/:id`, async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;
  console.log("creating a new task status is not supported: " + name);
  res.status(StatusCodes.NOT_IMPLEMENTED);
})

taskStatusRoute.delete(`/:id`, async (req, res) => {
  const { id } = req.params
  console.log("creating a new task status is not supported: " + id);
  res.status(StatusCodes.NOT_IMPLEMENTED);
})

export { taskStatusRoute };