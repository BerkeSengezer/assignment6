import { useEffect, useReducer, useState } from 'react';
import { fetchPosts } from './api/postsApi.js';
import { initialState, postsReducer } from './reducer/postsReducer.js';
import PostList from './components/PostList.jsx';
import FilterForm from './components/FilterForm.jsx';

export default function App() {
  const [state, dispatch] = useReducer(postsReducer, initialState);

  const [filter, setFilter] = useState('');
  const filteredPosts = state.posts.filter((post) =>
    post.title.toLowerCase().includes(filter.trim().toLowerCase()),
  );

  useEffect(() => {
    const controller = new AbortController();
    let active = true;

    async function loadPosts() {
      dispatch({ type: 'FETCH_START' });
      try {
        const posts = await fetchPosts(controller.signal);
        if (active) dispatch({ type: 'FETCH_SUCCESS', payload: posts });
      } catch (error) {
        if (active && error.name !== 'AbortError') {
          dispatch({
            type: 'FETCH_ERROR',
            payload: error.message || 'Something went wrong while loading posts.',
          });
        }
      }
    }

    loadPosts();
    return () => {
      active = false;
      controller.abort();
    };
  }, []);

  return (
    <main>
      <h1>Post Dashboard</h1><FilterForm filter={filter} onFilterChange={setFilter} />
      {state.loading ? (
        <p role="status">Loading posts...</p>
      ) : state.error ? (
        <p role="alert">{state.error}</p>
      ) : filteredPosts.length === 0 ? (
        <p role="status">No posts found.</p>
      ) : (
        <PostList posts={filteredPosts} />
      )}
    </main>
  );
}


