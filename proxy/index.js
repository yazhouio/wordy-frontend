const Fastify = require('fastify');
const server = Fastify();
const proxy = require('@fastify/http-proxy');
require('dotenv').config();

server.register(proxy, {
    upstream: process.env.NEXT_PUBLIC_ENDPOINT,
    prefix: '/proxy',
    http2: false,
    websocket: true,
    wsUpstream: process.env.NEXT_PUBLIC_WS_URL,
    rewritePrefix: '/',
});

server.listen({ port: 3001 });
