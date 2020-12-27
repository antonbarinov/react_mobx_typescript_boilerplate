import { observable } from 'mobx';
import React from 'react';

export class MyComponentsState {
    @observable counter = 1;
    @observable title = 'some title';

    handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        this.title = e.target.value;
    };
}
