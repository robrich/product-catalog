import axios, { Method } from 'axios';
import store from '../store';
import { Headers } from '../types/fetcher';

export default async function fetcher<TResult>(method: Method, url: string, data?: unknown): Promise<Response<TResult>> {

  const jwt: string | undefined = store.state.jwt;

  const headers: Headers = {
    'Content-Type': 'application/json; charset=utf-8'
  };

  if (jwt) {
    headers.Authorization = 'Bearer ' + jwt;
  }

  const res = await axios({
    headers,
    method,
    url,
    data,
    validateStatus: () => true // don't throw on non-200
  });

  return {
    ok: res.status >= 200 && res.status < 400,
    status: res.status,
    headers: res.headers,
    data: res.data ? res.data as TResult : undefined,
  } as Response<TResult>;
}

export interface Response<TResult> {
  ok: boolean;
  status: number;
  headers: unknown;
  data: TResult | undefined;
}
