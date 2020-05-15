Product Catalog
===============

> Reference architecture microservice API in Node and MemSQL

This app uses TypeScript, Express, and [MemSQL](https://www.memsql.com/download) as a simple REST API.

We're coding this app live on the [MemSQL Developer Live Stream](https://www.crowdcast.io/e/memsql-developer-livestream). Join us every Friday at 11 am pacific, 2 pm eastern.


Setup
-----

### Setup Database

1. Sign up for a free license to [MemSQL](https://www.memsql.com/download) (up to 4 nodes and 128 gigs ram).

2. Install and configure a Docker runtime.  For local development, install [Docker Desktop](https://www.memsql.com/blog/spin-up-a-memsql-cluster-on-docker-desktop-in-10-minutes/) and add additional memory to the Docker Desktop VM.

3. `set LICENSE_KEY=paste_your_license_key_here` Grab your license from the [portal](https://portal.memsql.com/), and set it into place on the terminal. This keeps the license key out of source control.

4. `docker-compose up` starts the database.

5. Get to MemSQL Tools, the browser-based query and administration tool at http://localhost:8080/  For the cluster-in-a-box container, username is `root` and password is blank. 


### Setup Node API

The `api` folder contains the API that shims data between the front-end and the database.

1. `cd api`

2. `npm install` to get all the Node modules.

3. Create a file named `.env` in the root of the project (next to `package.json`) that looks like this:

   ```json
   MEMSQL_HOST=localhost
   MEMSQL_USERNAME=root
   MEMSQL_PASSWORD=
   MEMSQL_DB=acme
   ```

   You may need to edit these details to match your Docker configuration.

4. `npm run start` and connect to https://localhost:3000


### Setup Vue SPA

The `app` folder contains the Single Page Application (SPA) presented to users.

1. `cd app`

2. `npm install` to get all the Node modules.

3. `npm run serve` loads up the application in dev mode.

4. Open a browser to http://localhost:8080/


LICENSE
-------

MIT
