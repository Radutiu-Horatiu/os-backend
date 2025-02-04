require('dotenv').config();

import express from 'express';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import swaggerJSDoc from 'swagger-jsdoc';

import './lib/db';
import { walletAddressAuth } from './middlewares/user';
import { swaggerOptions } from './swaggerOptions';

import userRoutes from './routes/user';

const app = express();
const port = process.env.PORT || 3333;

// Enable CORS for all origins
app.use(cors());

const swaggerDocs = swaggerJSDoc(swaggerOptions());
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

app.use(express.json());
app.use(express.raw({ type: 'application/vnd.custom-type' }));
app.use(express.text({ type: 'text/html' }));

app.use('/user', walletAddressAuth, userRoutes);

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
