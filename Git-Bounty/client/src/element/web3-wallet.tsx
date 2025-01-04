import React, { useState } from 'react';
import {
    useConnect,
    useAddress,
    useDisconnect,
    metamaskWallet,
} from '@thirdweb-dev/react';
import { Button } from '@/components/ui/button';
import { Loader2Icon } from 'lucide-react';

const CustomConnectWallet = () => {
    const address = useAddress();
    const connect = useConnect();
    const disconnect = useDisconnect();
    const metamaskConfig = metamaskWallet({
        connectionMethod: 'walletConnect',
    });
    const [connecting, setConnecting] = useState(false);

    const handleConnect = async () => {
        try {
            setConnecting(true);
            await connect(metamaskConfig);
        } catch (error) {
            console.error('Failed to connect:', error);
        } finally {
            setConnecting(false);
        }
    };
    const handleDisconnect = async () => {
        try {
            await disconnect();
        } catch (error) {
            console.error('Failed to disconnect:', error);
        }
    };
    if (address) {
        return (
            <Button onClick={handleDisconnect}>
                Disconnect {address.slice(0, 6)}...{address.slice(-4)}
            </Button>
        );
    }
    return (
        <Button onClick={handleConnect} disabled={connecting}>
            {connecting ? (
                <>
                    <Loader2Icon className="w-4 h-4 animate-spin" />
                    <span>Connecting...</span>
                </>
            ) : (
                'Connect Wallet'
            )}
        </Button>
    );
};

export default CustomConnectWallet;
