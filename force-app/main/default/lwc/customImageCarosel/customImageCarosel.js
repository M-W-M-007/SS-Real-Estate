import { LightningElement , track , api} from 'lwc';
import FORM_FACTOR from '@salesforce/client/formFactor';
export default class CustomImageCarosel extends LightningElement {

    @track relatedProductList = [];
    // @track labels = label;
    // @track noProductFound = [MKB_webshop_resources + '/images/product_not_found.jpg'];
    // displayRelatedProducts = [];
    // startingIndex = 0;
    // numberOfProductCards = 2;
    // productCardCount = 2;
    isDesktopScreen = true;
    @track transitionStyle = 'transform:translateX(-0%)';
    transValue = 0;
    @track customBoxCSSClass = 'custom-box slds-box slds-text-align_center slds-border_bottom slds-p-bottom_small';
    @track sldsGrid = 'slds-grid slds-m-top_xx-large';
    @track relatedProductListOfList = [];
    @track noDataFound = false;
    @track popUpData;
    @track isPopUpModalOpen = false;
    @api isChildOpenedAlready;
    @api isCarouselAttachedOnDetailPage;
    @api numberOfCards;
    @track numberOfProductCards;
    @track cmpSize = 6;
    @track largeDeviceSize = 6;
    @track showPopup = true;

    //getting from product detail page
    @api
    get relatedProducts() {
        console.log('get this.data Mkb_relatedProductCarousel', this.product);
        return this.product;
    }
    set relatedProducts(value) {
        if (value) {
            console.log('set value Mkb_relatedProductCarousel detail page ', JSON.parse(JSON.stringify(value)));

            let ids = [];
            this.relatedProductList = value;
            console.log('relatedProductList => ', JSON.parse(JSON.stringify(this.relatedProductList)));
            this.noDataFound = this.relatedProductList && this.relatedProductList.length > 0 ? true : false;
            this.transValue = 0;
            this.transitionStyle = 'transform:translateX(-0%)';
            this.displayType();
            this.productListofList();
            //this.showCarouselToThePage();
        }
    }

    connectedCallback() {
        this.numberOfProductCards = this.numberOfCards;
        console.log('this.numberOfProductCards => ', this.numberOfProductCards);
        this.displayType();
        this.productListofList();
        let self = this;
        setInterval((self) => {
            console.log('time called');
            let isNextPageAvailble = (this.transValue + 100) == (this.relatedProductListOfList.length * 100);
            if(!isNextPageAvailble) {
               this.nextSlide(); 
            } else {
                this.transValue = 0;
                this.previousSlide();
            }
            
        }, 3000);   
        if (FORM_FACTOR == 'Small') {
            this.showPopup = false;
        }
    }

    displayType() {
        if (FORM_FACTOR == 'Small') {
            this.isDesktopScreen = false;
            this.customBoxCSSClass = 'mobile-custom-box slds-box slds-text-align_center slds-border_bottom slds-p-bottom_small';
            this.sldsGrid = 'slds-m-top_xx-large';
        } else if (FORM_FACTOR == 'Large') {
            console.log('this.isCarouselAttachedOnDetailPage => ', this.isCarouselAttachedOnDetailPage);
            if (this.isCarouselAttachedOnDetailPage) {
                this.customBoxCSSClass = 'custom-box-detail-page slds-box slds-text-align_center slds-border_bottom slds-p-bottom_small';
                console.log('in if this.customBoxCSSClass => ', this.customBoxCSSClass);
            } else {
                this.customBoxCSSClass = 'custom-box slds-box slds-text-align_center slds-border_bottom slds-p-bottom_small';
                console.log('in if this.customBoxCSSClass => => ', this.customBoxCSSClass);
            }
        }

        // console.log('my this.numberOfProductCards => ', this.numberOfProductCards);
        // console.log(' @api this.numberOfCards => ', this.numberOfCards);
        // card size 
        if (this.numberOfProductCards == 2) {
            this.cmpSize = 6;
            this.largeDeviceSize = 6;
        } else if (this.numberOfProductCards == 3) {
            this.cmpSize = 2;
            this.largeDeviceSize = 4;
        } else if (this.numberOfProductCards == 4) {
            this.cmpSize = 3;
            this.largeDeviceSize = 3;
        }
    }

    productListofList() {
        //let pageCount = this.isDesktopScreen ? Math.ceil((this.relatedProductList.length / this.numberOfProductCards)) : this.relatedProductList.length;
        let cardNumber = this.isDesktopScreen ? this.numberOfProductCards : 1;

        let listOfList = [];

        for (let i = 0; i < this.relatedProductList.length; i += parseInt(cardNumber)) {
            listOfList.push(this.relatedProductList.slice(i, i + parseInt(cardNumber)));
        }
        this.relatedProductListOfList = listOfList;

        // for (let outIndex = 0, index = 0; outIndex < pageCount; outIndex++) {
        //     console.log('hi 1');
        //     if (this.isDesktopScreen) {
        //         this.relatedProductListOfList[outIndex] = [this.relatedProductList[index]];
        //         // this.relatedProductList[index + 1] ? this.relatedProductListOfList[outIndex].push(this.relatedProductList[index + 1]) : false;
        //         let innerIndex = index == 0  ? 1 : index + 1;
        //         for(let myIndexVal = innerIndex; myIndexVal < this.numberOfProductCards; myIndexVal++){                    
        //             this.relatedProductList[myIndexVal] ? this.relatedProductListOfList[outIndex].push(this.relatedProductList[myIndexVal]) : false;
        //         }
        //         // index = index + this.numberOfProductCards;
        //         index = this.numberOfProductCards;
        //         // myIndexVal = this.numberOfProductCards
        //         this.numberOfProductCards = this.numberOfProductCards + cardNumber;
        //     } else {
        //         this.relatedProductListOfList[outIndex] = [this.relatedProductList[index]];
        //         index++;
        //     }
        // }

        console.log('my relatedProductListOfList => ', JSON.parse(JSON.stringify(this.relatedProductListOfList)));

    }

    previousSlide() {
        this.transValue = this.transValue - 100;
        this.transitionStyle = `transform:translateX(-${this.transValue}%)`;
    }

    nextSlide() {
        console.log('nextSlide called');
        this.transValue = this.transValue + 100;
        this.transitionStyle = `transform:translateX(-${this.transValue}%)`;
    }

    get disablePreviousButton() {
        return this.transValue == 0;
    }

    get disableNextButton() {
        return (this.transValue + 100) == (this.relatedProductListOfList.length * 100);
    }
}