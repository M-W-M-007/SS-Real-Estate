public without sharing class MapPropertyController {
    public Property__c property {get;set;}
    public List<Id> files {get;set;}
    
    public MapPropertyController(){
        getProperties();
    }
    
    public MapPropertyController(ApexPages.StandardController sc){
        Id recId = sc.getId();
        property = [SELECT Id, name, Address__Latitude__s, Address__Longitude__s, /*cost__c, area__c,*/ description__c, Type__c from Property__c where id = :recId];
        files = getFiles(recId);
    }
    
    @AuraEnabled
    public static Property__c getProperty(string recId){
        return [select id, name,Address__Latitude__s, Address__Longitude__s, description__c, address__c from property__c where id = :recId limit 1];
    }
    
    
    @AuraEnabled (cacheable = true)
    public static List<PropertyModel> getProperties(){
        List<PropertyModel> allProperties = new List<PropertyModel>();
        Map<Id, Property__c> properties = new Map<Id,Property__c> ([select id,/*area__c, cost__c,*/ name, description__c, address__c, Address__Latitude__s, Address__Longitude__s from property__c where Address__Latitude__s != null AND Status__c = 'Active']);
        
        Map<Id, Id> fileRecordMap = new Map<Id, Id>();
        for(ContentDocumentLink docLink : [SELECT ContentDocumentId, LinkedEntityId  FROM ContentDocumentLink where LinkedEntityId in ( SELECT Id FROM Property__c where id in :properties.keySet() ) and LinkedEntity.Type='Property__c']){
            fileRecordMap.put(docLink.LinkedEntityId, docLink.ContentDocumentId);
        }
        
        Map<Id, Id> fileCVMap = new Map<Id, Id>();
        
        for(ContentVersion cv : [SELECT Id, ContentDocumentId FROM ContentVersion WHERE ContentDocumentId IN :fileRecordMap.values()] ){
            fileCVMap.put(cv.ContentDocumentId, cv.ContentDocumentId);
        }
        
        if(fileRecordMap.size() > 0){
            for(Id recId: fileRecordMap.keySet()){
                allProperties.add(new PropertyModel(properties.get(recId), fileCVMap.get(fileRecordMap.get(recId))));
            } 
        }
        System.debug('Id recId : properties.KeySet()' +properties.KeySet().Size());
        for(Id recId : properties.KeySet()){
            if(!fileRecordMap.keySet().contains(recId)){
                System.debug('Record Id'+recId);
                allProperties.add(new PropertyModel(properties.get(recId)));
            }
        }
        System.debug('allProperties'+allProperties.size());
        return allProperties;
    }
    
    @AuraEnabled
    public static List<Id> getFiles(String recId){
        List<PropertyModel> allProperties = new List<PropertyModel>();
        
        set<id> docLinkIds = new Set<Id>();
        for(ContentDocumentLink docLink : [SELECT ContentDocumentId, LinkedEntityId  FROM ContentDocumentLink where LinkedEntityId in ( SELECT Id FROM Property__c where id = :recId ) and LinkedEntity.Type='Property__c']){
            docLinkIds.add(docLink.ContentDocumentId);
        }
        
        List<Id> fileIds = new List<Id>();
        for(ContentVersion cv : [SELECT Id, ContentDocumentId,FileType FROM ContentVersion WHERE ContentDocumentId IN :docLinkIds] ){
            fileIds.add(cv.ContentDocumentId);
        }
        return fileIds;
    }
    
    public class PropertyModel{
        
        @AuraEnabled
        public Property__c property {get;set;}
        
        @AuraEnabled
        public string fileId {get;set;}
        
        public PropertyModel(Property__c property, string fileId){
            this.property = property;
            this.fileId = fileId;
        }
        public PropertyModel(Property__c property){
            this.property = property;
            this.fileId = fileId;
        }
    }
}