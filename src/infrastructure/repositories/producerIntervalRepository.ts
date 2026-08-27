import type { ProducerWin } from '../../app/producerIntervals';

export class InMemoryProducerIntervalRepository {
  constructor(private readonly winners: ProducerWin[] = []) {}

  async getWinnerYears(): Promise<ProducerWin[]> {
    return [...this.winners];
  }
}
