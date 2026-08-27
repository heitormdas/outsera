import { loadConfig } from './config';
import { createInMemoryDatabase, initializeSchema } from './infrastructure/database';
import { importCsvDataset } from './infrastructure/import/csvImporter';

export async function initializeApplication(config = loadConfig()) {
  const db = createInMemoryDatabase();
  await initializeSchema(db);

  try {
    await importCsvDataset(db, config.csvPath);
  } catch (error) {
    throw new Error(`Startup import failed: ${error instanceof Error ? error.message : String(error)}`);
  }

  return { db };
}
