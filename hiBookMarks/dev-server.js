var express = require('express');
var webpack = require('webpack');
var devMiddleware = require('webpack-dev-middleware');
var hotMiddleware = require('webpack-hot-middleware');

var app = express();
var config = require('./webpack.config.js');
var compiler = webpack(config);

app.use(devMiddleware(compiler, {
    publicPath:config.output.publicPath,
    stats: { colors: true },
    lazy: false,
    watchOptions: {
        aggregateTimeout: 300,
        poll: true
    },
}));

app.use(hotMiddleware(compiler));

var server = app.listen(10010, function() {
    var port = server.address().port;
    console.log('Open http://localhost:%s', port);
});