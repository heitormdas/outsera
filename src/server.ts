import { createApp } from './app';
import { loadConfig } from './config';

export function startServer(config = loadConfig()) {
  const app = createApp(config);

  return app.listen(config.port, () => {
    console.log(`Server listening on port ${config.port}`);
  });
}

if (require.main === module) {
  startServer();
}
