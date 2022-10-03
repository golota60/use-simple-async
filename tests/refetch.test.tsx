import React, { useCallback, useMemo, useState } from "react";
import { expect, jest, test } from "@jest/globals";
import useSimpleAsync from "../src/index";
import { render, act, waitFor, fireEvent } from "@testing-library/react";
import { Example, successfulRequest, successfulRequest2 } from "./utils";

const RefetchExample = () => {
  const [funcToUseState, setFuncToUseState] = useState(() => successfulRequest);
  const [data, { loading, error }] = useSimpleAsync<any, any>(funcToUseState);

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
test("refetches on internal function change", async () => {
  const { getByText, rerender } = render(<RefetchExample />);

  const loadingElem = getByText("loading");
  expect(loadingElem).toBeDefined();

  await waitFor(() => expect(getByText("data!")).toBeDefined());

  const button = getByText("click");
  fireEvent.click(button);
  rerender(<RefetchExample />);

  const loadingElem2 = getByText("loading");
  expect(loadingElem2).toBeDefined();

  await waitFor(() => expect(getByText("data!")).toBeDefined());
});

const ChangeVarsExample = ({ request }: { request: () => Promise<any> }) => {
  const [variables, setVariables] = useState({ variab: "some var" });
  const [data, { loading, error }] = useSimpleAsync<any, any>(request, {
    variables,
  });

  const handleChange = () => {
    setVariables({ variab: "another var" });
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

test("refetches on variables change", async () => {
  const { getByText, rerender } = render(
    <ChangeVarsExample request={successfulRequest} />
  );

  const loadingElem = getByText("loading");
  expect(loadingElem).toBeDefined();

  await waitFor(() => expect(getByText("data!")).toBeDefined());

  const button = getByText("click");
  fireEvent.click(button);
  rerender(<ChangeVarsExample request={successfulRequest2} />);

  const loadingElem2 = getByText("loading");
  expect(loadingElem2).toBeDefined();

  await waitFor(() => expect(getByText("data!")).toBeDefined());
});

const UseCallbackExample = () => {
  const [variables, setVariables] = useState({ variab: "some var" });
  const fetchData = useCallback(
    () => successfulRequest(variables),
    [variables]
  );
  const [data, { loading, error }] = useSimpleAsync(fetchData);

  const handleChange = () => {
    setVariables({ variab: "another var" });
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

test("refetch useCallback example", async () => {
  const { getByText, rerender } = render(<UseCallbackExample />);

  const loadingElem = getByText("loading");
  expect(loadingElem).toBeDefined();

  await waitFor(() => expect(getByText("data!")).toBeDefined());

  const button = getByText("click");
  fireEvent.click(button);

  const loadingElem2 = getByText("loading");
  expect(loadingElem2).toBeDefined();

  await waitFor(() => expect(getByText("data!")).toBeDefined());
});
