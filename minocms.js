var FieldVal = require('fieldval');
var logger = require('tracer').console();
var express = require('express');
var fieldval_rules = require('fieldval-rules');
var bodyParser = require('body-parser');
var errorHandler = require('errorhandler');
var path = require('path');
var MinoSDK = require('minosdk');

function MinoCMS(options) {
	var cms = this;
	
    cms.config_server = new express();
    cms.config_server.get("/*", function(req, res) {
        res.send("MinoCMS config");
    })

    cms.folder_name = options.folder_name;
    cms.user = options.user;
    cms.full_path = '/' + cms.user + '/' + cms.folder_name + '/';

    cms.data_server = express()
    cms.data_server.use(errorHandler());
    cms.data_server.use(bodyParser());
    cms.data_server.use(express.static(path.join(__dirname, 'public')));
    cms.data_server.post("/*", function(req,res) {
        logger.log(req.body);
        var name = req.body.name;
        logger.log(cms.full_path + name);
        cms.sdk.get([cms.full_path + name], function(get_err, get_res) {
            logger.log(JSON.stringify(get_err, null, 4), get_res);
            res.json(get_res.objects[0]);
        })
    });
}

MinoCMS.prototype.get_config_server = function(){
    var cms = this;
    logger.log("getting config server");
    logger.log(cms.config_server);
    return cms.config_server;
}

MinoCMS.prototype.info = function(){
    var cms = this;

    return {
        name: "MinoCMS",
        display_name: "MinoCMS"
    };
}

MinoCMS.prototype.create_folders = function(callback) {
    var cms = this;
    cms.sdk = new MinoSDK(cms.user);
    cms.sdk.set_local_api(cms.minodb.api);
    cms.sdk.call({
       "function": "save",
        "parameters": {
            "objects" : [{
                "name": cms.folder_name,
                "path": "/" + cms.user + "/",
                "folder": true
            }]
        } 
    }, function(err, res) {
        logger.log(JSON.stringify(err, null, 4), res); 
        if (callback !== undefined) {
            callback();
        }   
    })
}

MinoCMS.prototype.init = function(minodb){
    var cms = this;
    cms.minodb = minodb;

    minodb.internal_server().use('/cms', cms.data_server);
    cms.create_folders();
}

module.exports = MinoCMS;