import React, { useCallback, useMemo, useState } from "react";
import { expect, jest, test } from "@jest/globals";
import useSimpleAsync from "../src/index";
import { render, act, waitFor, fireEvent } from "@testing-library/react";
import { Example, successfulRequest, successfulRequest2 } from "./utils";

test("correctly loads and resolves data", async () => {
  const { getByText } = render(<Example request={successfulRequest} />);

  const loadingElem = getByText("loading");
  expect(loadingElem).toBeDefined();

  await waitFor(() => expect(getByText("data!")).toBeDefined());
});

const ChangePropsExample = ({ request }: { request: () => Promise<any> }) => {
  const [data, { loading, error }] = useSimpleAsync<any, any>(request, {
    variables: {},
  });

  if (loading) {
    return <div>loading</div>;
  }
  return (
    <div>
      {data}
      <button>click</button>
    </div>
  );
};

test("refetches on prop change", async () => {
  const { getByText, rerender } = render(
    <ChangePropsExample request={successfulRequest} />
  );

  const loadingElem = getByText("loading");
  expect(loadingElem).toBeDefined();

  await waitFor(() => expect(getByText("data!")).toBeDefined());

  rerender(<ChangePropsExample request={successfulRequest2} />);

  const loadingElem2 = getByText("loading");
  expect(loadingElem2).toBeDefined();

  await waitFor(() => expect(getByText("data!")).toBeDefined());
});

test("types sanity checks", async () => {
  // These are just to fail when typescript is off
  const One = () => {
    const [data, meta] = useSimpleAsync(() => new Promise(() => {}));
  };
  const Two = () => {
    const [data2, meta2] = useSimpleAsync(
      (arg1: string) => new Promise(() => {}),
      { variables: "asd" }
    );
  };
  const Three = () => {
    const [data3, meta3] = useSimpleAsync(
      (arg1: string) => new Promise(() => {}),
      { variables: "123" }
    );
  };
  const Four = () => {
    const [data3, meta3] = useSimpleAsync(
      (arg1: string) => new Promise(() => {}),
      { variables: ["123"] }
    );
  };
  const req = jest.fn(async (arg1: string, arg2: { innerArg: string }) => {
    return new Promise<string>((resolve) => {
      setTimeout(() => {
        resolve("data");
      }, 500);
    });
  });
  const Five = () => {
    const [data3, { loading }] = useSimpleAsync(req, {
      variables: ["123", { innerArg: "asd" }],
    });
    if (loading) return <div>loading</div>;
    return <div>{data3}</div>;
  };
  const { getByText } = render(<Five />);
  expect(getByText("loading")).toBeDefined();

  await waitFor(() => expect(getByText("data")).toBeDefined());
});
