import { computed, observable } from 'mobx';
import { FormField } from 'helpers/formValidator';

export class MainPageState {
    form = {
        magneticCoreDiameter: new FormField('1'), // Диаметр сэлектромагнитного сердечника в мм
        magneticCoreLength: new FormField('100'), // Длина сэлектромагнитного сердечника в мм
        wireDiameter: new FormField('1'), // Диаметр провода в мм
        wireLength: new FormField('100'), // Длина провода в м
    };

    // Кол-во витков провода
    @computed get wireTurns() {
        let wireLength = parseFloat(this.form.wireLength.value) * 1000;
        const wireDiameter = parseFloat(this.form.wireDiameter.value);

        let coreDiameter = parseFloat(this.form.magneticCoreDiameter.value);
        const coreLength = parseFloat(this.form.magneticCoreLength.value);

        let horizontalTurnsCount = Math.floor(coreLength / wireDiameter);

        let turns = 0;
        let go = true;

        while (go) {
            const circleLength = 2 * Math.PI * (coreDiameter / 2);

            for (let i = 0; i < horizontalTurnsCount; i++) {
                wireLength -= circleLength;
                if (wireLength > 0) {
                    turns++;
                } else {
                    go = false;
                    break;
                }
            }

            coreDiameter += wireDiameter * 2;
        }

        return {
            turns,
            coreDiameter,
        };
    }
}
