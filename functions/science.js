'use strict';
const express = require('express');
const serverless = require('serverless-http');
const proxy = require('express-http-proxy');
const app = express();

const baseURL = "https://stats.unixfox.eu";

app.use('/science/js', proxy(baseURL, {
    proxyReqPathResolver: function (req) {
        return '/matomo.js';
    }
}));

app.use('/science/php', proxy(baseURL, {
    proxyReqPathResolver: function (req) {
        return '/matomo.php';
    }
}));

module.exports.handler = serverless(app);