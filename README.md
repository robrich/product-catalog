Product Catalog
===============

> Reference architecture microservice API in Node and MemSQL

This app uses TypeScript, Express, and [MemSQL](https://www.memsql.com/download) as a simple REST API.

We're coding this app live on the [MemSQL Developer Live Stream](https://www.crowdcast.io/e/memsql-developer-livestream). Join us every Friday at 11 am pacific, 2 pm eastern.


Developer Setup
---------------

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

3. `npm run serve` loads up the application in dev mode on port 4000 because port 8080 is taken by MemSQL Tools.

4. Open a browser to http://localhost:4000/


Build and Run on Kubernetes
---------------------------

In both app and api folders is a Dockerfile and .dockerignore to build the content into containers.

0. Install / aquire a Docker / Kubernetes runtime. Docker Desktop is likely the simplest local option. Inside Docker Desktop settings, enable Kubernetes mode.

1. Build the api container:

   ```
   cd api
   docker build -t api:v0.1 .
   cd ..
   ```

   Make sure to grab the last dot. That tells Docker what folder to build in.

2. Build the app container:

   ```
   cd app
   docker build -t app:v0.1 .
   cd ..
   ```

3. Install the MemSQL license into a Kubernetes secret:

   Login to https://portal.memsql.com/, click on licenses, and copy your license.

   Open k8s/memsql-license.yaml and paste it into place.

   Then add it to Kubernetes:

   ```
   kubectl apply -f k8s/memsql-license.yaml
   ```

4. Start up the MemSQL cluster in Kubernetes:

   ```
   kubectl apply -f k8s/memsql.yaml
   ```

   Why can't we use the `docker-compose.yaml` file for this? Because Docker Compose creates a separate network for each compose file, and the pods in Kubernetes can't easily bridge in.
   
   Run `docker-compose down` before starting up MemSQL in Kubernetes to avoid running out of RAM or hard drive space in your Docker runtime.

   Verify MemSQL container is running:

   ```
   kubectl get all
   ```

   You should see the MemSQL pod running and the MemSQL service exposed as NodePort `30080`.

5. Add database content:

   Open MemSQL Studio in a browser by launching `http://localhost:30080`, changing the domain to match your Kubernetes runtime.

   Login with the MemSQL Cluster-in-a-box details: username is root, password is blank.

   Switch to the SQL Editor page, and run all of the SQL commands in `setup.sql`.

6. Starting api, app, and ingress:

   ```
   kubectl apply -f k8s
   ```

   This runs all the yaml files in the `k8s` directory. `memsql.yaml` and `memsql-license.yaml` were run previously, so no change there.

7. Verify everything is running:

   ```
   kubectl get all,ing
   ```

   K8s ingress isn't part of "all", so we'll add it to the list.

   You should see a pod each for MemSQL, api, and app, and all should be running. You should also see a deployment and service for each as well as the ingress controller.

8. Debugging the deployment:

   If any of the pods don't have a status of `Running` (such as `CrashLoopBackOff`), find the pod name (e.g. `pod/api-abcdef123456`) and run:

   ```
   kubectl logs pod/api-abcdef123456
   # put your pod name here ^^
   ```

   This will show the console output and help you discover why it crashed.


LICENSE
-------

MIT
