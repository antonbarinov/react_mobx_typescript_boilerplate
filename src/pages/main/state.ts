import { observable } from 'mobx';

export class MainPageState {
    @observable time = new Date().toISOString();
    @observable title = 'Main page';

    handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        this.title = e.target.value;
    };

    updateTime = () => {
        this.time = new Date().toISOString();
    };
}
