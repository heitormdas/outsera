import { calculateProducerIntervals, type ProducerWin } from '../../app/producerIntervals';

export type GetProducerIntervalsInput = {
  winners: ProducerWin[];
};

export function getProducerIntervalsUseCase(input: GetProducerIntervalsInput) {
  return calculateProducerIntervals(input.winners);
}
