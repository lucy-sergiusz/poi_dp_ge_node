A Node.js module for interacting with the FIWARE POI Data Provider Generic Enabler:
http://catalogue.fiware.org/enablers/poi-data-provider
https://github.com/Chiru/FIWARE-POIDataProvider

This is an early version of the module, based on the programmer guide provided by the authors of the GE:
http://fiware-poidataprovider.readthedocs.org/en/master/POI_Data_Provider__User_and_Programmers_Guide/



USAGE



const poiDpGe = require('poi-dp-ge-api');

//config - required before performing other operations
poiDpGe.setConfig('http://example.com/poi_dp/', ["en","de","*"]);


//Retrieving the list of POIs 5m from the 1,1 coordinates

poiDpGe.radialSearch(1, 1, 5, function(data) {
        console.log(JSON.stringify(data));
    }
);

// Retrieving POIs by UUIDs
poiDpGe.getPois(['58805c7f-c917-41ee-bb97-b1e9999cfdd6'], function(data) {
        console.log('get pois: ' + JSON.stringify(data));
    }
);

/*Adding a POI - these are the required fields, but there is more, you can also define your own:
https://forge.fiware.org/plugins/mediawiki/wiki/fiware/index.php/POI_Data_Provider_Open_API_Specification#POI_Data_Model_Definitions
*/

var newPoiData = {
  "fw_core": {
	"category": "park",
	"name": {
	  "": "English Garden",
	  "de": "Englischer Garten"
	},
	"location": {
	  "wgs84": { 
		"latitude": 15.059334, 
		"longitude": 15.4664775
	  }
	}
  }
}

poiDpGe.addPoi(newPoiData);


//Editing a POI
poiDpGe.getPoiForUpdate(['58805c7f-c917-41ee-bb97-b1e9999cfdd6'], function(data) {
    data["fw_core"]["name"]["de"] = "Der Englischer Garten";
    poiDpGe.updatePoi(['58805c7f-c917-41ee-bb97-b1e9999cfdd6'], data);
});


//Deleting a POI
poiDpGe.deletePoi('38972181-e603-4bfc-b385-24c2da0aeccb');
