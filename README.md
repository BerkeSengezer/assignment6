# Assignment 6 — Post Dashboard

Web Programming, Fall 2026. A React application that loads posts from JSONPlaceholder and filters them by title.

## Run locally

Requires Node.js 20.19+ or 22.12+ (Node.js 22 LTS recommended).

```sh
npm install
npm run dev
```

Open the local address printed by Vite.

```sh
npm test
npm run build
npm run preview
```

## File organization

- `src/api/postsApi.js`: Fetch API request, HTTP status check, and parsed JSON. No React or UI code.
- `src/reducer/postsReducer.js`: initial state and pure FETCH_START, FETCH_SUCCESS, FETCH_ERROR transitions.
- `src/App.jsx`: owns reducer state and filter text; starts the initial request and coordinates the UI.
- `src/components/FilterForm.jsx`: controlled input whose value and change handler come from App.
- `src/components/PostList.jsx`: maps posts to Post components using post.id as the stable key.
- `src/components/Post.jsx`: stateless title and body display.
- `src/main.jsx`: React entry point with StrictMode.
- `src/styles.css`: plain responsive CSS; no UI libraries.
- `tests/posts.test.js`: reducer and fetch behavior checks.

## Implementation challenges

- **Cleanup and StrictMode:** an AbortController cancels the request on cleanup. An active flag also prevents late responses from dispatching after cleanup, including during StrictMode's development setup/cleanup cycle.
- **Derived state:** only the original posts and filter text are stored. Matching posts are calculated during render with a case-insensitive title search; filtering does not use an effect.
- **Errors versus empty results:** fetch rejects failed HTTP responses. App uses try/catch and displays loading, readable error, and empty messages separately.
- **Immutable transitions:** the reducer returns new objects and never fetches or changes existing state.

## Manual verification

1. Open the app: a loading message appears, followed by API posts.
2. Search for part of a title, change letter case, and clear the input.
3. Search for a nonexistent title: “No posts found.” appears.
4. In browser developer tools, enable Offline and reload: a readable error appears without crashing.
5. Resize to a narrow screen: cards use a single column.

The API requires an internet connection. No authentication, persistence, custom hooks, Context, Redux, Axios, or third-party UI libraries are used.


