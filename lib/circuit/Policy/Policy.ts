export interface Policy {
  execution(type: 'success' | 'error'): this;
  reset(): this;
  allowExecution(): boolean;
}
