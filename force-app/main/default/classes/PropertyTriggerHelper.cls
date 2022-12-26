public class PropertyTriggerHelper {
	
    @future (callout = true)
    public static void setGeoCodeOnProperty(Id propertyRecId){
        Property__c propRecord = [SELECT Id, Name, Address__c 
                                  FROM Property__c 
                                  WHERE Id = :propertyRecId];
        
        GeoCodeApiResult result = GeoLocationService.getLocationByAddress(propRecord.Address__c);
        
        System.debug('Mock Result --> '+JSON.serializePretty(result));
        propRecord.Address__Latitude__s = result.results[0].geometry.location.lat;
        propRecord.Address__Longitude__s = result.results[0].geometry.location.lng;
        
        update propRecord;
        
    }
}