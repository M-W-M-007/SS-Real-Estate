/* 
    Name   		: SendWhatsAppAndSmsController
    Date   		: 15-November-2022
    Author      : iBirds Software Services Pvt. Ltd.
    Description	: .
*/
public class SendWhatsAppAndSmsController {
    // SMS Text Variables 
    public static String SMS_API_KEY;
    public static String SMS_END_POINT_URL;
    public static String SMS_METHOD;
    
    // WhatsApp Message Variables
    public static String API_KEY;
    public static String END_POINT_URL;
    public static String METHOD;
    public static String API_INSTANCE;
    public static String ACCESS_TOKEN;
    
    /* 
        Method Name : getWhatsAppCustomSetting
        Date   		: 15-November-2022
        Author      : iBirds Software Services Pvt. Ltd.
        Description	: In this method we are getting WhatsAppp custom setting.
	*/
    public static void getWhatsAppCustomSetting(){
        WhatsApp_Settings__c whatsAppSetting = new WhatsApp_Settings__c();
        if(Test.isRunningTest()){
            whatsAppSetting = new WhatsApp_Settings__c(API_Key__c = '',
                                                       End_Point_Url__c = 'https://test.facebook.com/',
                                                       Method__c = 'GET',
                                                       API_Instance__c = '',
                                                       Access_Token__c = '',
                                                       Name = 'TestAPI');
        }else{
            whatsAppSetting = WhatsApp_Settings__c.getValues(System.Label.PROFILE_ID);
        }
        API_KEY				= whatsAppSetting.API_Key__c;
        END_POINT_URL		= whatsAppSetting.End_Point_Url__c;
        METHOD				= whatsAppSetting.Method__c;
        API_INSTANCE		= whatsAppSetting.API_Instance__c;
        ACCESS_TOKEN		= whatsAppSetting.Access_Token__c;
    }
    
    /* 
        Method Name : sendWhatsAppRequest(String messageBody, String toNumber)
        Date   		: 15-November-2022
        Author      : iBirds Software Services Pvt. Ltd.
        Description	: .
	*/
    @AuraEnabled
    public static void sendWhatsAppRequest(String templateName, String param1 , String param2, String toNumber){
        getWhatsAppCustomSetting();
        
        String requestBody = '{"messaging_product": "whatsapp","recipient_type": "individual","to": "'+toNumber+'","type":"template","template": {"name": "'+templateName+'","language": {"code": "en"},"components": [{"type": "body","parameters": [{"type": "text","text": "'+param1+'"},{ "type": "text","text": "'+param2+'"}]}]}}';
        
        String endPoint = END_POINT_URL + API_KEY + '/'+API_INSTANCE;
        system.debug('endPoint ==> '+ endPoint);
        HttpRequest request = new HttpRequest();
        Http http = new Http(); 
        HTTPResponse result = new HTTPResponse();
        request.setEndpoint(endPoint);
        request.setMethod(METHOD);
        request.setHeader('Content-type', 'application/json');
        request.setHeader('Connection', 'Keep-alive');
        request.setHeader('Authorization', 'Bearer '+ACCESS_TOKEN);
        request.setHeader('Accept', '*/*');
        request.setBody(requestBody);
        system.debug('request ==> '+ requestBody);
        
        try{
            if(!Test.isRunningTest()){
                result = http.send(request);
            }
            if(result.getStatusCode() == 200){
                system.debug('WhatsApp SMS Sent Successfully');
            }
        }catch(Exception exp){
            System.debug('Error : '+exp.getMessage());
        }
    }
    
     /* 
        Method Name : getSMSCustomSetting
        Date   		: 15-November-2022
        Author      : iBirds Software Services Pvt. Ltd.
        Description	: In this method we are getting Text Sms custom setting.
	*/
    public static void getSMSCustomSetting(){
        SMS_Settings__c smsSetting = new SMS_Settings__c();
        if(Test.isRunningTest()){
            smsSetting = new SMS_Settings__c();
            smsSetting.Name = 'TestAPI';
            smsSetting.API_Key__c = '';
            smsSetting.End_Point_Url__c = 'http://test.whatsahtt.com/';
            smsSetting.Method__c = 'GET';
        }else{
            smsSetting = SMS_Settings__c.getInstance(System.Label.PROFILE_ID);
        } 
        SMS_API_KEY				= smsSetting.API_Key__c;
        SMS_END_POINT_URL		= smsSetting.End_Point_Url__c;
        SMS_METHOD				= smsSetting.Method__c;
    }
    
    /* 
        Method Name : sendSMSRequest(String messageBody, String toNumber)
        Date   		: 15-November-2022
        Author      : iBirds Software Services Pvt. Ltd.
        Description	: .
	*/
    public static void sendSMSRequest(String messageBody, String toNumber){
        getSMSCustomSetting();
        
        String requestBody = '&mobile=' + toNumber + '&msg=' + messageBody;
        String smsEndPoint = SMS_END_POINT_URL + SMS_API_KEY + requestBody;
        system.debug('END POINT URL ==> '+ smsEndPoint);
        HttpRequest request = new HttpRequest();
        Http http = new Http(); 
        HTTPResponse result = new HTTPResponse();
        request.setEndpoint(smsEndPoint);
        request.setMethod(SMS_METHOD);
        system.debug('http request' + request);
        
        try{
            if(!Test.isRunningTest()){
                //result = http.send(request);
            }
            if(result.getStatusCode() == 200){
                system.debug('SMS Sent Successfully '+result.getStatus());
            }
        }catch(Exception exp){  
            throw new AuraHandledException('Error : '+ exp.getMessage()); 
        }
        
    }
}