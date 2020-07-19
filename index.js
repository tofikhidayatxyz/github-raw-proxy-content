const express = require('express')
const { createProxyMiddleware } = require('http-proxy-middleware')
const mime = require('mime')
const app = express()
const compression =require('compression')

app.use(compression())
app.disable('x-powered-by')

const handleProxyRes = (proxyRes, req, res) => {
    res.header('Proxy-Connection', 'keep-alive')
    res.header('Access-control-Allow-Origin', '*')
    res.header('Access-Control-Allow-Methods', 'GET')
    proxyRes.headers['Content-Type'] = mime.getType(req.originalUrl)
    delete proxyRes.headers['x-fastly-request-id']
    delete proxyRes.headers['x-served-by']
    delete proxyRes.headers['x-github-request-id']
    delete proxyRes.headers['content-security-policy']
    // console.log(proxyRes.headers)
}

app.use('/:username/*', createProxyMiddleware({
    target: 'https://raw.githubusercontent.com/',
    changeOrigin: true,
    onProxyRes: handleProxyRes
}))


app.use((req, res) => {
    res.header('Content-Type', 'Application/json')
    res.send({
        'status': 404,
        'message': 'Not found'
    })
    res.end()
})

app.listen(2000)
