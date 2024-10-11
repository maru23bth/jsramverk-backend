# jsramverk-backend

## Middleware
First import middlewareCheckToken

import middlewareCheckToken as auth from '../db/auth.mjs';

// Then use it on the route you want to protect
router.get('/', middlewareCheckToken , ...

If you want to access user information you can do so on the Responce object
res.locals.user = {
    username,
    email,
    id
}

## API routes

All data is transfered using json.

Sucess are reported with HTTP status 2XX.

Errors are reported with HTTP status >= 400.

### GET /auth/
Get user information

+ Response 200 (application/json)

    + Body

        ```ts
        {
            username: string,
            email: string,
            id: string
        }
        ```

### POST /auth/
Login

+ Body (application/json)

    ```ts
    {
        username: "(string)",
        password: "(string)"
    }
    ```

+ Response 200 (application/json)

    + Body

        ```ts
        {
            token: "(string)"
        }
        ```

### PUT /auth/
Create user

+ Body (application/json)

    ```ts
    {
        username: "(string)",
        email: "(string)",
        password: "(string)"
    }
    ```

+ Response 200 (application/json)

    + Body

        ```ts
        {
            userId: "(string)"
        }
        ```

### POST /auth/invite
Send email with invoite to email

+ Body
    ```json
    {
        "email": "email@example.com"
    }
    ```

+ Response 200 (application/json)

    + Body

        ```json
        {
            "message": "Email sent"
        }
        ```

## Data structures


## Response codes
- 2XX - Successful responses
- 3XX - Redirection messages
- 4XX - Client error responses
- 5XX Server error responses