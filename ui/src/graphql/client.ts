import { ApolloClient, ApolloLink, HttpLink, InMemoryCache } from '@apollo/client'

const httpLink = new HttpLink({ uri: '/graphql' })

const authLink = new ApolloLink((operation, forward) => {
  const raw = localStorage.getItem('auth-token')
  const token = raw ? (JSON.parse(raw) as string) : null
  if (token) {
    operation.setContext({
      headers: { Authorization: `Bearer ${token}` },
    })
  }
  return forward(operation)
})

export const apolloClient = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
  dataMasking: true,
})
