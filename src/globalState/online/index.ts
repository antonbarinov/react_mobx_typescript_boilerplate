import { observable } from 'mobx';

class Online {
    @observable online = navigator.onLine;

    updateOnline = () => {
        this.online = navigator.onLine;
    };
}

const onlineState = new Online();

window.addEventListener('offline', onlineState.updateOnline);
window.addEventListener('online', onlineState.updateOnline);

export default onlineState;
