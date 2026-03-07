import { useState } from 'react';
import { Link } from 'react-router-dom';
import { JOB_CATEGORIES } from '../constants';

function SearchForm({ filters, onSearch, sortBy, onSortChange }) {
  const [draft, setDraft] = useState(filters);

  const updateField = (name, value) => {
    setDraft((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const toggleCategory = (categoryId) => {
    const current = draft.categories || [];
    const updated = current.includes(categoryId)
      ? current.filter(id => id !== categoryId)
      : [...current, categoryId];
    updateField('categories', updated);
  };

  const submit = (event) => {
    event.preventDefault();
    onSearch(draft);
  };

  return (
    <div>
      <div className="header-actions">
        <Link to="/applied" className="btn-applied">
          📋 View Applied Jobs
        </Link>
      </div>

      <div className="info-banner">
        <p>🔍 Searching across Remotive, Arbeitnow, The Muse, and more job platforms</p>
      </div>

      <form className="panel search-form" onSubmit={submit}>
        <label>
          Description
          <input
            value={draft.description}
            onChange={(event) => updateField('description', event.target.value)}
            placeholder="Frontend, React, Node..."
          />
        </label>

        <label>
          Location
          <input
            value={draft.location}
            onChange={(event) => updateField('location', event.target.value)}
            placeholder="Remote, Berlin, New York..."
          />
        </label>

        <fieldset className="category-filters">
          <legend>Job Categories</legend>
          {JOB_CATEGORIES.map((category) => (
            <label key={category.id} className="checkbox-row">
              <input
                type="checkbox"
                checked={(draft.categories || []).includes(category.id)}
                onChange={() => toggleCategory(category.id)}
              />
              {category.label}
            </label>
          ))}
        </fieldset>

        <div className="form-row-inline">
          <label className="checkbox-row">
            <input
              type="checkbox"
              checked={draft.fullTimeOnly}
              onChange={(event) => updateField('fullTimeOnly', event.target.checked)}
            />
            Full time only
          </label>

          <label className="sort-label">
            Sort by:
            <select 
              value={sortBy} 
              onChange={(e) => onSortChange(e.target.value)}
              className="sort-select"
            >
              <option value="relevance">Relevance</option>
              <option value="date">Date Posted</option>
              <option value="company">Company</option>
              <option value="title">Job Title</option>
            </select>
          </label>
        </div>

        <button type="submit">Search</button>
      </form>
    </div>
  );
}

export default SearchForm;
