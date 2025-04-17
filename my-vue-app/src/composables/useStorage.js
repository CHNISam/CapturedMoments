// composables/useStorage.js （新建）
import { openDB } from 'idb';

export async function useBlobStore() {
  const db = await openDB('CapturedMoments', 1, {
    upgrade(db) { db.createObjectStore('blobs'); }
  });
  return {
    async save(key, blob) { await db.put('blobs', blob, key); },
    async load(key)      { return db.get('blobs', key);        }
  };
}
