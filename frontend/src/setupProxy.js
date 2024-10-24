const { createProxyMiddleware } = require('http-proxy-middleware');
     
module.exports = function(app) {
    app.use('/api-issuer/*', createProxyMiddleware({ target: 'http://localhost:3001', changeOrigin: true}));
    app.use('/api-credential-service/*', createProxyMiddleware({ target: 'http://localhost:3001', changeOrigin: true}));
    app.use('/api-ipfs/*', createProxyMiddleware({ target: 'http://localhost:3001', changeOrigin: true}));
};