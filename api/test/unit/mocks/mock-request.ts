import { Request } from 'express';
import { Params } from 'express-serve-static-core';
import { Connection } from 'mysql2/promise';


export function makeMockRequest(db: Connection, {params, query}: {params?: Params, query?: Params}): Request {
  const req = {
    params: params || {},
    query: query || {},
    app: {
      locals: {
        db
      }
    }
  } as unknown;
  return req as Request;
}
