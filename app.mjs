import 'dotenv/config'
import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import documentsRoutes from './routes/documents.mjs';
import showdown from 'showdown';
import fs from 'fs';

import { GraphQLSchema } from 'graphql';
import { createHandler } from 'graphql-http/lib/use/express';
import { ruruHTML } from "ruru/server";

import RootQueryType from './graphql/root.mjs';


const port = process.env.PORT || 1337;

export const app = express();
app.disable('x-powered-by');

app.use(morgan('dev'));
app.use(express.json());
app.use(cors());

app.use('/documents', documentsRoutes);

// Create GraphQL schema
const schema = new GraphQLSchema({
  query: RootQueryType,
});

// Create and use the GraphQL handler.
app.all(
  "/graphql",
  createHandler({
    schema: schema
  })
)

// Serve the GraphiQL IDE.
app.get("/", (_req, res) => {
  res.type("html")
  res.end(ruruHTML({ endpoint: "/graphql" }))
})

const server = app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

app.get('/', (req, res) => {
  const readmeContent = fs.readFileSync('README.md', 'utf8');
  const converter = new showdown.Converter({completeHTMLDocument: true});
  res.send(converter.makeHtml(readmeContent));
});

app.close = () => {
  server.close();
  console.log("HTTP server closed.");
}

process.on("SIGTERM", app.close);