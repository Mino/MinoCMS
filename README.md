MinoCMS
==========

MinoCMS is a [MinoDB](https://github.com/Mino/MinoDB/) plugin providing CMS functionality. 

MinoCMS plugin provides an easy-to-use frontend interface to items stored in a ```cms``` folder. Typically, MinoDB browser or API are used for storing and modifying the data. Stored values can be both text and html.

#Example usage

```javascript
var MinoCMS = require('minocms');
var minocms = new MinoCMS({
  user: "my_app",
  folder_name: "cms"
});
mino.add_plugin(minocms);
```

CMS items are stored in the ```/my_app/cms/``` folder. Items use ```cms_content``` type for storing data.

#Documentation
##Backend
```javascript
var minocms = new MinoCMS(config);
```

Available config options:
* ```user```- username that should be making all API calls
* ```folder_name``` - name of the folder where MinoCMS should store CMS items (```/<user>/<folder_name>/```)

##Frontend

###Usage
Import jquery and minocms.js, which is served by the MinoCMS plugin on ```<MINO_PATH>/cms/minocms.js```.
```html
<script type="text/javascript" src="/jquery/dist/jqeury.js"></script>
<script type="text/javascript" src="/mino/cms/minocms.js"></script>
```

###get(address, callback)
Returns a JSON object by a given address within cms folder (specified in config). Address can include fields of the item (i.e. ```"homepage.title"``` is a valid address, provided that ```homepage``` is an item and ```title``` is its field specified in a ```cms_content``` type).

```javascript
minocms.get("homepage", callback);
minocms.get("homepage.title", callback);
```

###jQuery plugin
####$('#element').minocms_text(address)
Asynchronously sets element's text to the value specified by a given address.

####$('#element').minocms_text(address)
Asynchronously sets element's html to the value specified by a given address.

[fieldval-rules](https://github.com/FieldVal/fieldval-rules-js) documentation covers FVRule usage.

#Examples
[mino-cms-example](https://github.com/bestan/mino-cms-example)
