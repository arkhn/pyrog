export const AUTH_TOKEN = 'ARKHN_TOKEN'

// API urls
export const ENGINE_URL = (process.env.NODE_ENV === 'development') ?
    'https://engine.arkhn.org' :
    'https://engine.arkhn.org'

export const SCHEMA_URL = (process.env.NODE_ENV === 'development') ?
    'http://localhost:8181' :
    'https://api.live.arkhn.org'

export const GRAPHQL_WS_URL = (process.env.NODE_ENV === 'development') ?
    'ws://localhost:4000' :
    'wss://graphql.live.arkhn.org'

export const GRAPHQL_HTTP_URL = (process.env.NODE_ENV === 'development') ?
    'http://localhost:4000' :
    'https://graphql.live.arkhn.org'
