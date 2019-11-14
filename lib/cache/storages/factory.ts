import { Factory } from '../../interfaces/factory';
import { MemoryStorage } from './MemoryStorage';
import { Storage } from './Storage';

export class StorageFactory implements Factory<Storage> {

  constructor(
    private readonly limit: number,
    private readonly storage: 'memory',
  ) { }

  public create(): Storage {
    switch (this.storage) {
      case 'memory':
        return this.memoryStorage();

      default:
        throw new Error(`@cache Storage type is not supported: ${this.storage}.`);
    }
  }

  private memoryStorage(): MemoryStorage {
    return new MemoryStorage(this.limit);
  }

}
