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
 * @param {function} asyncFunc - Async function to be executed
 * @param {Object} options
 *
 * @returns [data, {loading, error}]
 */
const useSimpleAsync = <T, V>(
  asyncFunc: (variables?: V) => Promise<T>,
  options: { skip?: boolean; variables?: V } = {
    skip: false,
    variables: undefined,
  }
): [T | undefined, FuncMeta] => {
  const [loading, setLoading] = useState<boolean>(false);
  const [data, setData] = useState<T | undefined>();
  const [error, setError] = useState<unknown>();

  const cb = useCallback(async () => {
    return await asyncFunc(options?.variables);
  }, [options.variables]);

  const exec = async () => {
    try {
      if (!options.skip) {
        setLoading(true);
        const newData = await cb();
        setData(newData);
      }
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
    exec();
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
