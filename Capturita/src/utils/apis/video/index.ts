import { Video } from '@/model/db';
import { Video as VideoModel } from '@/model/video';
import { supabase } from '@/utils/supabase';

export const getUserVideos = async (userId: string) => {
    try {
        const { data, error } = await supabase.from(Video.TableName).select('*').eq(Video.Fields.userId, userId);
        if (error) {
            throw error;
        }
        if (!data) {
            return [];
        }
        return data;
    } catch (error) {
        console.error('Error while getting user videos', error);
        throw error;
    }
};

export const createVideo = async (video: VideoModel) => {
    try {
        const { data, error } = await supabase.from(Video.TableName).insert({
            [Video.Fields.userId]: video.userId,
            [Video.Fields.path]: video.path,
        });
        if (error) {
            throw error;
        }
        return data;
    } catch (error) {
        console.error('Error while creating video', error);
        throw error;
    }
};
