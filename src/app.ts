import express, { type Express } from 'express';

import type { AppConfig } from './config';
import { getProducerIntervalsUseCase } from './application/useCases/getProducerIntervalsUseCase';
import {
  InMemoryProducerIntervalRepository,
  type ProducerIntervalRepository,
} from './infrastructure/repositories/producerIntervalRepository';
import { getProducerIntervalsController } from './presentation/controllers/producerIntervalsController';

export type AppDependencies = {
  producerIntervalRepository?: ProducerIntervalRepository;
};

export function createApp(config: AppConfig, dependencies: AppDependencies = {}): Express {
  void config;

  const app = express();
  const repository = dependencies.producerIntervalRepository ?? new InMemoryProducerIntervalRepository();
  const controller = getProducerIntervalsController(getProducerIntervalsUseCase, repository);

  app.disable('x-powered-by');
  app.use(express.json());
  app.get('/producers/intervals', controller);

  return app;
}
