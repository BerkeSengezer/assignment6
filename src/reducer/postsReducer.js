export const initialState = { posts: [], loading: false, error: null };

export function postsReducer(state, action) {
  switch (action.type) {
    case 'FETCH_START':
      return { ...state, loading: true, error: null };
    case 'FETCH_SUCCESS':
      return { posts: action.payload, loading: false, error: null };
    case 'FETCH_ERROR':
      return { posts: [], loading: false, error: action.payload };
    default:
      return { ...state };
  }
}

