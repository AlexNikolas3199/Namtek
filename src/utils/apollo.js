import {ApolloClient} from 'apollo-client'
import {InMemoryCache} from 'apollo-cache-inmemory'
import {onError} from 'apollo-link-error'
import {ApolloLink} from 'apollo-link'
import {HttpLink} from 'apollo-link-http'
import {setContext} from 'apollo-link-context'

//import { url } from './appConfig'

export const host = process.env.REACT_APP_SERV_URL

const authLink = setContext(async (_, {headers}) => {
    let token
    if (typeof window !== 'undefined') {
        token = await localStorage.getItem('token')
    }
    return {
        headers: {
            ...headers,
            authorization: token ? token : ''
        }
    }
})

const errorLink = onError(({graphQLErrors, networkError}) => {
    if (graphQLErrors)
        graphQLErrors.map(({message, locations, path}) =>
            console.error(
                `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`,
            ),
        );

    if (networkError) console.log(`[Network error]: ${networkError}`);
})

const httpLink = new HttpLink({
    uri: `${host}`
})

const link = ApolloLink.from([authLink, errorLink, httpLink])

const client = new ApolloClient({
    link,
    cache: new InMemoryCache()
})

export default client
