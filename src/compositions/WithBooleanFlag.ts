import { observable } from 'mobx';
import { EventEmitter } from 'lib/EventEmitter';

type WithBooleanFlagEvents = {
    change: (value: boolean) => any;
    'on:true': () => any;
    'on:false': () => any;
};

export class WithBooleanFlag {
    @observable private __value = false;
    hoverProps: { onMouseEnter: () => void; onMouseLeave: () => void } = null;
    events = new EventEmitter<WithBooleanFlagEvents>();

    constructor(initialFlag = false) {
        this.__value = initialFlag;
        this.hoverProps = { onMouseEnter: this.setTrue, onMouseLeave: this.setFalse };
    }

    get value() {
        return this.__value;
    }

    set value(value) {
        const changed = this.__value !== value;

        this.__value = value;

        if (changed) {
            this.events.emit('change', value);
            if (value === true) {
                this.events.emit('on:true');
            } else if (value === false) {
                this.events.emit('on:false');
            }
        }
    }

    setTrue = () => {
        this.value = true;
    };

    setFalse = () => {
        this.value = false;
    };

    setValue = (val: boolean) => {
        this.value = val;
    };

    toggle = () => {
        this.value = !this.value;
    };
}
