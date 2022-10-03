import { useState, useEffect, useCallback } from "react";
interface FuncMeta {
  loading: boolean;
  error: unknown;
  retry: () => void;
}

function useSimpleAsync<T, V>(
  asyncFunc: (variables: V) => Promise<T>,
  options?: { skip?: boolean; variables: V }
): [T | undefined, FuncMeta];

function useSimpleAsync<T>(
  asyncFunc: (variables?: undefined) => Promise<T>,
  options?: { skip?: boolean; variables?: undefined }
): [T | undefined, FuncMeta];

/**
 * A hook that allows to execute async functions with some helpful metadata.
 *
 * If the function passed as argument is redeclared on every render, it has to be wrapped with a useCallback
 */
function useSimpleAsync<T, V>(
  asyncFunc: (variables?: V) => Promise<T>,
  options?: { skip?: boolean; variables?: V }
): [T | undefined, FuncMeta] {
  const [loading, setLoading] = useState<boolean>(false);
  const [data, setData] = useState<T>();
  const [error, setError] = useState<unknown>();

  const { skip, variables } = options || {};

  const cb = useCallback(async () => {
    const asV = variables as V;
    return await asyncFunc(asV); // pass variables even when unnecessary
  }, [variables]);

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
    if (!skip) {
      exec();
    }
  }, [asyncFunc, skip]);

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
}

export default useSimpleAsync;
