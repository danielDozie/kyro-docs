# Deploying to Railway

Railway makes it simple to provision a PostgreSQL database and host your Kyro CMS application simultaneously.

## Deployment Steps

1. Install the Railway CLI:
   ```bash
   npm i -g @railway/cli
   ```
2. Authenticate your CLI:
   ```bash
   railway login
   ```
3. Link or create a project:
   ```bash
   railway init
   ```
4. Add a PostgreSQL database to your Railway project:
   ```bash
   railway add
   ```
   *Select **PostgreSQL** from the list.*
5. Railway will automatically expose a `DATABASE_URL` environment variable. Ensure your Kyro config maps this to `KYRO_DATABASE_URL` or reads from it directly.
6. Deploy your application:
   ```bash
   railway up
   ```
