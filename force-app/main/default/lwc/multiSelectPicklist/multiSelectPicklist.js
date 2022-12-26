import { LightningElement, api , track } from 'lwc';
export default class MultiSelectPicklist extends LightningElement {
    @api label;
    @api value;
    @api options;
    @api placeholder;
    hasDropdown = false;
    isOpen = false;

    connectedCallback() {
        this.selectedValues = sessionStorage.getItem('type') ? sessionStorage.getItem('type') : [];
    }
    get picklistOptions(){
        return JSON.parse(JSON.stringify(this.options));
    }
    selectedValues = [];
    handleClickCancel() {
        this.hasDropdown = true;
    }

    @api
    handleParentChange(){
        this.selectedValues =  [];
        sessionStorage.removeItem('type');
    }

    handleBlur(){
        setTimeout(() => {
            if(!this.isOpen){
                this.hasDropdown = false;
            }else{
                let inputField = this.template.querySelector('input');
                if(inputField){
                    inputField.focus();
                }
                this.isOpen = false;
            }
        }, 200);
    }

    handleChange(event) {
        this.selectedValues = event.detail.value;
        this.dispatchEvent(new CustomEvent('multiselectpicklist', { detail: this.selectedValues }));
        sessionStorage.setItem('type',this.selectedValues);
        this.isOpen = true;
    }

    myMethod(event){
        this.isOpen = true;
    }
}