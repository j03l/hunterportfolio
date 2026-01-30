---
title: "10 React Performance Tips I Learned the Hard Way"
description: "Practical performance optimization techniques for React applications, from avoiding unnecessary re-renders to code splitting strategies."
pubDate: 2024-02-20
tags: ["react", "performance", "javascript"]
readTime: "8 min read"
draft: false
---

After spending years building React applications, I've encountered (and caused) my fair share of performance issues. Here are the most impactful lessons I've learned.

## 1. Profile Before You Optimize

The React DevTools Profiler is your best friend. Before making any optimizations, always measure first. I've wasted hours optimizing components that weren't actually causing problems.

```jsx
// Use the Profiler component for programmatic profiling
<Profiler id="Navigation" onRender={onRenderCallback}>
  <Navigation />
</Profiler>
```

## 2. Understand When Components Re-render

A component re-renders when:

- Its state changes
- Its props change
- Its parent re-renders
- Context it consumes changes

That last one catches people off guard constantly.

## 3. Memoization Isn't Free

`useMemo` and `useCallback` have overhead. They're not always worth it:

```jsx
// ❌ Probably unnecessary - simple calculation
const doubled = useMemo(() => count * 2, [count]);

// ✅ Worth it - expensive calculation
const sortedData = useMemo(
  () => largeArray.sort((a, b) => complexComparison(a, b)),
  [largeArray]
);
```

## 4. Move State Down

Keep state as close as possible to where it's used:

```jsx
// ❌ State too high - entire app re-renders on hover
function App() {
  const [isHovered, setIsHovered] = useState(false);
  return (
    <div>
      <Header />
      <Main />
      <Button onHover={setIsHovered} isHovered={isHovered} />
    </div>
  );
}

// ✅ State localized - only Button re-renders
function Button() {
  const [isHovered, setIsHovered] = useState(false);
  return <button onMouseEnter={() => setIsHovered(true)}>...</button>;
}
```

## 5. Virtualize Long Lists

Rendering 10,000 items? Don't. Use virtualization:

```jsx
import { FixedSizeList } from 'react-window';

function VirtualizedList({ items }) {
  return (
    <FixedSizeList
      height={400}
      itemCount={items.length}
      itemSize={35}
    >
      {({ index, style }) => (
        <div style={style}>{items[index].name}</div>
      )}
    </FixedSizeList>
  );
}
```

## 6. Lazy Load Routes and Heavy Components

```jsx
const HeavyChart = lazy(() => import('./HeavyChart'));

function Dashboard() {
  return (
    <Suspense fallback={<ChartSkeleton />}>
      <HeavyChart />
    </Suspense>
  );
}
```

## 7. Debounce Expensive Operations

```jsx
function SearchInput() {
  const [query, setQuery] = useState('');

  const debouncedSearch = useMemo(
    () => debounce((q) => performSearch(q), 300),
    []
  );

  useEffect(() => {
    debouncedSearch(query);
  }, [query, debouncedSearch]);

  return <input onChange={(e) => setQuery(e.target.value)} />;
}
```

## 8. Avoid Inline Object/Array Creation in JSX

```jsx
// ❌ Creates new object every render
<Component style={{ color: 'red' }} />

// ✅ Stable reference
const style = { color: 'red' };
<Component style={style} />
```

## 9. Use Keys Properly

Keys help React identify which items changed. Bad keys cause unnecessary DOM operations:

```jsx
// ❌ Index as key causes issues with reordering
{items.map((item, index) => <Item key={index} {...item} />)}

// ✅ Stable unique identifier
{items.map((item) => <Item key={item.id} {...item} />)}
```

## 10. Consider Server Components

With React 19 and frameworks like Next.js, Server Components can eliminate client-side JavaScript entirely for static content.

---

The biggest lesson? Most performance issues stem from doing work that doesn't need to be done. Question every calculation, every render, every network request. Your users will thank you.
