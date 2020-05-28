import { observable } from 'mobx';

export class WithBooleanFlag {
    @observable value = false;
    hoverProps: { onMouseEnter: () => void; onMouseLeave: () => void } = null;

    constructor(initialFlag = false) {
        this.value = initialFlag;
        this.hoverProps = { onMouseEnter: this.setTrue, onMouseLeave: this.setFalse };
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
