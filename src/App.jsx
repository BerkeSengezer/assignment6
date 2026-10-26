import React, { useEffect, useReducer, useState } from 'react';
import { fetchPosts } from './api/postsApi.js';
import { initialState, postsReducer } from './reducer/postsReducer.js';
import PostList from './components/PostList.jsx';
import FilterForm from './components/FilterForm.jsx';
import './styles.css';

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
      <header>
        <p className="eyebrow">Web Programming · Assignment 6</p>
        <h1>Post Dashboard</h1>
        <p className="intro">Explore posts from JSONPlaceholder. Find a post by searching its title.</p>
      </header>
      <FilterForm filter={filter} onFilterChange={setFilter} />
      {state.loading ? (
        <p className="status" role="status">Loading posts...</p>
      ) : state.error ? (
        <p className="status error" role="alert">{state.error}</p>
      ) : filteredPosts.length === 0 ? (
        <p className="status" role="status">No posts found.</p>
      ) : (
        <section aria-label="Posts">
          <p className="results-count" role="status">
            Showing {filteredPosts.length} of {state.posts.length} posts
          </p>
          <PostList posts={filteredPosts} />
        </section>
      )}
    </main>
  );
}
