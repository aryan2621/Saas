import { User } from '@/model/db';
import { User as UserModel } from '@/model/user';
import { supabase } from '@/utils/supabase';

export const getUser = async (userId: string) => {
    try {
        const { data, error } = await supabase.from(User.TableName).select('*').eq(User.Fields.id, userId);
        if (error) {
            throw error;
        }
        return data[0];
    } catch (error) {
        console.error('Error while getting user', error);
        throw error;
    }
};

export const createUser = async (user: UserModel) => {
    try {
        const { error } = await supabase.from(User.TableName).insert({
            [User.Fields.id]: user.id,
            [User.Fields.email]: user.email,
            [User.Fields.name]: user.name,
            [User.Fields.picture]: user.picture,
        });
        if (error) {
            throw error;
        }
    } catch (error) {
        console.error('Error while creating user', error);
        throw error;
    }
};

export const isUserExists = async (email: string) => {
    try {
        const { data, error } = await supabase.from(User.TableName).select('*').eq(User.Fields.email, email);
        if (error) {
            throw error;
        }
        return data.length > 0;
    } catch (error) {
        console.error('Error while checking if user exists', error);
        throw error;
    }
};
