import { LightningElement, api, track, wire } from 'lwc';
import getProperty from '@salesforce/apex/MapPropertyController.getProperty';

export default class MapRecord extends LightningElement {
    @api recordId;
    @track mapMarkers = [];
    retrievedRecordId = false;

    connectedCallback() {
        if (this.recordId) {
            console.log('Found recordId: ' + this.recordId);

            getProperty({ recId: this.recordId })
                .then(data => {
                    if (data) {
                        console.log('data', JSON.parse(JSON.stringify(data)));

                        console.log(data?.Address__c.city);
                        console.log(data?.Address__Longitude__s);
                        console.log(data?.Address__Latitude__s);

                        this.mapMarkers = [
                            {
                                location: {
                                    Latitude: data?.Address__Latitude__s,
                                    Longitude: data?.Address__Longitude__s,
                                },
                                title: data?.Name,
                                description:
                                    data?.Description__c,
                            },
                        ];
                    } else {
                        console.log('OUTPUT : ');
                    }
                })
                .catch(error => {
                    console.log(error);
                });
        }
    }
}