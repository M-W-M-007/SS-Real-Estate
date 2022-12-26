@isTest
public class MapPropertyControllerTest {
    
    @TestSetup
    public static void testSetupData(){
        Property__c propertyData = new Property__c();
        propertyData.Name = 'Test Property';
        propertyData.Amount__c = '10L';
        propertyData.Title__c = 'Commercial';
        propertyData.Address__Street__s = 'Vaishali Nagar';
        propertyData.Address__City__s = 'Ajmer';
        propertyData.Address__PostalCode__s = '305001';
        propertyData.Address__Latitude__s = 26.41364;
        propertyData.Address__Longitude__s = 74.6496061;
        propertyData.Status__c = 'Active';
        Insert propertyData;
        
        Blob blobBody = Blob.valueOf('Testing TestContentVersion');
        ContentVersion contentVersionObj = new ContentVersion(Title = 'Test',
                                                              Description = 'Test Description',
                                                              PathOnClient ='Test.jpg',
                                                              VersionData = blobBody);
        insert contentVersionObj;
        contentVersionObj = [SELECT Id, ContentDocumentId FROM ContentVersion WHERE ID =: contentVersionObj.Id LIMIT 1];
        
        ContentDocumentLink contentlink = new ContentDocumentLink();
        contentlink.LinkedEntityId = propertyData.Id;
        contentlink.ContentDocumentId = contentVersionObj.ContentDocumentId;
        contentlink.ShareType = 'V';
        contentlink.Visibility = 'AllUsers'; 
        insert contentlink ;
    }
    
    @isTest
    public static void getPropertiesTest(){
        Property__c propertyData = [Select Id From Property__c LIMIT 1];
        MapPropertyController propertyController = new MapPropertyController();
        ApexPages.StandardController sc = new ApexPages.StandardController(propertyData);
        propertyController = new MapPropertyController(sc);
        MapPropertyController.getProperty(propertyData.Id);
        
    }
}