# jsramverk-backend

Backend express server for the [js framework](https://jsramverk.se/) course.


To clone the repo.

```
git clone https://github.com/maru23bth/jsramverk-backend
```

Installation.
```
npm install
```

To configure create an .env file in root of repo.
```
# Mongodb
DB_USER=
DB_PASSWORD=
DB_NAME="SSREditor"
DB_DOCUMENTS_COLLECTION="DocumentWithUser"
DB_USERS_COLLECTION="Users"

# Express HTTP Server
PORT=1337
```


To get started running the website.
```
npm run start
```

To started the website in development mode.
```
npm run dev
```

To run tests.
```
npm run test
```


## API routes

All data is transferred using json.

Success are reported with HTTP status 2XX.

Errors are reported with HTTP status >= 400.

### GET /documents
List all documents

+ Response 200 (application/json)

    + Body

        ```ts
        [
            Document,
            Document,
            Document,
            ...
        ]
        ```

### GET /documents/:id
Get a specific document

+ Response 200 (application/json)

    + Body

        ```
        Document
        ```


### POST /documents
Save a new document

+ Body (application/json)

    ```ts
    {
        title?: "(string)",
        content?: "(string)"
    }
    ```

+ Response 200 (application/json)

    + Body

        ```
        Document
        ```

### PUT /documents/:id
Update document with :id

+ Body (application/json)

    ```ts
    {
        title?: "(string)",
        content?: "(string)"
    }
    ```

+ Response 200 (application/json)

    + Body

        ```
        Document
        ```

### DELETE /documents/:id
Delete document with :id

+ Response 200 (application/json)

    + Body

        ```json
        {
            "message": "Document deleted"
        }
        ```


### POST /documents/:id/comment
Save a new comment

+ Body (application/json)

    ```ts
    {
        content: "(string)",
        location: "(string)"
    }
    ```

+ Response 200 (application/json)

    + Body

        ```
        Document
        ```

### PUT /documents/:id/comment/:commentId
Updatecomment

+ Body (application/json)

    ```ts
    {
        content: "(string)"
    }
    ```

+ Response 200 (application/json)

    + Body

        ```
        Document
        ```



 

### DELETE /documents/:id/comment/:commentId
Delete comment with :commentId from document with :id

+ Response 200 (application/json)

    + Body

        ```
        Document
        ```


### POST /documents/:id/collaborator
Add a new collaborator by userId or email

+ Body (application/json)

    ```ts
    {
        userId?: "(string)"
        email?: "(string)"
    }
    ```

+ Response 200 (application/json)

    + Body

        ```
        Document
        ```

### DELETE /documents/:id/collaborator
Delete collaborator

+ Body (application/json)

    ```ts
    {
        userId: "(string)"
    }
    ```

+ Response 200 (application/json)

    + Body

        ```
        Document
        ```


## Data structures

### Document

```ts
{
    id: string,
    type: string,
    title: string,
    content: string,
    collaborators: User[],
    comments: Comment[]
}
```

### User
```ts
{
    id: string,
    username: string,
    email: string
}
```

### Comment
```ts
{
    id: string,
    author: User,
    content: string,
    location: string
}
```

## Response codes
- 2XX - Successful responses
- 3XX - Redirection messages
- 4XX - Client error responses
- 5XX Server error responses