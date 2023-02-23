# useSimpleAsync

The simplest(and lightest with *less than 500 bytes gzipped*) way to execute an asynchronous function in react

**NOTE: This library is not supposed to be an alternative for useSWR or react-query. It is simply a lighter version of them, if you don't need all the features that those libraries provide**

Ever wanted to simply execute an async function without all the hassle and you don't want cache or anything like that? This is it. Supplies both CJS and ESM builds.

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

const getIOData = async (path: string) => await fs.readDir(path); // [{name: string, path: string}]
const fetchComplexData = (arg1: string, arg: { internalArg: string }) => string;

const App = () => {
  // with one argument
  const [data, { loading, error }] = useSimpleAsync(getIOData, {
    variables: "/",
  });
  // or - with multiple arguments - all of this is typesafe!
  const [data, { loading, error }] = useSimpleAsync(fetchComplexData, {
    variables: ["asd", { internalArg: "asd" }],
  });
  // ---

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Something went wrong.</div>;

  return <div>{data.map((e) => e.name)}</div>;
};
```

### API

```ts
function useSimpleAsync<T, V extends Array<any>>(
  asyncFunc: (...variables: V) => Promise<T>,
  options: { skip?: boolean; variables: V, useLayout?: boolean }
): [T | undefined, FuncMeta];

function useSimpleAync<T, V>(
  functionToExec: (variables?: V) => Promise<T>,
  options?: { variables?: V; skip?: boolean, useLayout?: boolean }
): [T, { loading: string; error: unknown; retry: () => void }];

function useSimpleAsync<T, V>(
  asyncFunc: (variables: V) => Promise<T>,
  options: { skip?: boolean; variables: V, useLayout?: boolean }
): [T | undefined, FuncMeta];

function useSimpleAsync<T>(
  asyncFunc: (variables?: undefined) => Promise<T>,
  options?: { skip?: boolean; variables?: undefined, useLayout?: boolean }
): [T | undefined, FuncMeta];
```
`useLayout: true` will execute your async function in `useLayoutEffect` instead of `useEffect`(default)

### Refetching

Hook will automatically refetch when you change the function reference you provide to `useSimpleAsync`.
A simple recipe for e.g. fetching data with different variables would look like this:

```ts
import useSimpleAsync from "use-simple-async";

const fetchSimpleData = (arg1: string) => string;

const App = () => {
  const [variables, setVariables] = useState({ input: "hello" });

  // Option one(recommended): Let the hook handle variables
  const [data, { loading, error }] = useSimpleAsync(fetchSimpleData, {
    variables,
  });
  // ---

  // Option two: Handle everything yourself
  // useCallback is important here!
  const fetchData = useCallback(
    () => fetchSimpleData(var1, var2, var3),
    [var1, var2, var3]
  );
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
