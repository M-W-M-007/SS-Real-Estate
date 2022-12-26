public class GeoLocationService {
    public static GeoCodeApiResult getLocationByAddress(Address address){
        
        HttpRequest hr = new HttpRequest();
        hr.setEndpoint('https://maps.googleapis.com/maps/api/geocode/json?address=' + EncodingUtil.urlEncode(formatAddress(address), 'UTF-8') + '&key=AIzaSyBZsH0US1O6fSogoqBTUpUkvEWqs-rYMlY');
        hr.setMethod('GET');
        
        Http con = new http();
        HttpResponse res = Test.isRunningTest()? new HttpResponse(): con.send(hr);
        if(Test.isRunningTest()){
            res.setHeader('Content-Type', 'application/json');
            res.setBody('{"status" : "OK","results" : [ {"types" : [ "political", "sublocality", "sublocality_level_1" ],"place_id" : "ChIJi7oKRjDhazkRdFyhJCKrbNc","geometry" : {"viewport" : {        "southwest" : {          "lng" : 74.6496061,          "lat" : 26.41364        },        "northeast" : {          "lng" : 74.69422,          "lat" : 26.453403        }      },      "location_type" : "APPROXIMATE",      "location" : {        "lng" : 74.6722459,        "lat" : 26.4343408      },      "bounds" : {        "southwest" : {          "lng" : 74.6496061,          "lat" : 26.41364        },        "northeast" : {          "lng" : 74.69422,          "lat" : 26.453403        }      }    },    "formatted_address" : "Adarsh Nagar, Ajmer, Rajasthan, India",    "address_components" : [ {      "types" : [ "political", "sublocality", "sublocality_level_1" ],      "short_name" : "Adarsh Nagar",      "long_name" : "Adarsh Nagar"    }, {      "types" : [ "locality", "political" ],      "short_name" : "Ajmer",      "long_name" : "Ajmer"    }, {      "types" : [ "administrative_area_level_2", "political" ],      "short_name" : "Ajmer",      "long_name" : "Ajmer"    }, {      "types" : [ "administrative_area_level_1", "political" ],      "short_name" : "RJ",      "long_name" : "Rajasthan"    }, {"types" : [ "country", "political" ],"short_name" : "IN","long_name" : "India"} ] } ]}');
            res.setStatusCode(200);
        }
        
        String jsonRes = res.getBody(); //'{     "results": [         {             "address_components": [                 {                     "long_name": "Shastri Nagar",                     "short_name": "Shastri Nagar",                     "types": [                         "political",                         "sublocality",                         "sublocality_level_1"                     ]                 },                 {                     "long_name": "Ajmer",                     "short_name": "Ajmer",                     "types": [                         "locality",                         "political"                     ]                 },                 {                     "long_name": "Ajmer",                     "short_name": "Ajmer",                     "types": [                         "administrative_area_level_2",                         "political"                     ]                 },                 {                     "long_name": "Rajasthan",                     "short_name": "RJ",                     "types": [                         "administrative_area_level_1",                         "political"                     ]                 },                 {                     "long_name": "India",                     "short_name": "IN",                     "types": [                         "country",                         "political"                     ]                 },                 {                     "long_name": "305001",                     "short_name": "305001",                     "types": [                         "postal_code"                     ]                 }             ],             "formatted_address": "Shastri Nagar, Ajmer, Rajasthan 305001, India",             "geometry": {                 "bounds": {                     "northeast": {                         "lat": 26.490662,                         "lng": 74.65136009999999                     },                     "southwest": {                         "lat": 26.4787559,                         "lng": 74.64121109999999                     }                 },                 "location": {                     "lat": 26.4854722,                     "lng": 74.64663059999999                 },                 "location_type": "APPROXIMATE",                 "viewport": {                     "northeast": {                         "lat": 26.490662,                         "lng": 74.65136009999999                     },                     "southwest": {                         "lat": 26.4787559,                         "lng": 74.64121109999999                     }                 }             },             "place_id": "ChIJAX3A1VPmazkRc_3-K3CtP1c",             "types": [                 "political",                 "sublocality",                 "sublocality_level_1"             ]         }     ],     "status": "OK" }';
        GeoCodeApiResult result = (GeoCodeApiResult) System.JSON.deserialize(jsonRes, GeoCodeApiResult.class);
        return result;
    }
    
    public static String formatAddress(Address address){
        Set<String> tmp = New Set<String>{
            address.getStreet(), address.getCity(), address.getStateCode(), address.getPostalCode(), address.getCountryCode()
                };
                    tmp.remove(null);
        return string.join(New List<String>(tmp),',');
    }
    
}