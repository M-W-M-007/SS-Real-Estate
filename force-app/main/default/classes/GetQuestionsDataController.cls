public without sharing class GetQuestionsDataController {

    @AuraEnabled
    public static List<questionDataWrapper> getQuestionData(){
        List<questionDataWrapper> wrapperList = new List<questionDataWrapper>();
        Set<String> options = new Set<string>{'Option_1__c','Option_2__c','Option_3__c','Option_4__c','Option_5__c','Option_6__c','Option_7__c','Option_8__c'};
        List<Question__c> questionDataList = [Select Id, Name, Option_1__c, Option_2__c, Option_3__c, Option_4__c,
                Option_5__c, Option_6__c, Option_7__c, Option_8__c, Order_Number__c, Type__c,Help_Message__c,
                Parent_Question__c, Dependet__c FROM Question__c ORDER BY Order_Number__c ASC];
        
        for(Question__c question : questionDataList){
            questionDataWrapper wrapperObj = new questionDataWrapper();
            wrapperObj.Id = question.Id;
            wrapperObj.Name = question.Name;
           	wrapperObj.orderNumber = question.Order_Number__c;
            wrapperObj.ParentQuestion = question.Parent_Question__c;
            wrapperObj.Dependent = question.Dependet__c;
            wrapperObj.isShowText = false;
            wrapperObj.helpMessage = question.Help_Message__c;
            wrapperObj.isHelp = String.isNotBlank(question.Help_Message__c) ? true : false;
            wrapperObj.isInputshow = question.Type__c == 'Input' ? true:false;
			wrapperObj.options = new List<String>();            
            for(String str : options){
                if(question.get(str) != null){
                    wrapperObj.options.add((String)question.get(str));
                }
            }
            wrapperList.add(wrapperObj);
        }
        return wrapperList;
        
    }

    @AuraEnabled
    public static void createEnquiryAndAnswersRecord(String customerInfo, String answersData){
        Enquiry__c enquiryObj = (Enquiry__c) JSON.deserialize(customerInfo, Enquiry__c.class);
        insert enquiryObj;
        Map<String,String> answersMap = (Map<String,String>) JSON.deserialize(answersData, Map<String,String>.class);
        List<Customer_Response__c> responseList = new List<Customer_Response__c>();
        for(String str : answersMap.keySet()){
            Customer_Response__c response = new Customer_Response__c();
            response.Question__c = str;
            response.Customer_Answer__c = answersMap.get(str);
            response.Customer_Name__c = enquiryObj.Id;
            responseList.add(response);
        }
        if(responseList.size() > 0){
            INSERT responseList;
        }
    }
    
    public class questionDataWrapper{
        @AuraEnabled public String Id{get;set;}
        @AuraEnabled public String Name{get;set;}
        @AuraEnabled public List<String> options{get;set;}
        @AuraEnabled public Decimal orderNumber{get;set;}
        @AuraEnabled public String ParentQuestion{get;set;}
        @AuraEnabled public String Dependent{get;set;}
        @AuraEnabled public String helpMessage{get;set;}
        @AuraEnabled public Boolean isHelp{get;set;}
        @AuraEnabled public Boolean isShowText{get;set;}
        @AuraEnabled public Boolean isInputshow{get;set;}
    }
}