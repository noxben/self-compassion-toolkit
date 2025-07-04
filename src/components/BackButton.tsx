import React from 'react';
import { BackArrowIcon } from './icons';

interface BackButtonProps {
    onBack: () => void;
}

const BackButton: React.FC<BackButtonProps> = ({ onBack }) => {
    return (
        <button
            onClick={onBack}
            className="fixed bottom-5 right-5 bg-white p-3 rounded-full shadow-lg transition-opacity duration-300 hover:opacity-100 opacity-80 z-40"
            aria-label="Back to home"
        >
            <BackArrowIcon className="h-6 w-6 text-indigo-600" />
        </button>
    );
};

export default BackButton;
