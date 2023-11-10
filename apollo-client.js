import ApolloClient from 'apollo-client'
import { ApolloProvider } from '@apollo/react-hooks'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { createHttpLink } from 'apollo-link-http'

const httpLink = createHttpLink({
  uri: 'http://localhost:3005/graphql' // Replace with your GraphQL server URL
})

const client = new ApolloClient({
  link: httpLink,
  cache: new InMemoryCache()
})

export default client
