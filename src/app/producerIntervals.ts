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

  // Optimize: Find min/max in single pass during generation instead of separate passes
  let minInterval = Infinity;
  let maxInterval = -Infinity;

  for (const entry of intervals) {
    if (entry.interval < minInterval) {
      minInterval = entry.interval;
    }
    if (entry.interval > maxInterval) {
      maxInterval = entry.interval;
    }
  }

  // Deterministic sort comparator (used for both min and max arrays)
  const compare = (left: IntervalResultItem, right: IntervalResultItem) => {
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
  };

  const min = intervals.filter((entry) => entry.interval === minInterval).sort(compare);
  const max = intervals.filter((entry) => entry.interval === maxInterval).sort(compare);

  return { min, max };
}
