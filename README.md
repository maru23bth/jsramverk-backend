# jsramverk-backend


## API endpoints
- GET / -> List API endpoints 
- GET /documents -> Get array of documents 
- GET / documents/:id -> Get specific document with :id 
- PUT / documents -> Save a new document 
- PUT / documents/:id -> Update document with :id 
- DELETE / documents/:id -> Remove document

## Documents collection [/documents]

### List all documents [GET]
List all documents

+ Response 200 (application/json)

    + Body
    
        [
            {
                id: (string),
                title: (string),
                content: (string),
                created_at: (string)
            }
            ...
        ]

## Data structures

### Documents
+ id: 810b43d0-fc0d-4199-8a79-25b471c880bf (string, required)
+ title: Avengers: Endgame (string, required)
+ description: (string)