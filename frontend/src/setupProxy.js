const { createProxyMiddleware } = require('http-proxy-middleware');
     
module.exports = function(app) {

    const backendHost = process.env.REACT_APP_BACKEND_URL || 'http://localhost:3001';

    app.use('/api-issuer/*', createProxyMiddleware({ target: backendHost, changeOrigin: true}));
    app.use('/api-credential-service/*', createProxyMiddleware({ target: backendHost, changeOrigin: true}));
    app.use('/api-ipfs/*', createProxyMiddleware({ target: backendHost, changeOrigin: true}));
};