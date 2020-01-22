# React.js + MobX + Typescript boilerplate

## Main features

-   Ready to use architecture
-   Custom reactive and user friendly MobX based router
-   API requests class
-   Pre-commit hook: Prettier + ESlint auto fix and reformat code

## Rules and basics

1. Use functional components with hooks. Don't use class components in this project.

2. All components must be wrapped into `observer`, this can be imported like this `import { observer } from 'mobx-react-lite';`

3. Don't create components inside components, create them outside and pass data to them using props if needed

4. All mutations of `observable` objects/arrays must be used `mutateObject` function. MobX is mutable, not immutable. Examples:

```
import { observable } from 'mobx';
import { mutateObject } from 'helpers/mutateObject';

class SomeState {
    @observable someData = {
        a: 1,
        b: 2
    };
    @observable isFetching = false;
    @observable serverError = null;
    @observable items = [];

    fetchData = async () => {
        const result = await someApiRequest(); // Fetch items from server
        this.items = result; // BAD
        mutateObject(this.items, result); // GOOD
    };

    action1 = () => {
        // We need to this.someData = { a: 2 }
        this.someData = { a: 2 }; // BAD
        mutateObject(this.someData, { a: 2 }); // GOOD
    };

    action2 = () => {
        // We need to modify this.someData and keep properties

        // BAD
        this.someData = {
            ...this.someData,
            a: 2,
            c: 4
        };

        // GOOD
        mutateObject(this.someData, { a: 2, c: 4 }, true);
    };

    apiRequest = async () => {
        this.isFetching = true;

        // After async calls components will be re-render without batching if we
        try {
            const response = await someApiRequest(); // Fetch items from server

            mutateObject(this.items, response.items);
            this.isFetching = false;
            this.serverError = null;
        } catch (e) {
            this.serverError = e.message || 'Something went wrong';
            this.isFetching = false;
        }
    }
}
```

## Run

```
npm i -g yarn
yarn install
yarn start
```

Browser will be opened

## Build

```
yarn run build:prod
yarn run build:dev
```
