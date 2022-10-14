import express from 'express'
import dotenv from 'dotenv'
import { createTerminus } from '@godaddy/terminus'
import { taskRoute } from './task'
import prisma from './dbClient'

dotenv.config();
const app = express();

function onSignal() {
  console.log('server is starting cleanup');
  return Promise.all([
    console.log("closing database connection"),
    prisma.$disconnect()
  ]);
}

function onShutdown(): Promise<any> {
  console.log('cleanup finished, server is shutting down');
  return Promise.resolve();
}

async function healthCheck(): Promise<any> {
  await prisma.$queryRaw`SELECT 1`
  return Promise.resolve()
}

app.use(express.json());
app.use(`/task`, taskRoute);

const server = app.listen(8080, () =>
  console.log(`Server ready at: http://localhost:8080`),
)

createTerminus(server, {
  signal: 'SIGTERM',
  healthChecks: { '/healthcheck': healthCheck },
  onSignal: onSignal,
  onShutdown: onShutdown,
})
