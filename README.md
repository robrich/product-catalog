Product Catalog
===============

> Reference architecture microservice API in Node and MemSQL

This app uses TypeScript, Express, and [MemSQL](https://www.memsql.com/download) as a simple REST API.

We're coding this app live on the [MemSQL Developer Live Stream](https://www.crowdcast.io/e/memsql-developer-livestream). Join us every Friday at 11 am pacific, 2 pm eastern.


Setup
-----

1. Sign up for a free license to [MemSQL](https://www.memsql.com/download) (up to 4 nodes and 128 gigs ram).

2. Install and configure a Docker runtime.  For local development, install [Docker Desktop](https://www.memsql.com/blog/spin-up-a-memsql-cluster-on-docker-desktop-in-10-minutes/) and add additional memory to the Docker Desktop VM.

3. `set LICENSE_KEY=paste_your_license_key_here` Grab your license from the [portal](https://portal.memsql.com/), and set it into place on the terminal. This keeps the license key out of source control.

4. `docker-compose up` starts the database.

5. `npm install` to get all the Node modules.

6. Create a file named `.env` in the root of the project (next to `package.json`) that looks like this:

   ```json
   MEMSQL_HOST=localhost
   MEMSQL_USERNAME=root
   MEMSQL_PASSWORD=
   MEMSQL_DB=acme
   ```

   You may need to edit these details to match your Docker configuration.

7. `npm run start` and connect to https://localhost:3000


LICENSE
-------

MIT
