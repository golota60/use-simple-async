import React, { useMemo, useState } from "react";
import { expect, jest, test } from "@jest/globals";
import useSimpleAsync from "../src/index";
import { render, act, waitFor, fireEvent } from "@testing-library/react";

const successfulRequest = jest.fn(async (): Promise<string> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve("data!");
    }, 500);
  });
});

// Needed to check whether function refetches on request ref change
const successfulRequest2 = jest.fn(async (): Promise<string> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve("data!");
    }, 500);
  });
});

const rejectedRequest = jest.fn(async (): Promise<unknown> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      reject("error");
    }, 500);
  });
});

const Example = ({ request }) => {
  const [data, { loading, error }] = useSimpleAsync<any>(request);

  if (loading) {
    return <div>loading</div>;
  }
  if (error) {
    return <div>something went wrong</div>;
  }
  return <div>{data}</div>;
};

const RefetchExample = ({ request }) => {
  const [funcToUseState, setFuncToUseState] = useState(() => successfulRequest);
  const [data, { loading, error }] = useSimpleAsync<any>(funcToUseState);

  const handleChange = () => {
    setFuncToUseState(() => successfulRequest2);
  };

  if (loading) {
    return <div>loading</div>;
  }
  return (
    <div>
      {data}
      <button onClick={handleChange}>click</button>
    </div>
  );
};

test("correctly loads and resolves data", async () => {
  const { getByText } = render(<Example request={successfulRequest} />);

  const loadingElem = getByText("loading");
  expect(loadingElem).toBeDefined();

  await waitFor(() => expect(getByText("data!")).toBeDefined());
});

test("correctly loads and resolves errors", async () => {
  const { getByText } = render(<Example request={rejectedRequest} />);

  const loadingElem = getByText("loading");
  expect(loadingElem).toBeDefined();

  expect(rejectedRequest).toHaveBeenCalledTimes(1);

  await waitFor(() => expect(getByText("something went wrong")).toBeDefined());
});

test("refetches on function change", async () => {
  const { getByText, rerender } = render(
    <RefetchExample request={successfulRequest} />
  );

  const loadingElem = getByText("loading");
  expect(loadingElem).toBeDefined();

  await waitFor(() => expect(getByText("data!")).toBeDefined());

  const button = getByText("click");
  fireEvent.click(button);
  rerender(<RefetchExample request={successfulRequest2} />);

  const loadingElem2 = getByText("loading");
  expect(loadingElem2).toBeDefined();

  await waitFor(() => expect(getByText("data!")).toBeDefined());
});
