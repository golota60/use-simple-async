import { useState, useEffect, useCallback } from "react";
interface FuncMeta {
  loading: boolean;
  error: unknown;
  retry: () => void;
}

/**
 * A hook that allows to execute async functions with some helpful metadata.
 *
 * If the function passed as argument is redeclared on every render, it has to be wrapped with a useCallback
 */
const useSimpleAsync = <T, V>(
  asyncFunc: (variables?: V) => Promise<T>,
  options: { skip?: boolean; variables?: V } = {}
): [T | undefined, FuncMeta] => {
  const [loading, setLoading] = useState<boolean>(false);
  const [data, setData] = useState<T>();
  const [error, setError] = useState<unknown>();

  const { skip = false, variables = {} } = options;

  const cb = useCallback(async () => {
    return await asyncFunc(options?.variables);
  }, [options.variables]);

  const exec = async () => {
    try {
      setLoading(true);
      const newData = await cb();
      setData(newData);
    } catch (e: any) {
      setError(e);
      setData(undefined);
      // eslint-disable-next-line no-console
      console.error("Error while resolving async function", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!options.skip) {
      exec();
    }
  }, [asyncFunc, options.skip]);

  return [
    data,
    {
      loading,
      error,
      retry: () => {
        exec();
      },
    },
  ];
};

export default useSimpleAsync;
