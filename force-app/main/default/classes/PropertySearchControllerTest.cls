@isTest
global class PropertySearchControllerTest {

    @testSetup
    public static void setupMethod(){
        Property__c propertyData = new Property__c();
        propertyData.Name = 'Test Property';
        propertyData.Amount__c = '10L';
        propertyData.Title__c = 'Commercial';
        propertyData.Address__Street__s = 'Vaishali Nagar';
        propertyData.Address__City__s = 'Ajmer';
        propertyData.Address__PostalCode__s = '305001';
        propertyData.Status__c = 'Active';
        propertyData.Amount_Calculation__c = 100000;
        Insert propertyData;
    }
    
    @isTest
    public static void getPropertyTest(){
        //Test.setMock(HttpCalloutMock.class, new PropertySearchHttpCalloutMock());
        Property__c propertyData = [Select Id, Name, Amount__c,Title__c From Property__c LIMIT 1];
        PropertySearchController.getDefaultProperties();
        PropertySearchController.getPropertyData(propertyData.Title__c, new List<String>{''}, '100000', '', '','','');
        PropertySearchController.getRecordTypeNames();
        PropertySearchController.getTitlePickListValue('Title__c');
        GeoCodeApiResult g = new GeoCodeApiResult();
    }

}