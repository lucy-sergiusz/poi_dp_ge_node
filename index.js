var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;


var BACKEND_ADDRESS_POI, languages;

module.exports = {
    setConfig: function(backendAddress, lng) {
        BACKEND_ADDRESS_POI = backendAddress;
        languages = lng;
    },

    radialSearch: function(latitude, longitude, radius, callback) {
        var query_url = BACKEND_ADDRESS_POI + "radial_search?" + "lat=" + latitude +
            "&lon=" + longitude + "&radius=" + radius;

        var poi_xhr = new XMLHttpRequest();
        poi_xhr.onreadystatechange = function () {
          if(poi_xhr.readyState === 4) {
            if(poi_xhr.status  === 200) { 
              var resp_data = JSON.parse(poi_xhr.responseText);
              callback(resp_data); //for example of data processing, see process_response function
            }
            else { 
              console.log("failed: " + poi_xhr.responseText);
            }
          }
        }

        poi_xhr.onerror = function (e) {
          log("failed to get POIs");
        };

        poi_xhr.open("GET", query_url, true);
        set_accept_languages(poi_xhr, languages);
        poi_xhr.send();
    },
    getPois: function(uuids, callback) {
        var query_url = BACKEND_ADDRESS_POI + "get_pois?poi_id=" + join_strings(uuids, ",");
        var poi_xhr = new XMLHttpRequest();
        poi_xhr.onreadystatechange = function () {
          if(poi_xhr.readyState === 4) {
            
            if(poi_xhr.status  === 200) { 
              var resp_data = JSON.parse(poi_xhr.responseText);
              callback(resp_data);
            }
            else { 
              console.log("failed: " + poi_xhr.responseText);
            }
          }
        }

        poi_xhr.onerror = function (e) {
          log("failed to get POIs");
        };

        poi_xhr.open("GET", query_url, true);
        set_accept_languages(poi_xhr, languages);
        poi_xhr.send();
    },
    
    getPoiForUpdate: function(uuid, callback) {
        var query_url = BACKEND_ADDRESS_POI + "get_pois?poi_id=" + uuid + '&get_for_update=true';
        var poi_xhr = new XMLHttpRequest();
        poi_xhr.onreadystatechange = function () {
          if(poi_xhr.readyState === 4) {
            
            if(poi_xhr.status  === 200) { 
              var resp_data = JSON.parse(poi_xhr.responseText);
              callback(resp_data['pois'][uuid]);
            }
            else { 
              console.log("failed: " + poi_xhr.responseText);
            }
          }
        }

        poi_xhr.onerror = function (e) {
          log("failed to get POIs");
        };

        poi_xhr.open("GET", query_url, true);
        set_accept_languages(poi_xhr, languages);
        poi_xhr.send();
    },
    
    getPoisForUpdate: function(uuids, callback) {
        var query_url = BACKEND_ADDRESS_POI + "get_pois?poi_id=" + join_strings(uuids, ",") + '&get_for_update=true';
        var poi_xhr = new XMLHttpRequest();
        poi_xhr.onreadystatechange = function () {
          if(poi_xhr.readyState === 4) {
            
            if(poi_xhr.status  === 200) { 
              var resp_data = JSON.parse(poi_xhr.responseText);
              callback(resp_data);
            }
            else { 
              console.log("failed: " + poi_xhr.responseText);
            }
          }
        }

        poi_xhr.onerror = function (e) {
          log("failed to get POIs");
        };

        poi_xhr.open("GET", query_url, true);
        set_accept_languages(poi_xhr, languages);
        poi_xhr.send();
    },
    
    addPoi: function(poi_data) {
        var restQueryURL;

        restQueryURL = BACKEND_ADDRESS_POI + "add_poi";
        var miwi_poi_xhr = new XMLHttpRequest();

        //that does not in the Node.js version of XMLHttpRequest
        //miwi_poi_xhr.overrideMimeType("application/json");
        
        miwi_poi_xhr.onreadystatechange = function () {
            if(miwi_poi_xhr.readyState === 4) {
                if(miwi_poi_xhr.status  === 200) {
                  // React to successfull creation
                  console.log( "success: " + miwi_poi_xhr.responseText);
                }
                else {
                  // React to failure
                  console.log("failed: " + miwi_poi_xhr.readyState + " " + miwi_poi_xhr.responseText);
                }
            }
        }
        miwi_poi_xhr.onerror = function (e) {
            // React to error
            console.log("error" + JSON.stringify(e));
        };
        miwi_poi_xhr.open("POST", restQueryURL, true);
        miwi_poi_xhr.send(JSON.stringify(poi_data));
    },
    
    updatePoi: function(uuid, poi_data) {
        /*
          poi_data is the updated version of POI data like:
            {
              "fw_core": {...},
              "fw_times": {...}
            }
          uuid is the id of the POI
        */
            var restQueryURL;
            var updating_data = {};
        /* build updating structure like
            { 
              "30ddf703-59f5-4448-8918-0f625a7e1122": {
                "fw_core": {...},
                ...
              }
            }
        */
          updating_data[uuid] = poi_data;

          restQueryURL = BACKEND_ADDRESS_POI + "update_poi";
          var query_handle = new XMLHttpRequest();

          //query_handle.overrideMimeType("application/json");

          query_handle.onreadystatechange = function () {
              if(query_handle.readyState === 4) {
                  if(query_handle.status  === 200) { 
                    // Here we may notify the user of successfull update
                    // alert( "success: " +query_handle.responseText);
                  }
              }
          }
          query_handle.onerror = function (e) {
              // Something bad happened
              alert("error" + JSON.stringify(e));
          };
          // define the operation and URL
          query_handle.open("POST", restQueryURL, true);
          // send the data
          query_handle.send(JSON.stringify(updating_data));
    },
    
    deletePoi: function(uuid) {
        var restQueryURL;

        // build the URL for delete
        restQueryURL = BACKEND_ADDRESS_POI + "delete_poi?poi_id=" + uuid;

        var miwi_3d_xhr = new XMLHttpRequest();
        // populate the request with event handlers
        miwi_3d_xhr.onreadystatechange = function () {
            if(miwi_3d_xhr.readyState === 4) {
                if(miwi_3d_xhr.status  === 200) { 
                    // Notify user about success (if wanted)
                    console.log("Successfully deleted POI: " + miwi_3d_xhr.responseText);
                }
            }
        }

        miwi_3d_xhr.onerror = function (e) {
            console.log("failed to delete POI " + JSON.stringify(e));
        };

        // Note: It seems to help DELETE if the client page is in the
        //       same server as the backend
        miwi_3d_xhr.open("DELETE", restQueryURL, true);
        miwi_3d_xhr.send();
    }
};

//UTILITY FUNCTIONS
function set_accept_languages(http_request, languages) {
  /*
    This function creates an Accept-Languages header to the HTTP request.
    This must be called between http_request.open() and 
    http_request.send() .

    http_request - an instance of XMLHttpRequest
    languages    - string array containing the codes of the languages 
                   accepted in the response in descending priority. 
                   The ISO 639-1 language codes are used. If any language 
                   texts are accepted in case of none of the listed 
                   languages are found, an asterisk is used as the last 
                   code.
                   Example: ["en","fi","de","es","*"]
  */
  var i, q;

  q = 9;
  for (i = 0; i < languages.length; i++) {
    if (i == 0) {
      http_request.setRequestHeader('Accept-Language', languages[0]);
    } else {
      if (languages[i] != "") {
        http_request.setRequestHeader('Accept-Language', languages[i] +
            ';q=0.' + q);
        if (q > 1) {
          q--;
        }
      }
    }
  }
}

function join_strings(strings_in, separator) { //: string
  /*
    strings_in string array
    separator string to be inserted between strings_in

    *result string - strings of strings_in separated by separator

    Example: join_strings(["ab", "cd", "ef"], ",") -> "ab,cd,ef"
  */
  var result, i;

  result = strings_in[0] || "";
  for (i = 1; i < strings_in.length; i++) {
    result = result + separator + strings_in[i];
  }

  return result;
}

/**********HANDLING RECEIVED POI DATA******************/
/*example data:
{
  "pois": {
    "6be4752b-fe6f-4c3a-98c1-13e5ccf01721": {
      "fw_core": {
        "category": "cafe",
        "location": {&lt;location of Aulakahvila&gt;}, 
        "name": {
          "": "Aulakahvila"
        },
        &lt;more core data on Aulakahvila&gt;
      },
      &lt;more data components on Aulakahvila&gt;
    }, 
    "ae01d34a-d0c1-4134-9107-71814b4805af": {&lt;data on restaurant Julinia&gt;},
    "1c022820-62dc-487b-95b4-6c344d6ba85e": {&lt;data on library Tiedekirjasto Pegasus&gt;},
    &lt;more data on more POIs&gt;
  }
}
*/

function process_response( data ) {

    var counter = 0, jsonData, poiData, pos, i, uuid, pois,
        contents, locations, location, searchPoint, poiCore,
        poiXxx;

    if (!(data && data.pois)) {
        return;
    }

    pois = data['pois'];

    /* process pois */

    for ( uuid in pois ) {
        poiData = pois[uuid];
        /*
           process the components of the POI
           e.g. fw_core component containing category, name,
           location etc.
           Taking local copies of the data can speed up later 
           processing.
        */
        poiCore = poiData.fw_core;
        if (poiCore) {
          /* fw_core data is used here */

        }
        /* Possible other components */
        poiXxx = poiData.xxx;
        if (poiXxx) {
           /* xxx data is used here */

        }
    }
}

