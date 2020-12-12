import React, { useEffect, useRef, useState } from 'react';
import { Container } from 'components/Container';
import { MainPageState } from './state';
import { FormFieldInput } from 'components/formFields/Input';

export const ElectroCalcPage = () => {
    const [state] = useState(() => new MainPageState());

    return (
        <Container>
            <h1>Калькулятор витков электромагнита</h1>
            <div>
                <div>
                    <b>Диаметр сэлектромагнитного сердечника в мм</b>
                </div>
                <FormFieldInput formData={state.form.magneticCoreDiameter} />
            </div>

            <div>
                <div>
                    <b>Длина сэлектромагнитного сердечника в мм</b>
                </div>
                <FormFieldInput formData={state.form.magneticCoreLength} />
            </div>

            <div>
                <div>
                    <b>Диаметр провода в мм</b>
                </div>
                <FormFieldInput formData={state.form.wireDiameter} />
            </div>

            <div>
                <div>
                    <b>Длина провода в м</b>
                </div>
                <FormFieldInput formData={state.form.wireLength} />
            </div>

            <div>
                <div>Результат:</div>
                <div>Кол-во витков: {state.wireTurns.turns}</div>
                <div>Итоговый диаметр вместе с проволокой: {state.wireTurns.coreDiameter}</div>
            </div>
        </Container>
    );
};
