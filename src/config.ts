export type AppConfig = {
  port: number;
  csvPath: string;
};

export function loadConfig(env: NodeJS.ProcessEnv = process.env): AppConfig {
  const portValue = env.PORT ?? '3000';
  const csvPath = env.CSV_PATH ?? 'Movielist.csv';

  const port = Number.parseInt(portValue, 10);

  if (!Number.isInteger(port) || port <= 0) {
    throw new Error(`Invalid PORT configuration: ${portValue}`);
  }

  return {
    port,
    csvPath,
  };
}
