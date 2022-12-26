import { LightningElement, api, wire,track } from 'lwc';
import { registerListener, unregisterAllListeners } from 'c/pubSub';
import{CurrentPageReference} from 'lightning/navigation';
import getFiles from '@salesforce/apex/MapPropertyController.getFiles';

export default class PropertyDetail extends LightningElement {
    @api recordId;
    @track recId;

    

    @wire(CurrentPageReference)pageRef;

    @track files = [];



    connectedCallback(){
        console.log('test', this);
        registerListener("selectedPP", this.handlePropertyChange, this );

        console.log(this.recordId);

        if(this.recordId){
            console.log(this.recordId);
            this.handlePropertyChange(this.recordId);
        }
    }

    renderedCallback(){
        if(this.recordId){
            console.log(this.recordId);
            this.handlePropertyChange(this.recordId);
        }
    }



    handlePropertyChange(value){
        console.log(value);
        this.recId = value;
        let self = this;
        this.files = [];
        getFiles({recId : value})
            .then(result => {
                result.forEach(function(res){
                    
                
                    self.files.push('https://ibirds39-dev-ed.develop.my.site.com/iBirdsProperty/sfc/servlet.shepherd/version/renditionDownload?rendition=THUMB720BY480&versionId=' + res);

                });


            })
            .catch(error => {
                // TODO Error handling
            });

            console.log(this.files);

            this.files = JSON.parse(JSON.stringify(this.files));

    }

    openRecord(){
        window.open('/s/property/' + this.recId);
    }
}