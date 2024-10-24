const { createProxyMiddleware } = require('http-proxy-middleware');
     
module.exports = function(app) {
    app.use(createProxyMiddleware('/api-issuer/**', { target: 'http://localhost:3001' }));
    app.use(createProxyMiddleware('/api-credential-service/**', { target: 'http://localhost:3001' }));
    app.use(createProxyMiddleware('/api-ipfs/**', { target: 'http://localhost:3001' }));
};