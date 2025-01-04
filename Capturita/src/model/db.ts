export const Subscription = {
    TableName: 'subscription',
    Fields: {
        /**
         * @description The unique identifier for the subscription.
         * Id of the subscription in the database, equal to user id.
         */
        id: 'id',
        /**
         * @description The date and time the subscription was created.
         */
        createdAt: 'created_at',
        /**
         * @description The type of the subscription.
         */
        type: 'type',
        /**
         * @description The number of videos the user can upload.
         */
        videosCount: 'videos_count',
    },
};

export const User = {
    TableName: 'user',
    Fields: {
        /**
         * @description The unique identifier for the user.
         * Id of the user in the database.
         */
        id: 'id',
        /**
         * @description The date and time the user was created.
         */
        createdAt: 'created_at',
        /**
         * @description The email of the user.
         */
        email: 'email',
        /**
         * @description The name of the user.
         */
        name: 'name',
        /**
         * @description The picture of the user.
         */
        picture: 'picture',
    },
};

export const Video = {
    TableName: 'video',
    Fields: {
        /**
         * @description The unique identifier for the video.
         * Id of the video in the database.
         */
        id: 'id',
        /**
         * @description The date and time the video was created.
         */
        createdAt: 'created_at',
        /**
         * @description The unique identifier for the user.
         * Id of the user in the database.
         */
        userId: 'user_id',
        /**
         * @description The path to the video in the storage.
         */
        path: 'path',
    },
};
