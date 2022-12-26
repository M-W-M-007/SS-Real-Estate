import { LightningElement , track } from 'lwc';
export default class CustomChatStart extends LightningElement {

    @track isChatStart = false;
    @track isShowStart = true;
    @track isShowCloase = false;
    @track isShowChatBoat = false;

    handleStart(){
        this.isChatStart = true;
        this.isShowStart = false;
        this.isShowCloase = true;
        console.log('OUTPUT : ',this.template.querySelector('.chatBox'));
        this.template.querySelector('.chatBox').classList.remove('slds-hide');
        this.isShowChatBoat = true;
    }
    handleCloseChat(){
        this.isShowCloase = false;
        this.isChatStart = false;
        this.isShowStart = true;
    }
    closeChatBox(){
        this.isShowCloase = false;
        this.isChatStart = false;
        this.isShowStart = true;
        this.template.querySelector('.chatBox').classList.add('slds-hide');
    }
    handleFinishChat(){
        this.isShowStart = true;
        this.template.querySelector('.chatBox').classList.add('slds-hide');
        this.isShowChatBoat = false;
    }
}