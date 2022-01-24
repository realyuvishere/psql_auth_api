# psql_auth_api

A simple API built using Node.js, Express.js and PostgreSQL. Key topics covered in this project:

- MVC model
- Middleware
- Modular design
- Abstraction
- Security

---

### Pre-requisites

- Have postgres database with a table called `users` with the following schema:
```
CREATE TABLE users (
id PRIMARY KEY,
email VARCHAR(200),
username VARCHAR(100),
name VARCHAR(100),
password VARCHAR(255)
);
```
- The software expects a `.env` file containing the following variable values:
    - `PSQL_USER`: Contains the postgres username
    - `PSQL_PASS`: Contains the postgres password
    - `PSQL_HOST`: Contains the postgres hostname
    - `PSQL_DB`: Contains the postgres database name
    - `PSQL_PORT`: Contains the postgres port
    - `JWT_SECRET`: Contains the secret key for `json-web-token (JWT)`