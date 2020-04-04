import { observable } from 'mobx';

export class WithBooleanFlag {
    @observable value = false;

    constructor(initialFlag = false) {
        this.value = initialFlag;
    }

    setTrue = () => {
        this.value = true;
    };

    setFalse = () => {
        this.value = false;
    };

    toggle = () => {
        this.value = !this.value;
    };
}
