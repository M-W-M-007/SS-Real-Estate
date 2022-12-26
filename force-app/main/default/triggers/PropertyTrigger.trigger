trigger PropertyTrigger on Property__c (after insert, after update) {
    
    If(Trigger.IsAfter){
        for(Property__c propRec : Trigger.new){
            if(Trigger.IsInsert){
                   PropertyTriggerHelper.setGeoCodeOnProperty(propRec.Id);
               }else if(Trigger.IsUpdate &&
                        (propRec.Address__Street__s != trigger.oldmap.get(propRec.Id).Address__Street__s ||
                         propRec.Address__StateCode__s != trigger.oldmap.get(propRec.Id).Address__StateCode__s ||
                         propRec.Address__City__s != trigger.oldmap.get(propRec.Id).Address__City__s ||
                         propRec.Address__PostalCode__s != trigger.oldmap.get(propRec.Id).Address__PostalCode__s ||
                         propRec.Address__CountryCode__s != trigger.oldmap.get(propRec.Id).Address__CountryCode__s)){
                            PropertyTriggerHelper.setGeoCodeOnProperty(propRec.Id);
                        }
            
        }
    }
    
}