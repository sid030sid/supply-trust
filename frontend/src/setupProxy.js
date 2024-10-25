const { createProxyMiddleware } = require('http-proxy-middleware');
     
module.exports = function(app) {
    if(process.env.NODE_ENV !== 'production'){
        const backendHost = 'http://localhost:3001';
        app.use('/api-issuer/*', createProxyMiddleware({ target: backendHost, changeOrigin: true}));
        app.use('/api-credential-service/*', createProxyMiddleware({ target: backendHost, changeOrigin: true}));
        app.use('/api-ipfs/*', createProxyMiddleware({ target: backendHost, changeOrigin: true}));
    }
};