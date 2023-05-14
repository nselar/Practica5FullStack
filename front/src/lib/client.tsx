import { ApolloClient, InMemoryCache } from "@apollo/client";

const client = new ApolloClient({
    uri: 'http://localhost:8080', // Reemplaza con la URL de tu servidor GraphQL
    cache: new InMemoryCache(),
  });

export default client;

