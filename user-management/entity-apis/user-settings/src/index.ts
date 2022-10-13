import express from 'express'
import dotenv from 'dotenv'
import { userSettingsRoute } from './usersettings'

dotenv.config();
const app = express();

app.use(express.json());
app.use(`/usersettings`, userSettingsRoute);

const server = app.listen(8080, () =>
  console.log(`Server ready at: http://localhost:8080`),
)
