import { ApolloClient, InMemoryCache } from "@apollo/client";

const client = new ApolloClient({
    // URL to the GRAPHQL Endpoint
    uri: process.env.NEXT_PUBLIC_HASURA_URL,
    // cache strategy, in this case, store in memory
    cache: new InMemoryCache(),
    // any custom headers that should go out with each request
    headers: {
      "x-hasura-admin-secret": process.env.NEXT_PUBLIC_HASURA_SECRET,
    },
});

export default client;