# Requirement #2 **SOCKETS**

## Collaborotive Editor
To enable real-time collaboration between the backend and frontend for the collaborative editor, we utilized the following libraries:

- [socket.io](https://socket.io/docs) on the server (backend)
- [socket.io-client](https://socket.io/docs) on the frontend


Instance of the server socket is initialized in ***app.mjs*** and passed to ***socketHandler***.

User authentication is managed using the middleware  ***io.use( socketMiddlewareCheckToken )*** , where the token sent by the client is verified using ***jwt.verify(token, secret)***

On successful token verification, the client emits ***socket.current.emit('my-create-room', documentId)*** to join a specific room for collaborative editing based on documentId, on which the server socket creates a room
***socket.on('my-create-room', (documentId) => {
            socket.join(documentId)
        })*** This ensures only users editing the same document receive updates.

When document is being edited we make sure that the client socket emits event ***socket.current.emit('document-[title or content]-change', {documentId, title})***.
When a user edits the content of the document, this event is emitted.
The change is then broadcasted to all other clients in the same room ***socket.to(documentId).emit('document-[title or content]-change', { documentId, content });***

Finally functions updateContentUseThrottling and updateTitleUseThrottling are used to prevent excessive updates or unnecessary server load.

The delay (2000ms or 2 seconds) ensures that updates are not fired too frequently but instead wait until the user stops interacting for 2 seconds.

After 2 seconds of inactivity, the update is sent to the server, and the document-saved event is emitted.
