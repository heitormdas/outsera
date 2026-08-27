export type ProducerWin = {
  producer: string;
  year: number;
};

export type IntervalResultItem = {
  producer: string;
  interval: number;
  previousWin: number;
  followingWin: number;
};

export type IntervalCalculationResult = {
  min: IntervalResultItem[];
  max: IntervalResultItem[];
};

export function calculateProducerIntervals(wins: ProducerWin[]): IntervalCalculationResult {
  const yearsByProducer = new Map<string, number[]>();

  for (const win of wins) {
    const existing = yearsByProducer.get(win.producer) ?? [];
    existing.push(win.year);
    yearsByProducer.set(win.producer, existing);
  }

  const intervals: IntervalResultItem[] = [];

  for (const [producer, years] of yearsByProducer.entries()) {
    if (years.length < 2) {
      continue;
    }

    const sortedYears = [...years].sort((left, right) => left - right);

    for (let index = 1; index < sortedYears.length; index += 1) {
      const previousWin = sortedYears[index - 1];
      const followingWin = sortedYears[index];
      const interval = followingWin - previousWin;

      intervals.push({
        producer,
        interval,
        previousWin,
        followingWin,
      });
    }
  }

  if (intervals.length === 0) {
    return { min: [], max: [] };
  }

  const minInterval = Math.min(...intervals.map((entry) => entry.interval));
  const maxInterval = Math.max(...intervals.map((entry) => entry.interval));

  const min = intervals
    .filter((entry) => entry.interval === minInterval)
    .sort((left, right) => {
      if (left.interval !== right.interval) {
        return left.interval - right.interval;
      }
      if (left.producer !== right.producer) {
        return left.producer.localeCompare(right.producer);
      }
      if (left.previousWin !== right.previousWin) {
        return left.previousWin - right.previousWin;
      }
      return left.followingWin - right.followingWin;
    });

  const max = intervals
    .filter((entry) => entry.interval === maxInterval)
    .sort((left, right) => {
      if (left.interval !== right.interval) {
        return left.interval - right.interval;
      }
      if (left.producer !== right.producer) {
        return left.producer.localeCompare(right.producer);
      }
      if (left.previousWin !== right.previousWin) {
        return left.previousWin - right.previousWin;
      }
      return left.followingWin - right.followingWin;
    });

  return { min, max };
}
