import { createServer } from 'http';
import appInit from './app';

(async () => {

  const port = process.env.PORT || 3000;

  const app = await appInit();
  app.set('port', port);

  const server = createServer(app);

  server.listen(port, () => {
    console.log(`listening on port ${port}`);
  });
})();
