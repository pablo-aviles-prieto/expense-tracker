"use client";

export type FetchParams = {
  url: string;
  method: "GET" | "POST" | "PUT" | "DELETE";
  body?: Record<string, any>;
  extraHeaders?: Record<string, string>;
};

export const useFetch = () => {
  const fetchPetition = async <T>({
    url,
    method,
    body,
    extraHeaders,
  }: FetchParams) => {
    const response = await fetch(url, {
      method,
      body: body ? JSON.stringify(body) : undefined,
      headers: {
        ...extraHeaders,
      },
    });
    return response.json() as Promise<T>;
  };

  return { fetchPetition };
};
