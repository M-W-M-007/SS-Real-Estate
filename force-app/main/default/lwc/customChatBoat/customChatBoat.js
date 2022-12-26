import { LightningElement, api, track } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import getQuestionData from '@salesforce/apex/GetQuestionsDataController.getQuestionData';
import createInformationData from '@salesforce/apex/GetQuestionsDataController.createEnquiryAndAnswersRecord';

export default class CustomChatBoat extends LightningElement {

    @track allQuestions = [];
    @track displayQuestions = [];
    @track isShowQuetions = false;
    @track isShowTextArea = false;
    @track rendomOTPNumber;
    @track enteredOTPNumber = '';
    @track customerInfo = {
        Name: null,
        MobilePhone__c: null,
        Email__c: null,
        Enquiry_Source__c: 'ChatBot'
    }

    @track answersMap = new Map();
    @track questionList = [];
    @track otherAnswerValue = '';
    @track inputAnswerValue = '';
    @track otpObj = {
        one: null,
        two: null,
        three: null,
        four: null
    };

    connectedCallback() {
        getQuestionData()
            .then(result => {
                this.allQuestions = result;
                this.allQuestions.forEach(currentItem1 => {
                    let count = 0;
                    let options = currentItem1.options;
                    currentItem1.options = [];
                    options.forEach(currentItem2 => {
                        currentItem1['options'].push({ label: currentItem2, value: ++count });
                    });
                });
                console.log('this.allQuestions : ', this.allQuestions);
                this.displayQuestions.push(JSON.parse(JSON.stringify(this.allQuestions[0])));
            })
            .catch(error => {
                console.error('Error:', error);
            });
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

    hanldeOptionClick(event) {
        let questionIndex = this.questionList.indexOf(event.currentTarget.dataset.question);
        if (this.answersMap.has(event.currentTarget.dataset.question) && questionIndex != -1) {
            let tempAnswersMap = this.answersMap;
            let tempQuestionList = [];
            this.questionList.forEach(function (currentItem, index) {
                if (index > questionIndex && tempAnswersMap.has(currentItem)) {
                    tempAnswersMap.delete(currentItem);
                } else {
                    tempQuestionList.push(currentItem);
                }
            });
            this.answersMap = tempAnswersMap;
            this.questionList = tempQuestionList;
        }
        this.answersMap.set(event.currentTarget.dataset.question, event.currentTarget.dataset.label);
        if (!this.questionList.includes(event.currentTarget.dataset.question)) this.questionList.push(event.currentTarget.dataset.question);
        this.isShowTextArea = false;
        if (event.currentTarget.dataset.order != 1 && event.currentTarget.dataset.label.includes('Other')) {
            this.isShowTextArea = true;
        }
        if (this.displayQuestions.length >= 1) {

            let tempArr = this.displayQuestions;
            let tempIndex = 0;
            tempArr.forEach(element => {
                if (event.target.name == element.ParentQuestion) {
                    this.displayQuestions.splice(tempIndex, this.displayQuestions.length - 1);
                }
                tempIndex++;
            })

            this.allQuestions.forEach(currentItem => {
                if (currentItem.ParentQuestion == event.target.name && currentItem.Dependent.split(';').includes(event.currentTarget.dataset.id)) {
                    this.displayQuestions.push(currentItem);
                }
            });
        }

        this.displayQuestions.forEach(currentItem => {
            if (currentItem.Id == event.target.name) {
                currentItem.isShowText = event.currentTarget.dataset.label.includes('Other');
                if (!currentItem.isShowText) {
                    this.otherAnswerValue = '';
                }
            }
            if (!this.questionList.includes(currentItem.Name) && currentItem.isShowText) {
                currentItem.isShowText = false;
                this.otherAnswerValue = '';
            }
        });
    }

    handleTextAreaChange(event) {
        this.otherAnswerValue = event.target.value;
        this.answersMap.set(event.currentTarget.dataset.question, 'Other:' + this.otherAnswerValue);
        //console.log('@@ ', event.currentTarget, event.target, event.currentTarget.dataset.question);
    }

    handleAnswerInput(event) {
        console.log('Input Start');
        this.inputAnswerValue = event.target.value;
        let tempArr = this.displayQuestions;
        let tempIndex = 0;
        tempArr.forEach(element => {
            if (event.target.name == element.ParentQuestion) {
                this.displayQuestions.splice(tempIndex, this.displayQuestions.length - 1);
            }
            tempIndex++;
        })
        this.allQuestions.forEach(currentItem => {
            if (currentItem.ParentQuestion == event.target.name) {
                this.displayQuestions.push(currentItem);
            }
        });
        this.answersMap.set(event.currentTarget.dataset.question, event.target.value);
    }

    renderedCallback() {
        const scrollArea = this.template.querySelector('.scroll');
        scrollArea.scrollTop = scrollArea.scrollHeight;

    }

    handleInputChange(event) {
        if (event.target.name == 'MobilePhone__c') {
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
                     this.customerInfo[event.target.name] = event.target.value;
                }
            }
        }
        this.customerInfo[event.target.name] = event.target.value;
    }

    closeChat() {
        this.dispatchEvent(new CustomEvent('closechat'));
    }
    handleNextClick() {
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
        this.template.querySelector('.otpInput').classList.remove('slds-hide');
        this.template.querySelector('.details').classList.add('slds-hide');
        this.rendomOTPNumber = (Math.floor(Math.random() * 10000) + 10000).toString().substring(1);
    }
    handleBack() {
        this.template.querySelector('.otpInput').classList.add('slds-hide');
        this.template.querySelector('.details').classList.remove('slds-hide');
    }

    handleValidate() {
        this.enteredOTPNumber = this.otpObj.one + this.otpObj.two + this.otpObj.three + this.otpObj.four;
        console.log(this.enteredOTPNumber);
        if (this.enteredOTPNumber != this.rendomOTPNumber) {
            this.showNotification('Error', 'Please Enter Valid OTP.', 'error');
            event.preventDefault();
            return;
        }
        this.isShowQuetions = true;
    }
    handleClose() {
        this.dispatchEvent(new CustomEvent('closechat'));
    }

    handleSave() {
        this.dispatchEvent(new CustomEvent('finishchat'));
        createInformationData({ customerInfo: JSON.stringify(this.customerInfo), answersData: JSON.stringify(Object.fromEntries(this.answersMap)) })
            .then(result => {
                console.log('Result', result);
            })
            .catch(error => {
                console.error('Error:', error);
            });
    }

    showNotification(title, message, variant) {
        const evt = new ShowToastEvent({
            title: title,
            message: message,
            variant: variant,
        });
        this.dispatchEvent(evt);
    }
}