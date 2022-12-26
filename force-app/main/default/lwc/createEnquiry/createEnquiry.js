import { LightningElement, api, track } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { NavigationMixin } from 'lightning/navigation';
import sendWhatsAppRequest from '@salesforce/apex/SendWhatsAppAndSmsController.sendWhatsAppRequest';

export default class CreateEnquiry extends NavigationMixin(LightningElement) {

    @api recordId;
    @api propertyName;
    @track isApplyForEnquiry = false;
    @track selectedPropertyId;
    @track selectedPropertyName;
    @track firstName = '';
    @track lastName = '';
    @track fullName = '';
    @track mobile = '';
    @track showFinalSave = false;
    @track showInitialSave = true;
    @track isModalClose = true;
    @track isOtpClose = false;
    @track rendomOTPNumber;
    @track enteredEmail = '';
    @track enteredOTPNumber = '';
    @track header = 'Create Enquiry';
    @track otpObj = {
        one: null,
        two: null,
        three: null,
        four: null
    };

    connectedCallback() {
        console.log('Current URL => ', window.location.href.split('/')[window.location.href.split('/').length - 1]);
        setTimeout(() => {
            console.log('My Record Id : ', this.recordId);
            this.selectedPropertyId = this.recordId;
            this.selectedPropertyName = this.propertyName;
            this.isApplyForEnquiry = true;
        }, 100);
    }

    handleOtpInput(event) {
        console.log('In Change');
        this.otpObj[event.target.name] = event.target.value;
        if (event.target.value.length != 0) {
            if (event.target.name == 'one') {
                console.log(this.template.querySelector('.two').focus());
                this.template.querySelector('.two').focus();
            } else if (event.target.name == 'two') {
                this.template.querySelector('.three').focus();
            } else if (event.target.name == 'three') {
                this.template.querySelector('.four').focus();
            } else if (event.target.name == 'four') {
                this.otpObj.four = event.target.value;
            }
        }

    }

    handleLeadCreated() {
        sendWhatsAppRequest({ templateName: 'enquiry_confirmation' , param1 :  this.firstName+''+this.lastName , param2 : this.selectedPropertyName , toNumber : '91'+this.mobile})
          .then(result => {
            console.log('Whats', result);
          })
          .catch(error => {
            console.error('Error:', error);
        });
        this.dispatchEvent(new CustomEvent('hideloader'));
        this.showNotification('Success', 'Enquiry Successfully Submitted.', 'success');
        this.isApplyForEnquiry = false;
        this.dispatchEvent(new CustomEvent('close'));
        if (window.location.href.split('/')[window.location.href.split('/').length - 1] == 'contactus') {
            this[NavigationMixin.Navigate]({
                type: 'comm__namedPage',
                attributes: {
                    name: 'Home'
                }
            });
        }
        
    }

    handleSubmit(event) {
        this.enteredOTPNumber = this.otpObj.one+this.otpObj.two+this.otpObj.three+this.otpObj.four;
        console.log(this.enteredOTPNumber);
        if (this.enteredOTPNumber != this.rendomOTPNumber) {
            this.showNotification('Error', 'Please Enter Valid OTP.', 'error');
            event.preventDefault();
            return;
        }
        this.dispatchEvent(new CustomEvent('showloader'));

    }
    handleInitialSubmit() {
        [...this.template.querySelectorAll('.requiredInput')].forEach(element => {
            console.log('element==>', element);
            element.reportValidity();
        })
        let numberRegex = /^[0-9-+() ]*$/;
        if (this.template.querySelector('.slds-has-error')) {
            this.showNotification('Error', 'Please Review All Fields.', 'error');
            event.preventDefault();
            return;
        }
        let allLayouts = this.template.querySelectorAll('.layoutItem');
        console.log('allLayouts==>', allLayouts);
        allLayouts.forEach(currentItem => {
            currentItem.classList.add('slds-hide');
        });
        this.showFinalSave = true;
        this.showInitialSave = false;
        this.isModalClose = false;
        this.isOtpClose = true;
        let optInput = this.template.querySelector('.otpInput').classList.remove('slds-hide');
        this.rendomOTPNumber = (Math.floor(Math.random() * 10000) + 10000).toString().substring(1);
        this.header = 'Enter OTP';
    }
    handleOTPChange(event) {
        this.enteredOTPNumber = event.target.value;
    }
    handleInputChange(event) {
        let currentField = event.currentTarget.dataset.id;
        let inputField = this.template.querySelector(`[data-id="${currentField}"]`);
        let numbers = /^[a-zA-Z ]*$/;
        if (!event.target.value.match(numbers)) {
            inputField.setCustomValidity('Enter Valid Name.');
        } else {
            inputField.setCustomValidity('');
        }
        inputField.reportValidity();
        if (!this.template.querySelector('.slds-has-error')) {
            if (event.target.name == 'firstName') {
                this.firstName = event.target.value;
            } if (event.target.name == 'lastName') {
                this.lastName = event.target.value;
            }
            this.fullName = this.firstName + ' ' + this.lastName;
        }
    }
    handleEmailChange(event) {
        this.enteredEmail = event.target.value;
    }
    hanldeMobileChange(event) {
        let currentField = event.currentTarget.dataset.id;
        let inputField = this.template.querySelector(`[data-id="${currentField}"]`);
        let numbers = /^[0-9-+() ]*$/;
        if (!event.target.value.match(numbers)) {
            inputField.setCustomValidity('Enter Valid Phone Number.');
        } else {
            inputField.setCustomValidity('');
        }
        inputField.reportValidity();
        if (!this.template.querySelector('.slds-has-error')) {
            if (event.target.name == 'mobile') {
                this.mobile = event.target.value;
            }
        }
    }

    showNotification(title, message, variant) {
        const evt = new ShowToastEvent({
            title: title,
            message: message,
            variant: variant,
        });
        this.dispatchEvent(evt);
    }
    closeModel() {
        this.dispatchEvent(new CustomEvent('closemodel'));
        if (window.location.href.split('/')[window.location.href.split('/').length - 1] == 'contactus') {
            this[NavigationMixin.Navigate]({
                type: 'comm__namedPage',
                attributes: {
                    name: 'Home'
                }
            });
        }
    }
    closeOtpModal() {
        this.header = 'Create Enquiry';
        let allLayouts = this.template.querySelectorAll('.layoutItem');
        console.log('allLayouts==>', allLayouts);
        allLayouts.forEach(currentItem => {
            currentItem.classList.remove('slds-hide');
        });
        this.showFinalSave = false;
        this.showInitialSave = true;
        this.isModalClose = true;
        this.isOtpClose = false;
        let optInput = this.template.querySelector('.otpInput').classList.add('slds-hide');
    }
}