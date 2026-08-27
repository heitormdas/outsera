import { createApp } from './app';
import { loadConfig } from './config';
import { SqliteProducerIntervalRepository } from './infrastructure/repositories/producerIntervalRepository';
import { initializeApplication } from './startup';

export async function startServer(config = loadConfig()) {
  const { db } = await initializeApplication(config);
  const app = createApp(config, {
    producerIntervalRepository: new SqliteProducerIntervalRepository(db),
  });

  return app.listen(config.port, () => {
    console.log(`Server listening on port ${config.port}`);
  });
}

if (require.main === module) {
  startServer().catch((error: unknown) => {
    console.error(error);
    process.exitCode = 1;
  });
}
