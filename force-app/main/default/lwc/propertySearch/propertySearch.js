import { LightningElement, track, wire } from 'lwc';
import getPropertyData from '@salesforce/apex/PropertySearchController.getPropertyData';
import getAllRecordTypes from '@salesforce/apex/PropertySearchController.getRecordTypeNames';
import getPickListValues from '@salesforce/apex/PropertySearchController.getTitlePickListValue';
import getDefaultPropertyData from '@salesforce/apex/PropertySearchController.getDefaultProperties';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { NavigationMixin } from 'lightning/navigation';
import DEFAULT_PROPERTY_IMAGE from '@salesforce/resourceUrl/PropertyefaultImage';

import { getObjectInfo } from 'lightning/uiObjectInfoApi';
import PROPERTY_OBJECT from '@salesforce/schema/Property__c';
import { getPicklistValues } from 'lightning/uiObjectInfoApi';
import CITY from '@salesforce/schema/Property__c.City__c';
import PRIMARY_LOCATION from '@salesforce/schema/Property__c.Primary_Location__c';
import Title from '@salesforce/schema/Property__c.Title__c';
import PropertyType from '@salesforce/schema/Property__c.Property_Type__c';

export default class PropertySearch extends NavigationMixin(LightningElement) {

    @track priceFrom;
    @track priceTo;
    @track locality;
    @track type = [];
    @track propertyData = [];
    @track isShowSpinner = false;
    @track isApplyForEnquiry = false;
    @track selectedPropertyType = [];
    @track selectedPropertyId;
    @track propertyType;
    @track isSubmitEnquiry = false;
    @track titleListData;
    @track selectedPropertyTitle = '';
    @track locationListData;
    @track projectListData;
    @track priceRange = [];
    @track selectedPriceRange;
    @track cityListData = [];
    @track selectedCity;
    @track lookingForListData;
    @track selectedPropertyFor;
    @track selectedPropertyName;
    @track propertyTypeData;
    @track propertyCategory = [];
    @track selectedProject = '';
    @track defaultPropertyImgURL = DEFAULT_PROPERTY_IMAGE;

    @wire(getObjectInfo, { objectApiName: PROPERTY_OBJECT })
    properyInfo;

    @track slaOptions;

    @wire(getPicklistValues, { recordTypeId: '$properyInfo.data.defaultRecordTypeId', fieldApiName: PRIMARY_LOCATION })
    primaryLocationFieldInfo({ data, error }) {
        if (data) {
            this.slaFieldData = data;
        }
    }
    @wire(getPicklistValues, { recordTypeId: '$properyInfo.data.defaultRecordTypeId', fieldApiName: CITY })
    cityFieldInfo({ data, error }) {
        if (data) {
            let myArray = [];
            myArray.push({ label: '--None--', value: '' });
            data.values.forEach(currentItem => {

                myArray.push({ label: currentItem.label, value: currentItem.value });
            });
            this.cityListData = JSON.parse(JSON.stringify(myArray));
        }

    }

    @wire(getPicklistValues, { recordTypeId: '$properyInfo.data.defaultRecordTypeId', fieldApiName: PropertyType })
    propertyTypeInfo({ data, error }) {
        if (data) {
            this.propertyTypeData = data;
        }
    }
    @wire(getPicklistValues, { recordTypeId: '$properyInfo.data.defaultRecordTypeId', fieldApiName: Title })
    propertyCategoryInfo({ data, error }) {
        if (data) {
            let myArray = [];
            myArray.push({ label: '--None--', value: '' });
            data.values.forEach(currentItem => {
                myArray.push({ label: currentItem.label, value: currentItem.value });
            });
            this.propertyCategory = JSON.parse(JSON.stringify(myArray));
        }

    }

    connectedCallback() {
        this.isShowSpinner = true;
        this.selectedCity = sessionStorage.getItem('city') ? sessionStorage.getItem('city') : null;
        this.locationListData = sessionStorage.getItem('locationData') ? JSON.parse(sessionStorage.getItem('locationData')) : [];
        this.selectedPropertyFor = sessionStorage.getItem('propertyfor') ? sessionStorage.getItem('propertyfor') : null;
        this.selectedPropertyTitle = sessionStorage.getItem('propertyTitle') ? sessionStorage.getItem('propertyTitle') : null;
        this.selectedPriceRange = sessionStorage.getItem('price') ? sessionStorage.getItem('price') : null;
        this.locality = sessionStorage.getItem('locality') ? sessionStorage.getItem('locality') : null;
        this.propertyData = sessionStorage.getItem('propertyData') ? JSON.parse(sessionStorage.getItem('propertyData')) : [];
        this.propertyType = sessionStorage.getItem('propertyType') ? JSON.parse(sessionStorage.getItem('propertyType')) : [];
        //this.selectedProject = sessionStorage.getItem('project') ? sessionStorage.getItem('project') : '';
        this.selectedPropertyType = sessionStorage.getItem('selectedPropertyType') ? sessionStorage.getItem('selectedPropertyType') : [];
        if (sessionStorage.getItem('price')) {
            if (sessionStorage.getItem('price') != '10000000') {
                this.priceFrom = sessionStorage.getItem('price').split('-')[0] + '00000';
                this.priceTo = sessionStorage.getItem('price').split('-')[1] + '00000';
            } else {
                this.priceFrom = sessionStorage.getItem('price');
                this.priceTo = '';
            }

        }
        if (!sessionStorage.getItem('propertyData')) {
            getDefaultPropertyData()
                .then(result => {
                    this.propertyData = result;
                    this.isShowSpinner = false;
                })
                .catch(error => {
                    this.isShowSpinner = false;
                });
        } else {
            this.isShowSpinner = false;
        }

        getPickListValues({ fieldName: 'Looking_For__c' })
            .then(result => {
                let lookingForOption = [];
                lookingForOption.push({ 'label': '--None--', 'value': '' });
                result.forEach(element => {
                    lookingForOption.push({ 'label': element, 'value': element });
                });
                this.lookingForListData = JSON.parse(JSON.stringify(lookingForOption));
            })
            .catch(error => {
            });

        // getPickListValues({ fieldName: 'Project_Name__c' })
        //     .then(result => {
        //         let projectOptions = [];
        //         projectOptions.push({ 'label': '--None--', 'value': '' });
        //         result.forEach(element => {
        //             projectOptions.push({ 'label': element, 'value': element });
        //         });
        //         this.projectListData = JSON.parse(JSON.stringify(projectOptions));
        //     })
        //     .catch(error => {
        //     });



        let priceArray = ['1-10', '10-25', '25-50', '50-75', '75-100', '10000000'];
        this.priceRange.push({ 'label': '--None--', 'value': '' });
        priceArray.forEach(element => {
            if (element != '10000000') {
                this.priceRange.push({ 'label': element + ' Lakh', 'value': element });
            } else {
                this.priceRange.push({ 'label': 'Above 1 Cr.', 'value': element });
            }
        })


    }
    handleInputChange(event) {
        if (event.target.name == 'city') {
            let myArray = [];
            let myArray2 = [];

            let key = this.slaFieldData.controllerValues[event.target.value];
            myArray = this.slaFieldData.values.filter(opt => opt.validFor.includes(key));
            if (myArray.length > 0) {
                myArray2.push({ label: '--None--', value: '' });
                myArray.forEach(currentItem => {
                    myArray2.push({ label: currentItem.label, value: currentItem.value });
                });
            }

            this.locationListData = JSON.parse(JSON.stringify(myArray2));
            sessionStorage.setItem('locationData', JSON.stringify(this.locationListData));
            this.selectedCity = event.target.value;
            this.locality = '';
            sessionStorage.removeItem('locality');
            sessionStorage.setItem('city', this.selectedCity);
        } else if (event.target.name == 'locality') {
            this.locality = event.target.value;
            sessionStorage.setItem('locality', this.locality);
        } else if (event.target.name == 'propertyfor') {
            this.selectedPropertyFor = event.target.value;
            sessionStorage.setItem('propertyfor', this.selectedPropertyFor);
        } else if (event.target.name == 'price') {
            if (event.target.value != '10000000' && event.target.value != '') {
                this.priceFrom = event.target.value.split('-')[0] + '00000'.toString();
                this.priceTo = event.target.value.split('-')[1] + '00000'.toString();
            } else {
                this.priceFrom = event.target.value;
                this.priceTo = '';
            }
            sessionStorage.setItem('price', event.target.value);
        } else if (event.target.name == 'type') {
            let myArray = [];
            let myArray2 = [];

            let key = this.propertyTypeData.controllerValues[event.target.value];
            myArray = this.propertyTypeData.values.filter(opt => opt.validFor.includes(key));
            if (myArray.length > 0) {
                myArray.forEach(currentItem => {
                    myArray2.push({ label: currentItem.label, value: currentItem.value });
                });
            }

            this.propertyType = JSON.parse(JSON.stringify(myArray2));
            this.selectedPropertyTitle = event.target.value;
            this.selectedPropertyType = [];
            sessionStorage.removeItem('selectedPropertyType');
            sessionStorage.setItem('propertyTitle', this.selectedPropertyTitle);
            sessionStorage.setItem('propertyType', JSON.stringify(this.propertyType));
            this.template.querySelector('c-multi-select-picklist').handleParentChange();
        }
        //else if(event.target.name == 'project'){
        //     this.selectedProject = event.target.value;
        //     sessionStorage.setItem('project', this.selectedProject);
        // }
    }

    hanldeSelectedTypeValue(event) {
        this.selectedPropertyType = event.detail;
        sessionStorage.setItem('selectedPropertyType', JSON.stringify(this.selectedPropertyType));
    }

    handleApply() {
        this.isShowSpinner = true;
        getPropertyData({ propertyTilte: this.selectedPropertyTitle, selectedType: this.selectedPropertyType, priceFrom: this.priceFrom, priceTo: this.priceTo, locality: this.locality, city: this.selectedCity, lookingFor: this.selectedPropertyFor })
            .then(result => {
                if (result) {
                    console.log('OUTPUT : ',result);
                    this.isShowSpinner = false;
                    this.propertyData = result;
                    sessionStorage.setItem('propertyData', JSON.stringify(this.propertyData));
                } else {
                    this.isShowSpinner = false;
                }
            })
            .catch(error => {
                this.isShowSpinner = false;
                console.log('error : ',error);
            });
    }

    handleEnquiry(event) {
        this.selectedPropertyId = event.target.name;
        this.selectedPropertyName = event.currentTarget.dataset.name;
        this.isApplyForEnquiry = true;
    }

    closeModel() {
        this.isApplyForEnquiry = false;
    }

    handleViewDetail(event) {
        this[NavigationMixin.Navigate]({
            type: 'standard__recordPage',
            attributes: {
                recordId: event.target.name,
                objectApiName: 'Property__c',
                actionName: 'view'
            }
        });
    }
    handleChildComponent() {
        this.isApplyForEnquiry = false;
    }
    handleLoaderOn(){
        this.isSubmitEnquiry = true;
    }
    hanldeLoaderOff(){
        this.isSubmitEnquiry = false;
    }
}