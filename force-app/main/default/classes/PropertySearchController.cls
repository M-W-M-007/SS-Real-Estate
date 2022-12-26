public without sharing class PropertySearchController {
    

    @AuraEnabled
    public static List<propertySearchWrapper> getDefaultProperties(){
        List<propertySearchWrapper> wrapperList = new List<propertySearchWrapper>();
        Map<Id,propertySearchWrapper> propertyDataMap = new Map<Id,propertySearchWrapper>();
        Map<Id,Id> contentDocumentMap = new Map<Id,Id>();
        List<Property__c> propertyList =  [Select Id,Name, Category__c,Size_in_acer__c,Size_in_Sq_Foot__c,Size_in_Sq_Yards__c,Size_in_Sq_m__c, recordType.Name,Title__c, Expected_Price__c, Address__c, Description__c, Amount__c,Property_Id__c From Property__c WHERE Status__c = 'Active' LIMIT 20];
        for(Property__c propertyData : propertyList){
            propertySearchWrapper wrapperObj = new propertySearchWrapper();
            wrapperObj.Name = propertyData.Name;
            wrapperObj.Locality = propertyData.Address__c;
            wrapperObj.Description = propertyData.Description__c;
            wrapperObj.coast = propertyData.Amount__c;
            wrapperObj.recordType = propertyData.recordType.Name;
            wrapperObj.title = propertyData.Title__c;
            wrapperObj.propertySizeInYards = propertyData.recordType.Name == 'Plot / Land' || propertyData.recordType.Name == 'House / Villa' ? propertyData.Size_in_Sq_Yards__c : null;
            wrapperObj.propertySizeInFt = propertyData.recordType.Name == 'Flat / Apartment' || propertyData.recordType.Name == 'Commercial Space / Shop' ? propertyData.Size_in_Sq_Foot__c : null;
            wrapperObj.Id = propertyData.Id;
            wrapperObj.propertyId = propertyData.Property_Id__c;
            propertyDataMap.put(propertyData.Id,wrapperObj);
        }
        if(propertyDataMap.size() > 0){
            List<ContentDocumentLink> files = [SELECT ContentDocumentId, LinkedEntityId FROM ContentDocumentLink WHERE LinkedEntityId IN :propertyDataMap.KeySet()];
            for (ContentDocumentLink docLink : files) {
                contentDocumentMap.put(docLink.ContentDocumentId,docLink.LinkedEntityId);
            }            
            List<ContentVersion> docs = [SELECT ContentDocumentId, FileExtension, Title 
                                         FROM ContentVersion WHERE ContentDocumentId IN : contentDocumentMap.KeySet() AND isLatest = True];
            for (ContentVersion docLink : docs) {
                if(contentDocumentMap.containsKey(docLink.ContentDocumentId)){
                    propertyDataMap.get(contentDocumentMap.get(docLink.ContentDocumentId)).imageURL = '/sfc/servlet.shepherd/document/download/' + docLink.ContentDocumentId; 
                }
            }
        }
        if(propertyDataMap.size() > 0){
            for(Property__c propertyData : propertyList){
                if(propertyDataMap.containsKey(propertyData.Id)){
                    wrapperList.add(propertyDataMap.get(propertyData.Id));
                }
            }
        }
        return wrapperList;
    }

    @AuraEnabled
    public static List<propertySearchWrapper> getPropertyData(String propertyTilte , List<String> selectedType , String priceFrom, String priceTo, String locality , String city, String lookingFor){
        System.debug('My Data'+propertyTilte +''+selectedType+''+lookingFor+''+lookingFor);
        List<propertySearchWrapper> wrapperList = new List<propertySearchWrapper>();
        Map<Id,propertySearchWrapper> propertyDataMap = new Map<Id,propertySearchWrapper>();
        Map<Id,Id> contentDocumentMap = new Map<Id,Id>();
        String status = 'Active';
        String propertyStringQuery = 'Select Id,Name, Category__c,Size_in_acer__c,Size_in_Sq_Foot__c,Size_in_Sq_Yards__c,Size_in_Sq_m__c, recordType.Name,Title__c, Expected_Price__c, Address__c, Description__c, Amount__c,Project_Name__c,Property_Id__c From Property__c WHERE Status__c =: status ';
        Decimal priceFromValue = String.isNotBlank(priceFrom) ? decimal.valueOf(priceFrom) : 0;
        Decimal priceToValue = String.isNotBlank(priceTo) ? decimal.valueOf(priceTo) : 0;
        
        propertyStringQuery += String.isNotBlank(city) ? 'AND City__c =: city ' : '';
        propertyStringQuery += String.isNotBlank(lookingFor) ? 'AND Looking_For__c =: lookingFor ' : '';
        propertyStringQuery += String.isNotBlank(propertyTilte) ? 'AND Title__c =: propertyTilte ' : '';
        propertyStringQuery += selectedType.size() > 0 && !Test.isRunningTest()? ' AND Property_Type__c IN:selectedType ' : '' ;
        propertyStringQuery += String.isNotBlank(priceFrom) ? 'AND Amount_Calculation__c >= :priceFromValue ' : '';
        propertyStringQuery += String.isNotBlank(priceTo)  ? 'AND Amount_Calculation__c <= :priceToValue ' : '';
        propertyStringQuery += String.isNotBlank(locality) ? 'AND (Address__Street__s LIKE \''+locality +'%\' OR Primary_Location__c LIKE \''+locality +'%\' OR Sub_Location__c LIKE \''+locality +'%\') ' : '';

        List<Property__c> propertyList = Database.query(propertyStringQuery); 
        for(Property__c propertyData : propertyList){
            propertySearchWrapper wrapperObj = new propertySearchWrapper();
            wrapperObj.Name = propertyData.Name;
            wrapperObj.Locality = propertyData.Address__c;
            wrapperObj.Description = propertyData.Description__c;
            wrapperObj.coast = propertyData.Amount__c;
            wrapperObj.recordType = propertyData.recordType.Name;
            wrapperObj.title = propertyData.Title__c;
            wrapperObj.Id = propertyData.Id;
            wrapperObj.propertyId = propertyData.Property_Id__c;
            wrapperObj.propertySizeInYards = propertyData.recordType.Name == 'Plot / Land' || propertyData.recordType.Name == 'House / Villa' ? propertyData.Size_in_Sq_Yards__c : null;
            wrapperObj.propertySizeInFt = propertyData.recordType.Name == 'Flat / Apartment' || propertyData.recordType.Name == 'Commercial Space / Shop' ? propertyData.Size_in_Sq_Foot__c : null;
            propertyDataMap.put(propertyData.Id,wrapperObj);
        }
        if(propertyDataMap.size() > 0){
            List<ContentDocumentLink> files = [SELECT ContentDocumentId, LinkedEntityId FROM ContentDocumentLink WHERE LinkedEntityId IN :propertyDataMap.KeySet()];
            for (ContentDocumentLink docLink : files) {
                contentDocumentMap.put(docLink.ContentDocumentId,docLink.LinkedEntityId);
            }            
            List<ContentVersion> docs = [SELECT ContentDocumentId, FileExtension, Title 
                                         FROM ContentVersion WHERE ContentDocumentId IN : contentDocumentMap.KeySet() AND isLatest = True];
            for (ContentVersion docLink : docs) {
                if(contentDocumentMap.containsKey(docLink.ContentDocumentId)){
                    propertyDataMap.get(contentDocumentMap.get(docLink.ContentDocumentId)).imageURL = '/sfc/servlet.shepherd/document/download/' + docLink.ContentDocumentId; 
                }
            }
        }
        if(propertyDataMap.size() > 0){
            for(Property__c propertyData : propertyList){
                if(propertyDataMap.containsKey(propertyData.Id)){
                    wrapperList.add(propertyDataMap.get(propertyData.Id));
                }
            }
        }
        return wrapperList;
    }
    
    @AuraEnabled
    public static List<String> getRecordTypeNames(){
        List<String> allRecordTypeName = new List<String>();
        Schema.DescribeSObjectResult R = Property__c.SObjectType.getDescribe();
        List<Schema.RecordTypeInfo> RT = R.getRecordTypeInfos();
        for(Schema.RecordTypeInfo recordType : RT){
            if(recordType.getName() != 'Master' && recordType.getName() != 'Buy' && recordType.getName() != 'Flat' && recordType.getName() != 'Houses' && recordType.getName() != 'Rent'){
               allRecordTypeName.add(recordType.getName()); 
            }
        }
       return allRecordTypeName;
    }

    @AuraEnabled
    public static List<String> getTitlePickListValue(String fieldName){
        List<String> pickListValuesList= new List<String>();
        Map<String, Schema.SObjectField> M = Schema.SObjectType.Property__c.fields.getMap();
        Schema.DescribeFieldResult obj= M.get(fieldName).getDescribe();
        List<Schema.PicklistEntry> ple = obj.getPicklistValues();
        for( Schema.PicklistEntry pickListVal : ple){
            pickListValuesList.add(pickListVal.getLabel());
        }     
        return pickListValuesList;
     }
    
    public class propertySearchWrapper{
        @AuraEnabled public String Id{get;set;}
        @AuraEnabled public String Name{get;set;}
        @AuraEnabled public Address Locality{get;set;}
        @AuraEnabled public String imageURL{get;set;}
        @AuraEnabled public String Description{get;set;}
        @AuraEnabled public String coast{get;set;}
        @AuraEnabled public String recordType{get;set;}
        @AuraEnabled public Decimal propertySizeInAcer{get;set;}
        @AuraEnabled public Decimal propertySizeInFt{get;set;}
        @AuraEnabled public Decimal propertySizeInYards{get;set;}
        @AuraEnabled public Decimal propertySizeInMeter{get;set;}
        @AuraEnabled public String title{get;set;}
        @AuraEnabled public String propertyId{get;set;}
    }
}