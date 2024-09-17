# jsramverk-backend


## API routes

### GET /documents
List all documents

+ Response 200 (application/json)

    + Body

        ```json
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

        ```json
        Document
        ```


### PUT /documents
Save a new document

+ Body

    ```json
    Document
    ```

+ Response 200 (application/json)

    + Body

        ```json
        Document
        ```

### /documents/:id
Update document with :id

+ Body

    ```json
    Document
    ```

+ Response 200 (application/json)

    + Body

        ```json
        Document
        ```

### PUT /documents
Save a new document

+ Response 200 (application/json)

    + Body

        ```json
        Document
        ```

## Data structures

### Document
    {
        id: (string),
        title: (string),
        content: (string),
        created_at: (string)
    }


## Response codes
- 2XX - Successful responses
- 3XX - Redirection messages
- 4XX - Client error responses
- 5XX Server error responses