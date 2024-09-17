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


### POST /documents
Save a new document

+ Body

    ```json
    {
        title: (string),
        content: (string)
    }
    ```

+ Response 200 (application/json)

    + Body

        ```json
        Document
        ```

### PUT /documents/:id
Update document with :id

+ Body

    ```json
    {
        title: (string),
        content: (string)
    }
    ```

+ Response 200 (application/json)

    + Body

        ```json
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