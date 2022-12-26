import { LightningElement, api, track } from 'lwc';
import getFiles from '@salesforce/apex/MapPropertyController.getFiles';

export default class PropertyFiles extends LightningElement {
    @api recordId;
    retrievedRecordId = false;
    @track files = [];
    renderedCallback() {
        console.log('Found recordId:');
        if (!this.retrievedRecordId && this.recordId) {

            this.retrievedRecordId = true; // Escape case from recursion
            console.log('Found recordId: ' + this.recordId);

            let self = this;
            this.files = [];
            getFiles({ recId: this.recordId })
                .then(result => {
                    if (result) {
                        result.forEach(function (res) {
                            self.files.push('/sfc/servlet.shepherd/document/download/' + res);
                        });
                    } 
                })
                .catch(error => {
                    console.log('OutputMap : ', error);
                });

            console.log(this.files);

            this.files = JSON.parse(JSON.stringify(this.files));
            // Execute some function or backend controller call that needs the recordId
        }
    }



}