import { ApolloClient, HttpLink, InMemoryCache } from '@apollo/client'

const client = new ApolloClient({
  uri: 'http://localhost:3001/graphql',
  cache: new InMemoryCache(),
  link: new HttpLink({
    uri: 'http://localhost:3001/graphql'
  })
})

export default client
