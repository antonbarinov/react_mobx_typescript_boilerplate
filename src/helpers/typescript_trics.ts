// ------------------------------------------------------------------------------------------------
type Student = {
    name: string;
    age: number;
    hasScar: boolean;
};

const students: Student[] = [
    { name: 'Harry', age: 17, hasScar: true },
    { name: 'Ron', age: 17, hasScar: false },
    { name: 'Hermione', age: 16, hasScar: false },
];

function getBy<T, P extends keyof T>(model: T[], prop: P, value: T[P]): T | null {
    return model.filter((item) => item[prop] === value)[0] || null;
}

getBy(students, 'age', 12);
// ------------------------------------------------------------------------------------------------
// ------------------------------------------------------------------------------------------------
type CL<T> = { new (): T };

function returnNewClassFromArgument<T>(c: CL<T>): T {
    return new c();
}
// ------------------------------------------------------------------------------------------------
