# useSimpleAsync

The simplest(and lightest <1kB) way to execute an asynchronous function in react

**NOTE: This library is not supposed to be an alternative for useSWR or react-query. It is simply a lighter version of them, if you don't need all the features that those libraries provide**

Ever wanted to simply execute an async function without all the hassle and you don't want cache or anything like that? This is it.

### Installation

```ts
npm install use-simple-async
```

or

```ts
yarn add use-simple-async
```

### Usage

```ts
import useSimpleAsync from "use-simple-async";
import fs from "filesystem";

const getIOData = async () => await fs.readDir("/"); // [{name: string, path: string}]

const App = () => {
  const [data, { loading, error }] = useSimpleAsync(getIOData);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Something went wrong.</div>;

  return <div>{data.map((e) => e.name)}</div>;
};
```

### API

```ts
function useSimpleAync<T, V>(
  functionToExec: (variables?: V) => Promise<T>,
  options?: { variables?: V; skip?: boolean }
): [T, { loading: string; error: unknown; retry: () => void }];
```

### Refetching

Hook will automatically refetch when you change the function you provide to `useSimpleAsync`.
A simple recipe for e.g. fetching data with different variables would look like this:

```ts
import useSimpleAsync from "use-simple-async";

const App = () => {
  const [variables, setVariables] = useState({ input: "hello" });

  // Option one(recommended, easier): Let the hook handle variables
  const [data, { loading, error }] = useSimpleAsync(fetchSomeData, {
    variables,
  });
  // ---

  // Option two: Handle everything yourself
  const fetchData = useCallback(() => fetchSomeData(variables), [variables]); // useCallback is important here!
  const [data, { loading, error }] = useSimpleAsync(fetchData);
  // ---

  const handleChangeVariables = () => {
    setVariables({ input: "world!" });
  };

  if (loading) return "Loading...";

  return (
    <div>
      {data?.output}
      <button onClick={handleChangeVariables}>change variables</button>
    </div>
  );
};
```

### Submitting errors

If you see that something is not working for you or you'd like it to work differently, please don't hesistate to open a issue!

### Why not use XXX?

- [useSWR](https://swr.vercel.app/) or [react-query](https://www.npmjs.com/package/react-query) - too much features(unnecessarily big bundle), I just want to execute an async function.
- [use-async-query](https://www.npmjs.com/package/use-async-query) - don't really like the API, also it's 6kB for something this small
- [use-async-function](https://www.npmjs.com/package/use-async-function) - deprecated
- [react-suspense-fetch](https://github.com/dai-shi/react-suspense-fetch) - it's awesome, but I don't need Suspense and all the boilerplate, i just want to execute a function
- [react-hooks-fetch](https://github.com/dai-shi/react-hooks-fetch) - same as up, good library but too much boilerplate
- [use-async](https://www.npmjs.com/package/use-async) - no TS support
- [use-async-resource](https://www.npmjs.com/package/use-async-resource) - 39kB(too big for something this simple)
