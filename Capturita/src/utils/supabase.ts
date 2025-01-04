import { Subscription, User } from '@/model/db';
import { createClient } from '@supabase/supabase-js';

export const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_API_KEY!);

/**
 * @description Uploads a video to the storage.
 * @param file - The video file to upload.
 * @returns The path to the uploaded video.
 */
export const uploadVideo = async (file: File) => {
    try {
        const { data, error } = await supabase.storage.from('videos').upload(file.name, file);
        if (error) {
            throw error;
        }
        return data.path;
    } catch (error) {
        console.error('Error while uploading video', error);
        throw error;
    }
};

/**
 * @description Downloads a video from the storage.
 * @param path - The path to the video in the storage.
 * @returns The video file.
 */
export const getVideo = async (path: string) => {
    try {
        const { data, error } = await supabase.storage.from('videos').download(path);
        if (error) {
            throw error;
        }
        return data;
    } catch (error) {
        console.error('Error while downloading video', error);
        throw error;
    }
};

/**
 * @description Gets a user from the database.
 * @param id - The id of the user.
 * @returns The user.
 */
export const getUser = async (id: string) => {
    try {
        const { data, error } = await supabase.from(User.TableName).select('*').eq(User.Fields.id, id);
        if (error) {
            throw error;
        }
        return data;
    } catch (error) {
        console.error('Error while fetching user', error);
        throw error;
    }
};

/**
 * @description Gets a user subscription from the database.
 * @param userId - The id of the user.
 * @returns The user subscription.
 */
export const getUserSubscription = async (userId: string) => {
    try {
        const { data, error } = await supabase.from(Subscription.TableName).select('*').eq(Subscription.Fields.id, userId);
        if (error) {
            throw error;
        }
        return data;
    } catch (error) {
        console.error('Error while fetching user subscription', error);
        throw error;
    }
};

/**
 * @description Updates a user subscription.
 * @param userId - The id of the user.
 */
export const updateUserSubscription = async (userId: string) => {
    const subscription = await getUserSubscription(userId);
    // const subscriptionType = (subscription[0] as unknown as Subscription).type;
    // if ((subscription[0] as unknown as Subscription).videosCount + 1 > subscriptionLimits[subscriptionType]) {
    //     throw new Error('User has reached the maximum number of videos for this subscription type.');
    // }
    await supabase
        .from(Subscription.TableName)
        .update({ videosCount: subscription[0].videosCount + 1 })
        .eq(Subscription.Fields.id, userId);
};
