import express from 'express';
import graphQLHTTP from 'express-graphql';
import path from 'path';
import webpack from 'webpack';
import WebpackDevServer from 'webpack-dev-server';
import {DB} from './data/database';
import jwt from 'jsonwebtoken';
import {Schema} from './data/schema';
import bodyParser from 'body-parser';
import crypto from 'crypto';
import request from 'request';
import multer from 'multer';
import _ from 'lodash';
import sanitize from 'sanitize-filename';
import fs from 'fs';

const APP_PORT = 3000;
const API_PORT = 3001;
const GRAPHQL_PORT = 8181;

console.log("process.env.NODE_ENV : ");
console.log(process.env.NODE_ENV)

var isProduction = process.env.NODE_ENV == 'production';
var applicationPort = isProduction ? APP_PORT : APP_PORT;
var apiPort = isProduction ? API_PORT : API_PORT;
var graphqlPort = isProduction ? GRAPHQL_PORT : GRAPHQL_PORT;

// Expose a GraphQL endpoint
var graphQLServer = express();

const storage = multer.memoryStorage();
const multerMiddleware = multer({ storage: storage }).fields([{name: 'file'}]);
const uploadMiddleWare = (req, res, next) => {
    multerMiddleware(req, res, () => {

        const files = _.values(req.files);

        if (!files || files.length === 0) {
            next();
            return;
        }

        // Parse variables so we can add to them. (express-graphql won't parse them again once populated)
        req.body.variables = JSON.parse(req.body.variables);

        files.forEach(fileArray => {
            const file = fileArray[0];
            const filename = sanitize(file.originalname.replace(/[`~!@#$%^&*()_|+\-=÷¿?;:'",<>\{\}\[\]\\\/]/gi, ''));

            // save file to disk
            const filePath = path.join(__dirname, 'public/images', filename);
            fs.writeFileSync(filePath, file.buffer, 'binary', (err) => {
                if (err) {
                    console.log(err)
                    throw err;
                }
                console.log('File saved.')
            })

            // add files to graphql input. we only support single images here
            //req.body.variables.input_0['name'] = '/images/' + filename;
            req.body.variables.input_0;
        });

        next();
    });
}

graphQLServer.use('/graphql', uploadMiddleWare);
graphQLServer.use('/', graphQLHTTP( req => { return {
    graphiql: true,
    rootValue: {request: req},
    pretty: true,
    schema: Schema
}}));
graphQLServer.listen(graphqlPort, () => console.log(
    `GraphQL Server is now running on port ${graphqlPort}`
));


var app = express();
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "POST, GET, OPTIONS");    
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Credentials", true);
    next();
});

app.get('/', function (req, res) {
    res.send('Hello! The API is at http://localhost:' + apiPort + '/api');
});

app.post('/api/authenticate', (request, response) => {

    DB.models.user
        .findOne({where: {login: request.body.login}})
        .then((user) => {
            var password = crypto.createHash("sha256").update(request.body.password).digest("base64");

            if (user.password != password) {
                response.json({
                    success: false,
                    message: 'Bad authentication'
                });
            } else {
                let decoded = jwt.sign(user.dataValues, 'secret', {
                    expiresIn: 600
                });

                response.json({
                    success: true,
                    message: 'Enjoy your token!',
                    token: decoded
                });
            }

        })
        .catch((error) => {
            console.log(error);
            response.json({
                success: false,
                message: 'Unhandled error'
            });
        });
});


app.listen(apiPort);


if(!isProduction) {

	// Serve the Relay app
	var compiler = webpack({
	    entry: path.resolve(__dirname, 'js', 'app.js'),
	    module: {
		loaders: [
		    {
		        exclude: /node_modules/,
		        loader: 'babel',
		        test: /\.js$/,
		    }
		]
	    },
	    output: {filename: 'app.js', path: '/'}
	});

	var application = new WebpackDevServer(compiler, {
	    contentBase: '/public/',
	    proxy: {'/graphql': `http://localhost:${graphqlPort}`},
	    publicPath: '/js/',
	    stats: {colors: true}
	});

} else {
  
  var application = express();
  application.use('/graphql', (req, res) => {
    var url = `http://localhost:${graphqlPort}/req.url` ;
    req.pipe(request(url)).pipe(res); 
  })

}

// Serve static resources
application.use('/', express.static(path.resolve(__dirname, 'public')));

application.listen(applicationPort, () => {
    console.log(`App is now running on http://localhost:${applicationPort}`);
});



