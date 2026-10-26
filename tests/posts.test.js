import test from 'node:test';
import assert from 'node:assert/strict';
import { postsReducer, initialState } from '../src/reducer/postsReducer.js';
import { fetchPosts } from '../src/api/postsApi.js';

test('reducer transitions preserve immutable state and clear stale errors', () => {
  const original = Object.freeze({ posts: Object.freeze([]), loading: false, error: 'Old error' });
  const loading = postsReducer(original, { type: 'FETCH_START' });
  assert.deepEqual(loading, { posts: [], loading: true, error: null });
  assert.notEqual(loading, original);
  const posts = [{ id: 1, title: 'Example', body: 'Body' }];
  const success = postsReducer(loading, { type: 'FETCH_SUCCESS', payload: posts });
  assert.deepEqual(success, { posts, loading: false, error: null });
  assert.deepEqual(postsReducer(success, { type: 'FETCH_ERROR', payload: 'Offline' }),
    { posts: [], loading: false, error: 'Offline' });
  assert.deepEqual(initialState, { posts: [], loading: false, error: null });
});

test('unknown reducer actions return an equivalent new state', () => {
  const result = postsReducer(initialState, { type: 'UNKNOWN' });
  assert.deepEqual(result, initialState);
  assert.notEqual(result, initialState);
});

test('fetchPosts parses JSON and forwards the abort signal', async (t) => {
  const posts = [{ id: 1, title: 'Hello', body: 'World' }];
  const controller = new AbortController();
  t.mock.method(globalThis, 'fetch', async (url, options) => {
    assert.equal(url, 'https://jsonplaceholder.typicode.com/posts');
    assert.equal(options.signal, controller.signal);
    return { ok: true, json: async () => posts };
  });
  assert.deepEqual(await fetchPosts(controller.signal), posts);
});

test('fetchPosts rejects non-success HTTP status', async (t) => {
  t.mock.method(globalThis, 'fetch', async () => ({ ok: false, status: 503 }));
  await assert.rejects(fetchPosts(), /HTTP 503/);
});

test('fetchPosts propagates network errors and cancellation', async (t) => {
  t.mock.method(globalThis, 'fetch', async () => { throw new TypeError('Failed to fetch'); });
  await assert.rejects(fetchPosts(), /Failed to fetch/);
  globalThis.fetch.mock.mockImplementation(async () => { throw new DOMException('Aborted', 'AbortError'); });
  await assert.rejects(fetchPosts(), { name: 'AbortError' });
});

