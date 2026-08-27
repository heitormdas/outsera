import type { Request, Response } from 'express';

import type { IntervalCalculationResult } from '../../app/producerIntervals';

export type ProducerIntervalsUseCase = (input: { winners: Array<{ producer: string; year: number }> }) => IntervalCalculationResult;

export function getProducerIntervalsController(
  useCase: ProducerIntervalsUseCase,
  repository: { getWinnerYears: () => Promise<Array<{ producer: string; year: number }>> },
) {
  return async function producerIntervalsController(_req: Request, res: Response): Promise<void> {
    const winners = await repository.getWinnerYears();
    const result = useCase({ winners });

    res.status(200).json(result);
  };
}
