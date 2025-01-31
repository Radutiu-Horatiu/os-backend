require('dotenv').config();

import express from 'express';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import swaggerJSDoc from 'swagger-jsdoc';

import './lib/db';
import userRoutes from './routes/user';
import { walletAddressAuth } from './middlewares/user';
import { swaggerOptions } from './swaggerOptions';

const app = express();
const port = process.env.PORT || 3333;

// Enable CORS for all origins
app.use(cors());

const swaggerDocs = swaggerJSDoc(swaggerOptions(port));
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

app.use(express.json());
app.use(express.raw({ type: 'application/vnd.custom-type' }));
app.use(express.text({ type: 'text/html' }));

userRoutes.use(walletAddressAuth);
app.use('/user', userRoutes);

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
