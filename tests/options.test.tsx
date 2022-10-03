import React, { useCallback, useMemo, useState } from "react";
import { expect, jest, test } from "@jest/globals";
import useSimpleAsync from "../src/index";
import { render, act, waitFor, fireEvent } from "@testing-library/react";
import { Example, successfulRequest, successfulRequest2 } from "./utils";

export const OptionsExample = ({ request }) => {
  const [skip, setSkip] = useState(true);
  const [data, { loading, error }] = useSimpleAsync<any, any>(request, {
    skip,
  });

  if (loading) {
    return <div>loading</div>;
  }
  if (error) {
    return <div>something went wrong</div>;
  }
  return (
    <div>
      <span>{data || "no data"}</span>
      <button onClick={() => setSkip(false)}>unskip!</button>
    </div>
  );
};

test("doesn't fire a request when options.skip = true", () => {
  const { getByText } = render(<OptionsExample request={successfulRequest} />);

  expect(successfulRequest).toHaveBeenCalledTimes(0);
  expect(getByText("no data")).toBeDefined();
});

test("doesn't fire a request when options.skip = true and then fires when it changes to false", async () => {
  const { container, getByText } = render(
    <OptionsExample request={successfulRequest} />
  );

  expect(successfulRequest).toHaveBeenCalledTimes(0);
  expect(getByText("no data")).toBeDefined();

  fireEvent.click(getByText("unskip!"));

  expect(getByText("loading")).toBeDefined();
  expect(successfulRequest).toHaveBeenCalledTimes(1);
  await waitFor(() => expect(getByText("data!")).toBeDefined());
});
