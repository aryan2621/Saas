export class User {
    id!: string;
    email!: string;
    name!: string;
    picture!: string;
    createdAt!: string;

    constructor(json: Partial<User>) {
        Object.assign(this, json);
    }
}
