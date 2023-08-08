require('dotenv').config();
import express, { Request, Response, NextFunction } from 'express';
import config from 'config';
import validateEnv from './utils/validateEnv';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import AppError from './utils/appError';

// VALIDATE ENV
validateEnv();

const app = express();

// MIDDLEWARE

// 1. Body parser

app.use(express.json({ limit: '10kb' }));

// 2. Logger
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}
// 3. Cookie Parser
app.use(cookieParser());
// 4. Cors
app.use(
  cors({
    origin: config.get<string>('origin'),
    credentials: true,
  }),
);
// ROUTES
// app.use('/api/auth', authRouter);
// app.use('/api/users', userRouter);
// app.use('/api/follow', followRouter);
// app.use('/api/posts', postRouter);

// HEALTH CHECKER
app.get('/api/healthchecker', async (_, res: Response) => {
  res.status(200).json({
    status: 'success',
    message: 'everything is good c:',
  });
});

// UNHANDLED ROUTE
app.all('*', (req: Request, res: Response, next: NextFunction) => {
  next(new AppError(404, `Route ${req.originalUrl} not found`));
});

// GLOBAL ERROR HANDLER

app.use((error: AppError, req: Request, res: Response, next: NextFunction) => {
  error.status = error.status || 'error';
  error.statusCode = error.statusCode || 500;

  res.status(error.statusCode).json({
    status: error.status,
    message: error.message,
  });
});

const port = config.get<number>('port');
app.listen(port);

console.log(`Server started on port: ${port}`);
