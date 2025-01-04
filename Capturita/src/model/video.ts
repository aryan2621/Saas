export class Video {
    id!: string;
    userId!: string;
    createdAt!: string;
    path!: string;

    constructor(json: Partial<Video>) {
        Object.assign(this, json);
    }
}
