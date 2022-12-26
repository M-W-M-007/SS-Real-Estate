import { LightningElement , track , api, wire } from 'lwc';
import { getRecord, getFieldValue } from 'lightning/uiRecordApi';
import YOUTUBE_VIDEO_LINK from '@salesforce/schema/Property__c.Youtube_Video_Link__c';
export default class DisplayPropertyVideo extends LightningElement {
    @api recordId;
    @wire(getRecord, { recordId: '$recordId', fields:[YOUTUBE_VIDEO_LINK] })
    property;

    get youtubeLink() {
        console.log('this.property.data : ',this.property.data,this.recordId);
        return getFieldValue(this.property.data, YOUTUBE_VIDEO_LINK);
    }
}