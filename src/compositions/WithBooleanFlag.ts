import { observable, when } from 'mobx';
import { EventEmitter } from 'lib/EventEmitter';
import { anyFunction } from 'declarations/types';

type WithBooleanFlagEvents = {
    change: (value: boolean) => any;
    'on:true': () => any;
    'on:false': () => any;
};

export class WithBooleanFlag {
    @observable private __value = false;
    @observable private lockDelayFlag = false;
    hoverProps: { onMouseEnter: anyFunction; onMouseLeave: anyFunction } = null;
    lockFlagProps: { onMouseDown: anyFunction; onMouseUp: anyFunction; onTouchEnd: anyFunction; onTouchStart: anyFunction } = null;
    events = new EventEmitter<WithBooleanFlagEvents>();

    constructor(initialFlag = false) {
        this.__value = initialFlag;
        this.hoverProps = { onMouseEnter: this.setTrue, onMouseLeave: this.setFalse };
        this.lockFlagProps = {
            onMouseDown: this.lockFlag,
            onMouseUp: this.unLockFlag,
            onTouchEnd: this.unLockFlag,
            onTouchStart: this.lockFlag,
        };
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

    private lockFlag = () => {
        this.lockDelayFlag = true;
    };

    private unLockFlag = () => {
        setTimeout(() => {
            this.lockDelayFlag = false;
        }, 0);
    };

    setTrue = () => {
        this.value = true;
    };

    setFalse = () => {
        this.value = false;
    };

    setFalseWithDelay = async () => {
        await when(() => this.lockDelayFlag === false);
        setTimeout(this.setFalse, 0);
    };

    setTrueWithDelay = async () => {
        await when(() => this.lockDelayFlag === false);
        setTimeout(this.setTrue, 0);
    };

    toggleWithDelay = async () => {
        await when(() => this.lockDelayFlag === false);
        setTimeout(this.toggle, 0);
    };

    setValue = (val: boolean) => {
        this.value = val;
    };

    toggle = () => {
        this.value = !this.value;
    };
}
