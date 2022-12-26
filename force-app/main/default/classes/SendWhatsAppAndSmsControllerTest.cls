@isTest
public class SendWhatsAppAndSmsControllerTest {
    
    @isTest
    public static void sendWhatsAppRequestTest(){
        SendWhatsAppAndSmsController.sendWhatsAppRequest('messageBody', '','','12346789');
        SendWhatsAppAndSmsController.sendSMSRequest('messageBody', '1234567890');
    }
}