import { Policy } from './Policy';

export class RatePolicy implements Policy {

  private errors = 0;
  private totalCalls = 0;

  constructor(
    private readonly threshold: number,
  ) { }

  public execution(type: 'success' | 'error'): this {
    this.errors += type === 'error' ? 1 : 0;
    this.totalCalls += 1;

    return this;
  }

  public reset(): this {
    this.errors = this.totalCalls = 0;

    return this;
  }

  public allowExecution(): boolean {
    return this.rate() > this.threshold;
  }

  private rate(): number {
    return this.errors / this.totalCalls;
  }

}
