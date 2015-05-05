var logger = require('mino-logger');
var express = require('express');
var bodyParser = require('body-parser');
var errorHandler = require('errorhandler');
var path = require('path');

function MinoCMS(options) {
	var cms = this;
	
    cms.config_server = new express();
    cms.config_server.get("/*", function(req, res) {
        res.send("MinoCMS config");
    });

    cms.folder_name = options.folder_name;
    cms.user = options.user;
    cms.full_path = '/' + cms.user + '/' + cms.folder_name + '/';

    cms.data_server = express();
    cms.data_server.use(errorHandler());
    cms.data_server.use(bodyParser.json());
    cms.data_server.use(express.static(path.join(__dirname, 'public')));
    cms.data_server.get("/path/:path", function(req,res) {
        cms.minodb.get([cms.full_path + req.params.path], function(get_err, get_res) {
            res.json(get_res.objects[0]);
        });
    });

}

MinoCMS.prototype.get_config_server = function(){
    var cms = this;
    return cms.config_server;
};

MinoCMS.prototype.info = function(){
    var cms = this;

    return {
        name: "MinoCMS",
        display_name: "MinoCMS"
    };
};

MinoCMS.prototype.init = function(minodb, callback){
    var cms = this;
    cms.minodb = minodb;

    minodb.internal_server().use('/cms', cms.data_server);
    
    minodb.save([{
        "name": cms.folder_name,
        "path": "/" + cms.user + "/",
        "folder": true
    }], function(err, res) {
        logger.debug(JSON.stringify(err, null, 4), res); 

        minodb.save_type({
            "name":"cms_content",
            "display_name":"CMS Content",
            "type":"key_value",
            "value_field":{
                "type":"string"
            }
        }, function(err, res){
            logger.debug(JSON.stringify(err,null,4), res);

            if (callback !== undefined) {
                callback();
            }  
        }); 
    });
};

module.exports = MinoCMS;