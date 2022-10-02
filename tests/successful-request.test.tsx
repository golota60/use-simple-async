import React from "react";
import { expect, jest, test } from "@jest/globals";
import useSimpleAsync from "../src/index";
import { render, act, waitFor } from "@testing-library/react";

const successfulRequest = jest.fn(async (): Promise<string> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve("data!");
    }, 500);
  });
});

const errorRequest = jest.fn(async (): Promise<unknown> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      throw new Error("error");
    }, 500);
  });
});

const SuccessExample = (func: any) => {
  const [data, { loading, error }] = useSimpleAsync<any>(successfulRequest);

  if (loading) {
    return <div>loading</div>;
  }
  return <div>{data}</div>;
};

const ErrorExample = (func: any) => {
  const [data, { loading, error }] = useSimpleAsync<any>(errorRequest);

  if (loading) {
    return <div>loading</div>;
  }
  if (error) {
    return <div>something went wrong</div>;
  }
  return <div>{data}</div>;
};

test("correctly loads and resolves data", () => {
  const { getByText } = render(<SuccessExample />);

  const loadingElem = getByText("loading");
  expect(loadingElem).toBeDefined();

  waitFor(() => expect(getByText("data!")).toBeDefined());
});

test("correctly loads and resolves errors", () => {
  const { getByText } = render(<ErrorExample />);

  const loadingElem = getByText("loading");
  expect(loadingElem).toBeDefined();

  waitFor(() => expect(getByText("something went wrong")).toBeDefined());
});
