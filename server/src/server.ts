import express from 'express';
import path from 'node:path';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';

dotenv.config();

import db from './config/connection.js';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import typeDefs from './schemas/typeDefs.js';
import resolvers from './schemas/resolvers.js';
import { authenticate } from './services/auth.js';


const app = express();
const PORT = process.env.PORT || 3001;

const server = new ApolloServer({
  typeDefs,
  resolvers,
});


app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(cookieParser());




if (process.env.PORT) {
  const __dirname = path.dirname(new URL(import.meta.url).pathname);
  
  app.use(express.static(path.join(__dirname, '../../client/dist')));
  app.get('*', (_, res) => {
    res.sendFile(path.join(__dirname, '../../client/dist/index.html'));
  })
}


db.once('open', async () => {
  await server.start();

  app.use(
    '/graphql',

    expressMiddleware(server, {
      context: authenticate
    })
  );

  app.listen(PORT, () => console.log(`🌍 Now listening on localhost:${PORT}`));
});