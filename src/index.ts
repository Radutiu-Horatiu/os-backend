require('dotenv').config();

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import swaggerUi from 'swagger-ui-express';
import swaggerJSDoc from 'swagger-jsdoc';
import rateLimit from 'express-rate-limit';

import './lib/db';
import { walletAddressAuth } from './middlewares/user';
import { swaggerOptions } from './swaggerOptions';

import userRoutes from './routes/user';

const app = express();
const port = process.env.PORT || 3333;

// Configure rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again after 15 minutes',
});

// Apply rate limiting to all requests
app.use(limiter);

// Use helmet to set various HTTP headers for security
app.use(helmet());

// Swagger
const swaggerDocs = swaggerJSDoc(swaggerOptions());
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// CORS
app.use(
  cors({
    origin: (origin, callback) => {
      if (origin === process.env.ALLOWED_ORIGIN) callback(null, true);
      else callback(new Error('Not allowed by CORS'));
    },
  })
);

// Middleware
app.use(express.json());
app.use(express.raw({ type: 'application/vnd.custom-type' }));
app.use(express.text({ type: 'text/html' }));

// Routes
app.use('/user', walletAddressAuth, userRoutes);

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
