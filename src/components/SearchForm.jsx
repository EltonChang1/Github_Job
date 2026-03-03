import { useState } from 'react';

function SearchForm({ filters, onSearch }) {
  const [draft, setDraft] = useState(filters);

  const updateField = (name, value) => {
    setDraft((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const submit = (event) => {
    event.preventDefault();
    onSearch(draft);
  };

  return (
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

      <label className="checkbox-row">
        <input
          type="checkbox"
          checked={draft.fullTimeOnly}
          onChange={(event) => updateField('fullTimeOnly', event.target.checked)}
        />
        Full time only
      </label>

      <button type="submit">Search</button>
    </form>
  );
}

export default SearchForm;
