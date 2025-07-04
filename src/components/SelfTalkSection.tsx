import React, { useState } from 'react';
import { SelfTalkScript } from '../types';
import { SELF_TALK_SCRIPTS } from '../constants';

const SelfTalkSection: React.FC = () => {
    const [selectedScript, setSelectedScript] = useState<SelfTalkScript | null>(null);

    return (
        <div className="space-y-6">
            <div className="text-center">
                <h2 className="text-2xl font-bold text-blue-800">Self-Talk Helper</h2>
                <p className="text-blue-700 chinese-text">自我对话助手</p>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6">
                <h3 className="text-xl font-bold text-blue-800 mb-4">Calming Scripts</h3>
                <div className="bg-gradient-to-r from-blue-100 to-green-100 rounded-lg p-5 mb-4 min-h-[200px] flex flex-col items-center justify-center text-center">
                    {selectedScript ? (
                        <>
                            <h4 className="text-lg font-semibold text-teal-800 mb-3">{selectedScript.title}</h4>
                            <p className="text-teal-800 text-xl mb-2">{selectedScript.en}</p>
                            <p className="text-teal-700 text-lg chinese-text">{selectedScript.zh}</p>
                        </>
                    ) : (
                        <p className="text-teal-800 text-lg">Tap a button to see a self-talk script</p>
                    )}
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {SELF_TALK_SCRIPTS.map((script, index) => (
                        <button
                            key={index}
                            onClick={() => setSelectedScript(script)}
                            className="bg-teal-600 hover:bg-teal-700 text-white font-medium py-3 px-4 rounded-lg transition duration-300"
                        >
                            {script.title}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default SelfTalkSection;
