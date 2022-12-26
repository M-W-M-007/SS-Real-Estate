import { LightningElement, track } from 'lwc';
import DEFAULT_PROPERTY_IMAGE from '@salesforce/resourceUrl/PropertyefaultImage';
import myResource from '@salesforce/resourceUrl/astitva1';
export default class CustomSlider extends LightningElement {

    @track displayData = [];
    @track resource = myResource;
    connectedCallback() {
        console.log('resource ',this.resource);
        this.displayData = [
            {
                url: this.resource
            },{
                url: 'https://sukh-sampatti.my.site.com/resource/astitva/astitva.jpg'
            },{
                url: 'https://sukh-sampatti.my.site.com/resource/astitva/astitva.jpg'
            },{
                url: 'https://www.lightningdesignsystem.com/assets/images/carousel/carousel-01.jpg'
            },{
                url: 'https://www.lightningdesignsystem.com/assets/images/carousel/carousel-02.jpg'
            },{
                url: 'https://www.lightningdesignsystem.com/assets/images/carousel/carousel-03.jpg'
            },{
                url: 'https://sukh-sampatti.my.site.com/resource/astitva/astitva.jpg'
            },{
                url: 'https://www.lightningdesignsystem.com/assets/images/carousel/carousel-01.jpg'
            },{
                url: 'https://sukh-sampatti.my.site.com/resource/astitva/astitva.jpg'
            },{
                url: 'https://www.lightningdesignsystem.com/assets/images/carousel/carousel-01.jpg'
            },{
                url: 'https://sukh-sampatti.my.site.com/resource/astitva/astitva.jpg'
            },{
                url: 'https://www.lightningdesignsystem.com/assets/images/carousel/carousel-03.jpg'
            }
        ];
    }
}