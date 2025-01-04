'use client';
import { motion } from 'framer-motion';
export default function DataBlockLoader({
    size = 200,
    color = 'text-primary',
}: {
    size?: number;
    color?: string;
}) {
    const blockSize = size / 5;
    const gap = size / 20;

    return (
        <div className="flex items-center justify-center" role="status">
            <div className="relative" style={{ width: size, height: size }}>
                {[...Array(9)].map((_, index) => {
                    const row = Math.floor(index / 3);
                    const col = index % 3;
                    return (
                        <motion.div
                            key={index}
                            className={`absolute ${color} bg-current rounded-md`}
                            style={{
                                width: blockSize,
                                height: blockSize,
                                left: col * (blockSize + gap),
                                top: row * (blockSize + gap),
                            }}
                            initial={{ opacity: 0.3, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{
                                duration: 0.8,
                                repeat: Infinity,
                                repeatType: 'reverse',
                                delay: index * 0.1,
                            }}
                        />
                    );
                })}
            </div>
            <span className="sr-only">Loading blockchain data blocks...</span>
        </div>
    );
}
