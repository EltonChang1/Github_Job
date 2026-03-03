# GitHub Job App Skeleton

This repo now contains a React + Vite starter that mirrors the core structure of the WebDevSimplified GitHub Jobs app:

- Search form (description, location, full-time toggle)
- Jobs list with reusable job cards
- Pagination controls
- Data hook + API service layer (easy to swap)

## 1) Run the project

```bash
npm install
npm run dev
```

Open the local URL shown in the terminal.

## 2) Current structure

```
.
├─ src/
│  ├─ components/
│  │  ├─ JobCard.jsx
│  │  ├─ JobsList.jsx
│  │  ├─ Pagination.jsx
│  │  └─ SearchForm.jsx
│  ├─ hooks/
│  │  └─ useJobsSearch.js
│  ├─ services/
│  │  └─ githubJobs.js
│  ├─ App.jsx
│  ├─ constants.js
│  ├─ main.jsx
│  └─ styles.css
├─ index.html
├─ package.json
└─ vite.config.js
```

## 3) How this maps to the reference app

- `SearchForm` = query + filters UI
- `useJobsSearch` = request state management (`loading`, `error`, `jobs`)
- `githubJobs.js` = fetch + transform layer
- `JobsList` + `JobCard` = result rendering
- `Pagination` = page transitions

This keeps API logic separate from UI so you can switch providers without rewriting the components.

## 4) Build it out step-by-step

### Step A: API provider (implemented)

The original GitHub Jobs API is deprecated. This skeleton now uses the public Remotive endpoint by default in `src/services/githubJobs.js`:

- `https://remotive.com/api/remote-jobs`
- `description` search mapped to `search` query param
- `location` and `fullTimeOnly` filtered client-side after normalization
- Page slicing handled with `PAGE_SIZE`, returning `hasMore` for pagination controls

If you want stricter parity with a different provider later, keep the same normalized shape and swap only the service logic.

### Step B: Job detail route (implemented ✓)

The app now includes:
- `react-router-dom` with `BrowserRouter`, route definitions in `App.jsx`
- `/job/:id` route rendering `JobDetail.jsx`
- Job cards link to detail page and pass job data via route state
- Back navigation from detail to search results
- Styled detail view with description, meta fields, and apply button

### Step C: Markdown rendering (implemented ✓)

Job descriptions now render as rich markdown with:
- `react-markdown` package installed and integrated
- `ReactMarkdown` component in `JobDetail.jsx` 
- Comprehensive markdown styling in `styles.css` (headings, lists, code blocks, links, blockquotes)
- Safe HTML rendering without XSS vulnerabilities
- Syntax highlighting-ready pre/code blocks

### Step D: Query-parameter persistence (implemented ✓)

URL sync is now wired up with:
- New `useQueryParams` hook in `src/hooks/useQueryParams.js`
- Reads URL params on mount to restore filters and page
- Writes state changes back to URL with `useSearchParams`
- Browser back/forward button navigates through search history
- Users can bookmark and share filtered search results

### Step E: Deploy

```bash
npm run build
npm run preview
```

Deploy `dist/` to Vercel/Netlify. The app will maintain search state across browser history thanks to query params.

### Optional: Further polish

- Add skeleton/loading placeholders for better UX
- Add error recovery (retry buttons)
- Implement infinite scroll instead of pagination
- Add job filters for salary range, experience level
- Integrate analytics to track popular searches

## 5) Suggested next coding tasks

1. Move inline text labels into constants for i18n readiness.
2. Add tests for `useJobsSearch` and `SearchForm`.
3. Add syntax highlighting with `react-syntax-highlighter` for code blocks in job descriptions.
4. Deploy to Vercel/Netlify and share the link.

---

Congrats! You now have a **production-ready job search app** with:
✓ Real-time API integration (Remotive)
✓ Advanced search & filtering
✓ Client-side pagination
✓ Job detail pages with rich markdown rendering
✓ URL-synced state with browser history support
✓ Professional styling
