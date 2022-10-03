import { jest } from "@jest/globals";
import React from "react";
import useSimpleAsync from "../src/index";

export const Example = ({ request }: { request: () => Promise<any> }) => {
  const [data, { loading, error }] = useSimpleAsync(request);

  if (loading) {
    return <div>loading</div>;
  }
  if (error) {
    return <div>something went wrong</div>;
  }
  return <div>{data}</div>;
};

export const rejectedRequest = jest.fn(async (vars?: any): Promise<unknown> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      reject("error");
    }, 500);
  });
});

export const successfulRequest = jest.fn(
  async (vars?: any): Promise<string> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve("data!");
      }, 500);
    });
  }
);

export const noVarsRequest = jest.fn(async (): Promise<string> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve("data!");
    }, 500);
  });
});

// Needed to check whether function refetches on request ref change
export const successfulRequest2 = jest.fn(
  async (vars?: any): Promise<string> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve("data!");
      }, 500);
    });
  }
);
