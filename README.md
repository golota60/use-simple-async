# useSimpleAsync

**NOTE: This library is not supposed to be an alternative for useSWC or react-query. It is simply a lighter version of them, if you don't need all the features that those libraries provide**

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

const getIOData = async () => {
  const fileList = await fs.readDir("/"); // {name: string, path: string}
  return fileList;
};

const App = () => {
  const [data, { loading, error }] = useSimpleAsync(getIOData);

  if (loading) {
    return <div>loading...</div>;
  }
  if (error) {
    return <div>Something went wrong.</div>;
  }

  return <div>{data.map((e) => e.name)}</div>;
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
