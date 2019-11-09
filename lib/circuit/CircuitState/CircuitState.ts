import { Policy } from '../Policy/Policy';

export class CircuitState {

  private state: 'open' | 'close' | 'half-open' = 'open';

  constructor(
    private readonly timeout: number,
    private readonly policy: Policy,
  ) { }

  public allowExecution(): boolean {
    return this.state !== 'close';
  }

  public success() {
    if (this.state === 'half-open') {
      this.state = 'open';
      this.policy.reset();
    }
    this.policy.execution('success');

    return this;
  }

  public error() {
    const allowExecution = this.policy.allowExecution();
    if (!allowExecution || this.state === 'half-open') {
      this.state = 'close';

      setTimeout(() => this.state = 'half-open', this.timeout);
    }
    this.policy.execution('error');

    return this;
  }

}
