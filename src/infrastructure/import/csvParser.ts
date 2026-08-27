import { parse } from 'csv-parse/sync';

export type CsvMovieRecord = {
  year: string;
  title: string;
  studios: string;
  producers: string;
  winner: string;
};

export function parseCsvFile(content: string): CsvMovieRecord[] {
  const records = parse(content, {
    delimiter: ';',
    columns: true,
    skip_empty_lines: true,
    trim: true,
    relax_column_count: true,
  }) as Array<Record<string, string>>;

  return records.map((record) => ({
    year: String(record.year ?? '').trim(),
    title: String(record.title ?? '').trim(),
    studios: String(record.studios ?? '').trim(),
    producers: String(record.producers ?? '').trim(),
    winner: String(record.winner ?? '').trim(),
  }));
}
