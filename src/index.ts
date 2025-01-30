require('dotenv').config();

import express from 'express';
import swaggerUi from 'swagger-ui-express';
import swaggerJSDoc from 'swagger-jsdoc';

import './lib/db';
import userRoutes from './routes/user';
import { userIdAuth } from './middlewares/user';
import { swaggerOptions } from './swaggerOptions';

const app = express();
const port = 3333;

const swaggerDocs = swaggerJSDoc(swaggerOptions(port));
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

app.use(express.json());
app.use(express.raw({ type: 'application/vnd.custom-type' }));
app.use(express.text({ type: 'text/html' }));

userRoutes.use(userIdAuth);
app.use('/users', userRoutes);

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
