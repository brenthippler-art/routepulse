# Lighthouse: before and after

Two performance changes to the exception list page (`/`), measured with Lighthouse in Chrome DevTools against the production deployment.

| | |
|---|---|
| **URL** | https://routepulse-lovat.vercel.app/ |
| **Mode** | Navigation, Mobile (simulated throttling: 4x CPU slowdown, slow 4G) |
| **Lighthouse** | 13.4.1, Chrome 155, incognito window |
| **Reports** | [`before.html`](./before.html) (Oct 13, 10:34 CT) · [`after.html`](./after.html) (Oct 13, 11:25 CT) |

## Results

| Metric | Before | After | Change |
|---|---|---|---|
| **Performance score** | 91 | **95** | +4 |
| Total Blocking Time | 370 ms | **200 ms** | −170 ms |
| Max Potential First Input Delay | 290 ms | 210 ms | −80 ms |
| Time to Interactive | 2.5 s | 2.2 s | −0.3 s |
| Largest Contentful Paint | 1.8 s | 2.0 s | +0.2 s |
| First Contentful Paint | 1.1 s | 1.7 s | +0.6 s |
| Speed Index | 1.7 s | 1.7 s | — |
| Cumulative Layout Shift | 0 | 0 | — |
| Network requests during load | 22 | **13** | −9 |
| `/api/exceptions` response time | 855 ms | **60 ms** | −795 ms |
| Accessibility / Best Practices / SEO | 100 / 100 / 100 | 100 / 100 / 100 | — |

## What changed

### 1. Made the simulated API delay opt-in

The mock `/api/exceptions` route had an unconditional 600 ms `setTimeout` that I added during development so the loading state was visible. It made every real page load wait for a delay that existed only for demo purposes.

The delay now runs only when it's requested with `?simulate=slow` (1.5 s, long enough to see the skeleton clearly). The default path returns immediately. `?simulate=error` still returns a 500 for the error state.

**Effect:** the API response went from 855 ms to 60 ms in the trace, and the populated list appeared about one second sooner in the unthrottled trace (last visual change at 1.7 s before, 0.7 s after).

### 2. Turned off prefetch on the list's detail links

Next.js's `<Link>` prefetches every link that scrolls into view. The list has 22 rows, each linking to `/exceptions/[id]`, so after hydration the browser was fetching route data for detail pages the dispatcher hadn't opened yet. The "before" trace shows 9 of these `?_rsc=` requests during the measurement window, competing with the main thread while the page was becoming interactive.

I added `prefetch={false}` to the links in `ExceptionTable.tsx` and `ExceptionCards.tsx`. Detail pages are small server-rendered routes, so the cost of not prefetching is a short fetch when the user clicks a row.

**Effect:** requests during load dropped from 22 to 13. None of the remaining requests are speculative.

## Reading the numbers honestly

- **The two changes were measured together.** The "before" report predates both, so the 91 → 95 gain and the 170 ms TBT drop can't be split between them. An intermediate run, after the delay fix and before the prefetch change, scored 80. That run hit a freshly deployed (cold) build: the HTML document alone took 650 ms. I treated it as noise, not as a measurement of the prefetch change.
- **These are single runs.** TBT is the most variable Lighthouse metric. Total main-thread work went *up* in the "after" run (1.7 s → 2.7 s) even though TBT went down, which suggests the CPU conditions during the two runs weren't identical.
- **FCP and LCP are slightly worse in the "after" report.** Neither change touches what renders first (the server-rendered header, filter bar, and `<h1>`), so I read this as run-to-run variance rather than a regression. LCP is still in the "good" range (under 2.5 s).
- **What the changes clearly did,** independent of variance: the API stopped waiting 600 ms for no reason, and the page stopped making 9 network requests the user didn't ask for.

## Not changed, and why

| Lighthouse finding | Decision |
|---|---|
| Unused JavaScript (~52 KB) | Framework and React runtime code shipped by Next.js. Not something this app controls. |
| Legacy JavaScript (~14 KB) | Polyfills in a Next.js framework chunk. Same reason. |
| Render-blocking CSS (6 KB) | The single Tailwind stylesheet. Blocking render on it prevents a flash of unstyled content, which is the intended trade-off. |
| DOM size (559 elements) | The list renders both the desktop table and the mobile cards and hides one with CSS. Merging them into one responsive layout would cut the DOM roughly in half, but it's a larger refactor that touches the tests. It's the next thing to try if performance work continues. |
| No CSP / COOP / X-Frame-Options headers | Security hardening, not performance. Out of scope for this pass. |

## Reproducing

1. Load https://routepulse-lovat.vercel.app/ a few times first so the deployment and API function are warm.
2. Open an incognito window and close other heavy apps.
3. DevTools → Lighthouse → Mode: Navigation, Device: Mobile, all four categories → Analyze page load.
4. Run three to five times and compare medians, not single runs.
