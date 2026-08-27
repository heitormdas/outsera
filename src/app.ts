import express, { type Express } from 'express';

import type { AppConfig } from './config';

export function createApp(config: AppConfig): Express {
  void config;

  const app = express();

  app.disable('x-powered-by');
  app.use(express.json());

  return app;
}
