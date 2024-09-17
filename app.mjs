import 'dotenv/config'

import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import documentsRoutes from './routes/documents.mjs';


const port = process.env.PORT;

const app = express();
app.disable('x-powered-by');

app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cors());

app.use('/documents', documentsRoutes);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
