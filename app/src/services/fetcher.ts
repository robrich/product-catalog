import axios, { Method } from 'axios';

export default async function fetcher<TResult>(method: Method, url: string, data?: any): Promise<Response<TResult>> {

  const res = await axios({
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
  headers: any;
  data: TResult | undefined;
}
