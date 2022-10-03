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
  const [data, { loading, error }] = useSimpleAsync<any, any>(request);

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
