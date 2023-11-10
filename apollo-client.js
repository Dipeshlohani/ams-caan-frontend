import { ApolloClient, HttpLink, InMemoryCache } from '@apollo/client'

const client = new ApolloClient({
  uri: 'http://localhost:3005/graphql',
  cache: new InMemoryCache(),
  link: new HttpLink({
    uri: 'http://localhost:3005/graphql'
  })
})

export default client
