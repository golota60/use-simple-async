import { jest, test, expect } from "@jest/globals";
import { render, waitFor } from "@testing-library/react";
import React from "react";
import { Example, rejectedRequest } from "./utils";

test("correctly loads and resolves errors", async () => {
  const { getByText } = render(<Example request={rejectedRequest} />);

  const loadingElem = getByText("loading");
  expect(loadingElem).toBeDefined();

  expect(rejectedRequest).toHaveBeenCalledTimes(1);

  await waitFor(() => expect(getByText("something went wrong")).toBeDefined());
});
