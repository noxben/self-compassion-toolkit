import React, { useState, useMemo } from 'react';
import { Affirmation } from '../types';
import useLocalStorage from '../hooks/useLocalStorage';
import { DEFAULT_AFFIRMATIONS } from '../constants';
import { RefreshIcon, PlusIcon, ExportIcon, BookmarkIcon, EditIcon, XIcon } from './icons';
import Modal from './Modal';

const AffirmationsSection: React.FC = () => {
    const [customAffirmations, setCustomAffirmations] = useLocalStorage<Affirmation[]>('customAffirmations', []);
    const [bookmarkedAffirmations, setBookmarkedAffirmations] = useLocalStorage<Affirmation[]>('bookmarkedAffirmations', []);
    const allAffirmations = useMemo(() => [...DEFAULT_AFFIRMATIONS, ...customAffirmations], [customAffirmations]);
    
    const [currentAffirmation, setCurrentAffirmation] = useState<Affirmation | null>(null);
    const [filter, setFilter] = useState<'all' | 'custom'>('all');

    const [isAddModalOpen, setAddModalOpen] = useState(false);
    const [isEditModalOpen, setEditModalOpen] = useState(false);
    const [editingAffirmation, setEditingAffirmation] = useState<Affirmation | null>(null);

    const getRandomAffirmation = () => {
        const randomIndex = Math.floor(Math.random() * allAffirmations.length);
        setCurrentAffirmation(allAffirmations[randomIndex]);
    };

    const isBookmarked = (affirmation: Affirmation | null) => {
        if (!affirmation) return false;
        return bookmarkedAffirmations.some(b => b.en === affirmation.en);
    };

    const toggleBookmark = (affirmation: Affirmation) => {
        if (isBookmarked(affirmation)) {
            setBookmarkedAffirmations(prev => prev.filter(b => b.en !== affirmation.en));
        } else {
            setBookmarkedAffirmations(prev => [...prev, affirmation]);
        }
    };
    
    const displayedBookmarks = useMemo(() => {
        if (filter === 'custom') {
            return bookmarkedAffirmations.filter(b => b.isCustom);
        }
        return bookmarkedAffirmations;
    }, [bookmarkedAffirmations, filter]);

    const handleAddAffirmation = (newAffirmation: {en: string, zh: string}) => {
        const affirmationToAdd: Affirmation = {...newAffirmation, isCustom: true};
        setCustomAffirmations(prev => [...prev, affirmationToAdd]);
        setAddModalOpen(false);
    }
    
    const handleEditAffirmation = (updatedAffirmation: Affirmation) => {
        setCustomAffirmations(prev => prev.map(a => a.en === editingAffirmation?.en ? updatedAffirmation : a));
        setBookmarkedAffirmations(prev => prev.map(b => b.en === editingAffirmation?.en ? updatedAffirmation : b));
        setEditModalOpen(false);
        setEditingAffirmation(null);
    }

    const handleDeleteBookmark = (affirmationToDelete: Affirmation) => {
        setBookmarkedAffirmations(prev => prev.filter(b => b.en !== affirmationToDelete.en));
    }
    
    const openEditModal = (affirmation: Affirmation) => {
        setEditingAffirmation(affirmation);
        setEditModalOpen(true);
    }
    
     const exportBookmarks = () => {
        if (bookmarkedAffirmations.length === 0) {
            alert('No bookmarked affirmations to export.');
            return;
        }
        let exportText = "My Affirmations\n\n";
        bookmarkedAffirmations.forEach(affirmation => {
            exportText += `${affirmation.en}\n${affirmation.zh || ''}\n\n`;
        });
        const blob = new Blob([exportText], { type: 'text/plain;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'my-affirmations.txt';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold text-indigo-900 text-center">Affirmations</h2>
            
            <div className="bg-white rounded-lg shadow-lg p-6">
                <h3 className="text-xl font-bold text-indigo-900 mb-4">Daily Affirmation</h3>
                <div className="bg-gradient-to-r from-indigo-100 to-purple-100 rounded-lg p-5 mb-4 min-h-[150px] flex items-center justify-center text-center">
                    {currentAffirmation ? (
                         <div className="w-full">
                            <p className="text-indigo-800 text-xl mb-2">{currentAffirmation.en}</p>
                            <p className="text-indigo-700 text-lg chinese-text">{currentAffirmation.zh}</p>
                            <div className="flex justify-center items-center mt-4 space-x-2">
                                <button onClick={() => toggleBookmark(currentAffirmation)} className={`p-2 text-indigo-600 hover:text-indigo-800 transition-colors`}>
                                    <BookmarkIcon className={`h-6 w-6 transition-colors duration-200 ${isBookmarked(currentAffirmation) ? 'fill-[#4c1d95] text-[#4c1d95]' : 'fill-none'}`} />
                                </button>
                                {currentAffirmation.isCustom && (
                                    <button onClick={() => openEditModal(currentAffirmation)} className="p-2 text-indigo-600 hover:text-indigo-800 transition-colors">
                                        <EditIcon className="h-6 w-6" />
                                    </button>
                                )}
                            </div>
                        </div>
                    ) : (
                        <p className="text-indigo-800 text-lg">Tap the button below to see your affirmation</p>
                    )}
                </div>
                <div className="flex space-x-2">
                    <button onClick={getRandomAffirmation} className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-4 rounded-lg transition duration-300 flex items-center justify-center">
                        <RefreshIcon className="h-5 w-5 mr-2"/> New Affirmation
                    </button>
                </div>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6">
                 <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-bold text-indigo-900">Bookmarked</h3>
                    <div className="flex items-center space-x-2">
                        <button onClick={() => setAddModalOpen(true)} className="p-2 text-indigo-600 hover:text-indigo-800"><PlusIcon className="w-5 h-5"/></button>
                        <button onClick={exportBookmarks} className="p-2 text-indigo-600 hover:text-indigo-800"><ExportIcon className="w-5 h-5"/></button>
                    </div>
                </div>
                <div className="flex space-x-1 mb-4">
                    <button onClick={() => setFilter('all')} className={`px-3 py-1 rounded-md text-sm font-medium transition ${filter === 'all' ? 'bg-indigo-100 text-indigo-800' : 'bg-indigo-50 hover:bg-indigo-200 text-indigo-700'}`}>All</button>
                    <button onClick={() => setFilter('custom')} className={`px-3 py-1 rounded-md text-sm font-medium transition ${filter === 'custom' ? 'bg-indigo-100 text-indigo-800' : 'bg-indigo-50 hover:bg-indigo-200 text-indigo-700'}`}>Custom</button>
                </div>
                <div className="space-y-3 max-h-80 overflow-y-auto pr-2">
                    {displayedBookmarks.length > 0 ? displayedBookmarks.map((affirmation, index) => (
                        <div key={index} className="bg-indigo-50 rounded-lg p-4 relative group transition-shadow hover:shadow-md">
                            <p className="text-indigo-800 font-medium pr-16">{affirmation.en}</p>
                            <p className="text-indigo-700 text-sm chinese-text pr-16">{affirmation.zh}</p>
                            <div className="absolute top-2 right-2 flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                               {affirmation.isCustom && <button onClick={() => openEditModal(affirmation)} className="p-1 text-indigo-400 hover:text-indigo-600"><EditIcon className="h-5 w-5"/></button>}
                                <button onClick={() => handleDeleteBookmark(affirmation)} className="p-1 text-indigo-400 hover:text-indigo-600"><XIcon className="h-5 w-5"/></button>
                            </div>
                        </div>
                    )) : (
                        <p className="text-gray-500 text-center py-4">Your bookmarked affirmations will appear here.</p>
                    )}
                </div>
            </div>

            <AffirmationModal 
                isOpen={isAddModalOpen} 
                onClose={() => setAddModalOpen(false)}
                onSave={handleAddAffirmation}
                title="Add Custom Affirmation"
            />
            {editingAffirmation && (
                <AffirmationModal 
                    isOpen={isEditModalOpen} 
                    onClose={() => setEditModalOpen(false)}
                    onSave={(data) => handleEditAffirmation({ ...data, isCustom: true })}
                    title="Edit Affirmation"
                    initialData={editingAffirmation}
                />
            )}
        </div>
    );
};

interface AffirmationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (data: { en: string, zh: string }) => void;
    title: string;
    initialData?: { en: string, zh: string };
}

const AffirmationModal: React.FC<AffirmationModalProps> = ({ isOpen, onClose, onSave, title, initialData }) => {
    const [en, setEn] = useState(initialData?.en || '');
    const [zh, setZh] = useState(initialData?.zh || '');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (en.trim()) {
            onSave({ en, zh });
            setEn('');
            setZh('');
        }
    };
    
    React.useEffect(() => {
        if(initialData) {
            setEn(initialData.en);
            setZh(initialData.zh);
        } else {
            setEn('');
            setZh('');
        }
    }, [initialData]);

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-indigo-900">{title}</h3>
                <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
                    <XIcon className="h-6 w-6"/>
                </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-indigo-800 font-medium mb-2">English Affirmation:</label>
                    <textarea value={en} onChange={e => setEn(e.target.value)} className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500" rows={3} placeholder="Enter your affirmation in English..." required></textarea>
                </div>
                 <div>
                    <label className="block text-indigo-800 font-medium mb-2">Mandarin Translation (optional):</label>
                    <textarea value={zh} onChange={e => setZh(e.target.value)} className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 chinese-text" rows={3} placeholder="Enter Mandarin translation if available..."></textarea>
                </div>
                <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-4 rounded-lg transition duration-300">Save Affirmation</button>
            </form>
        </Modal>
    );
};


export default AffirmationsSection;
