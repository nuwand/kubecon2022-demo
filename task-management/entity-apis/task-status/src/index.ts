import express from 'express'
import dotenv from 'dotenv'
import { createTerminus } from '@godaddy/terminus'
import { taskStatusRoute } from './taskstatus'
import { StatusCodes } from 'http-status-codes'

dotenv.config();
const app = express();

function onSignal() {
  console.log('server is starting cleanup');
  return Promise.all([
    console.log("closing database connection"),
  ]);
}

function onShutdown() :Promise<any>{
  console.log('cleanup finished, server is shutting down');
  return Promise.resolve();
}

async function healthCheck(): Promise<any> {
  return Promise.resolve()
}

app.use(express.json());
app.use(`/taskstatus`, taskStatusRoute);

const server = app.listen(8080, () =>
  console.log(`Server ready at: http://localhost:8080`),
)
createTerminus(server, {
  signal: 'SIGTERM',
  healthChecks: { '/healthcheck': healthCheck },
  onSignal: onSignal,
  onShutdown: onShutdown,
})
