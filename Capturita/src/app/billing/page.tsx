'use client';

import { SideNav } from '@/components/side-nav';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Check, HandCoins } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { subscriptionPrices, SubscriptionType, yearlySubscriptionPrices } from '@/model/subscription';
import ky from 'ky';
import { toast } from 'sonner';
import { convertToSubcurrency } from '@/lib/utils';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);
const pricingPlans: {
    name: string;
    monthlyPrice: string;
    yearlyPrice: string;
    description: string;
    features: string[];
}[] = [
    {
        name: SubscriptionType.BASIC,
        monthlyPrice: `${convertToSubcurrency(subscriptionPrices[SubscriptionType.BASIC])}`,
        yearlyPrice: `${convertToSubcurrency(yearlySubscriptionPrices[SubscriptionType.BASIC])}`,
        description: 'For hobbyists and beginners',
        features: ['5 video projects per month', 'Basic editing tools', '720p export quality', 'Email support'],
    },
    {
        name: SubscriptionType.PRO,
        monthlyPrice: `${convertToSubcurrency(subscriptionPrices[SubscriptionType.PRO])}`,
        yearlyPrice: `${convertToSubcurrency(yearlySubscriptionPrices[SubscriptionType.PRO])}`,
        description: 'For content creators and professionals',
        features: [
            'Unlimited video projects',
            'Advanced editing tools',
            '4K export quality',
            'Priority email and chat support',
            'Collaboration tools',
        ],
    },
    {
        name: SubscriptionType.ENTERPRISE,
        monthlyPrice: 'Custom',
        yearlyPrice: 'Custom',
        description: 'For large teams and organizations',
        features: ['Everything in Pro', 'Custom branding', 'API access', 'Dedicated account manager', 'On-premise deployment options'],
    },
];

const Pricing = () => {
    const [isYearly, setIsYearly] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleSubscription = async (plan: { name: string; monthlyPrice: string; yearlyPrice: string; description: string; features: string[] }) => {
        const price = isYearly ? plan.yearlyPrice : plan.monthlyPrice;
        if (plan.name === SubscriptionType.ENTERPRISE) {
            window.location.href = '/contact';
            return;
        }
        try {
            setIsLoading(true);
            const stripe = await stripePromise;
            const response = await ky.post('/api/checkout-session', {
                json: {
                    image: 'https://www-animeherald-com.exactdn.com/wp-content/uploads/2016/06/KochiKame-Header-001-20160616.jpg?strip=all&lossy=1&ssl=1',
                    name: plan.name,
                    price: price,
                    description: plan.description,
                    quantity: 1,
                },
            });
            const { sessionId } = await response.json();
            stripe?.redirectToCheckout({ sessionId });
        } catch (error) {
            console.log('Error while checkout sunscription', error);
            toast.error('Error while checkout sunscription');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Card className='mb-8'>
            <CardHeader>
                <CardTitle className='flex items-center space-x-2'>
                    <HandCoins className='h-6 w-6' />
                    <span>Pricing</span>
                </CardTitle>
                <CardDescription>Select the perfect plan for your video editing needs</CardDescription>
                <div className='flex items-center justify-center space-x-2 mt-4'>
                    <span className={!isYearly ? 'font-bold' : ''}>Monthly</span>
                    <Switch checked={isYearly} onCheckedChange={setIsYearly} />
                    <span className={isYearly ? 'font-bold' : ''}>Yearly</span>
                    {isYearly && <span className='text-sm text-primary ml-2'>(Save 17%)</span>}
                </div>
            </CardHeader>
            <CardContent>
                <div className='grid md:grid-cols-3 gap-8'>
                    {pricingPlans.map((plan, index) => (
                        <Card key={index} className={index === 1 ? 'border-primary' : ''}>
                            <CardHeader>
                                <CardTitle className='text-2xl'>{plan.name}</CardTitle>
                                <CardDescription>{plan.description}</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <p className='text-4xl font-bold mb-4'>
                                    {isYearly ? plan.yearlyPrice : plan.monthlyPrice}
                                    {plan.name !== SubscriptionType.ENTERPRISE && (
                                        <span className='text-lg font-normal'>{isYearly ? '/year' : '/month'}</span>
                                    )}
                                </p>
                                <ul className='space-y-2'>
                                    {plan.features.map((feature, fIndex) => (
                                        <li key={fIndex} className='flex items-center'>
                                            <Check className='mr-2 h-4 w-4 text-primary' />
                                            <span>{feature}</span>
                                        </li>
                                    ))}
                                </ul>
                            </CardContent>
                            <CardFooter>
                                <Button className='w-full' onClick={() => handleSubscription(plan)} disabled={isLoading}>
                                    {index === 2 ? 'Contact Sales' : 'Choose Plan'}
                                </Button>
                            </CardFooter>
                        </Card>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
};

export default function Component() {
    return (
        <>
            <SideNav>
                <div className='d-flex flex-col w-full mx-auto p-4'>
                    <Pricing />
                </div>
            </SideNav>
        </>
    );
}
