import { useState, useEffect } from "react";
interface FuncMeta {
  loading: boolean;
  error: unknown;
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
const useSimpleAsync = <T>(
  asyncFunc: () => Promise<T>,
  options: { skip?: boolean } = { skip: false }
): [T | undefined, FuncMeta] => {
  const [loading, setLoading] = useState<boolean>(false);
  const [data, setData] = useState<T | undefined>();
  const [error, setError] = useState<unknown>();

  useEffect(() => {
    (async () => {
      try {
        if (!options.skip) {
          setLoading(true);
          const newData = await asyncFunc();
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
    })();
  }, [asyncFunc, options.skip]);

  return [data, { loading, error }];
};

export default useSimpleAsync;
