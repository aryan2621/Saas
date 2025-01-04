import { subscriptionLimits, Subscription as SubscriptionModel, SubscriptionType } from '@/model/subscription';
import { supabase } from '@/utils/supabase';
import { Subscription } from '@/model/db';

export const createSubscription = async (userId: string, subscriptionType: SubscriptionType) => {
    const subscription = new SubscriptionModel({ id: userId, type: subscriptionType, videosCount: 0 });
    try {
        await supabase.from(Subscription.TableName).insert(subscription);
    } catch (error) {
        console.error('Error while creating subscription', error);
        throw error;
    }
};

export const getSubscription = async (userId: string) => {
    try {
        const { data, error } = await supabase.from(Subscription.TableName).select('*').eq(Subscription.Fields.id, userId);
        if (error) {
            throw error;
        }
        return data[0];
    } catch (error) {
        console.error('Error while getting subscription', error);
        throw error;
    }
};

export const editSubscription = async (userId: string, subscriptionType: SubscriptionType) => {
    const subscription = new SubscriptionModel({ id: userId, type: subscriptionType });
    try {
        await supabase.from(Subscription.TableName).update(subscription).eq(Subscription.Fields.id, userId);
    } catch (error) {
        console.error('Error while editing subscription', error);
        throw error;
    }
};

export const deleteSubscription = async (userId: string) => {
    try {
        await supabase.from(Subscription.TableName).delete().eq(Subscription.Fields.id, userId);
    } catch (error) {
        console.error('Error while deleting subscription', error);
        throw error;
    }
};

export const handleSubscription = async (userId: string) => {
    try {
        const subscription = await getSubscription(userId);
        if (!subscription) {
            await createSubscription(userId, SubscriptionType.BASIC);
        }
        const subscriptionType = subscription.type as SubscriptionType;
        if (subscription.videosCount + 1 > subscriptionLimits[subscriptionType]) {
            throw new Error('User has reached the maximum number of videos for this subscription type.');
        }
        await supabase
            .from(Subscription.TableName)
            .update({ videosCount: subscription.videosCount + 1 })
            .eq(Subscription.Fields.id, userId);
    } catch (error) {
        console.error('Error while handling subscription', error);
        throw error;
    }
};
