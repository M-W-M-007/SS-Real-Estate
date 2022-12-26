@isTest
public class GetQuestionsDataControllerTest {
	
    @isTest
    public static void getQuestionDataTest(){
        Question__c quetionData = new Question__c();
        quetionData.Name = 'Test Question';
        quetionData.Option_1__c = 'test 1';
        quetionData.Option_2__c = 'test 2';
        quetionData.Order_Number__c = 1;
		insert quetionData;
        
        GetQuestionsDataController.getQuestionData();
        GetQuestionsDataController.createEnquiryAndAnswersRecord('{"Name" : "test","Email__c":"test@gmail.com"}','{"TestData":"test"}');
    }
}