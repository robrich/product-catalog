import { Response } from 'express';
import { Connection } from 'mysql2/promise';


export type MockResponse<TResult> = Response & {
  state: {
    status?: number;
    json?: TResult | unknown;
  },
  locals: {
    db: Connection | undefined
  }
}

export function makeMockResponse<TResult>(db?: Connection | undefined): MockResponse<TResult> {
  const res = {
    state: {
    },
    locals: {
      db
    }
  } as MockResponse<TResult>;

  res.status = (status: number) => {
    res.state.status = status;
    return res;
  };

  res.json = (json: TResult) => {
    res.state.json = json;
    return res;
  };

  res.end = () => { return; };

  return res;
}
