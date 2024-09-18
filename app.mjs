import 'dotenv/config'
import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import documentsRoutes from './routes/documents.mjs';
import showdown from 'showdown';
import fs from 'fs';


const port = process.env.PORT || 1337;

export const app = express();
app.disable('x-powered-by');

app.use(morgan('dev'));
app.use(express.json());
app.use(cors());

app.use('/documents', documentsRoutes);

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