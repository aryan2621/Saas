'use client';

import { motion } from 'framer-motion';
import { Frown, Search } from 'lucide-react';
import Link from 'next/link';

export default function NotIssueFound() {
    return (
        <div className="max-w-2xl mx-auto p-8 bg-white dark:bg-gray-900 rounded-lg shadow-md text-center">
            <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 260, damping: 20 }}
            >
                <div className="flex justify-center mb-6">
                    <Search className="w-16 h-16 text-gray-400 dark:text-gray-600" />
                    <Frown className="w-16 h-16 text-gray-400 dark:text-gray-600" />
                </div>
            </motion.div>
            <motion.h2
                className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-4"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
            >
                Issue Not Found
            </motion.h2>
            <motion.p
                className="text-gray-600 dark:text-gray-400 mb-6"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
            >
                We couldn&apos;t find the issue you&apos;re looking for. Please
                check the issue and try again.
            </motion.p>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
            >
                <Link
                    href="/"
                    className="inline-block bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 px-6 py-2 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                >
                    Go Back
                </Link>
            </motion.div>
        </div>
    );
}
