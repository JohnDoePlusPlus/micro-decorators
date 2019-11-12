import { CacheOptions } from '..';
import { HashService } from '../../utils/hash/hash';
import { Cache } from '../caches/Cache';
import { ClassCache } from '../caches/ClassCache';
import { InstanceCache } from '../caches/InstanceCache';
import { expirationFactory } from './expirationFactory';
import { storeFactory } from './storeFactory';

const cacheFactories: ReadonlyMap<
  'class' | 'instance',
  <K>(timeout: number, options: CacheOptions) => Cache<K>
> = new Map<'class' | 'instance', <K>(timeout: number, options: CacheOptions) => Cache<K>>()
  .set('class', classCacheFactory)
  .set('instance', instanceCacheFactory);

export function cacheFactory<K = any>(timeout: number, options: CacheOptions): Cache<K> {
  const { scope } = options;

  const factory = cacheFactories.get(scope);

  if (!factory) {
    throw new Error(`@cahce Scope type is not suported: ${scope}.`);
  }

  return factory(timeout, options);
}

function classCacheFactory<K>(timeout: number, options: CacheOptions): ClassCache<K> {
  const storage = storeFactory(options);
  const expiration = expirationFactory(timeout, options);
  const hash = new HashService();

  return new ClassCache<K>(storage, expiration, hash);
}

function instanceCacheFactory<K>(timeout: number, options: CacheOptions): InstanceCache<K> {
  const hash = new HashService();

  return new InstanceCache(
    () => storeFactory(options),
    () => expirationFactory(timeout, options),
    hash,
  );
}