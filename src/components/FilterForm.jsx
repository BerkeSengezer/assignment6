import React from 'react';

export default function FilterForm({ filter, onFilterChange }) {
  return (
    <form className="filter-form" onSubmit={(event) => event.preventDefault()}>
      <label htmlFor="title-filter">Filter posts by title</label>
      <div className="filter-controls">
        <input
          id="title-filter"
          type="search"
          placeholder="Search for a word in a title..."
          value={filter}
          onChange={(event) => onFilterChange(event.target.value)}
        />
        <button type="button" onClick={() => onFilterChange('')} disabled={!filter}>
          Clear
        </button>
      </div>
    </form>
  );
}
