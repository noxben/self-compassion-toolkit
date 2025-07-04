import React, { useState, useMemo } from 'react';
import useLocalStorage from '../hooks/useLocalStorage';
import { TinyWin } from '../types';
import { ExportIcon, SaveIcon } from './icons';

const WinsSection: React.FC = () => {
    const [wins, setWins] = useLocalStorage<TinyWin[]>('tinyWins', []);
    const [survived, setSurvived] = useState('');
    const [action, setAction] = useState('');
    const [selfcare, setSelfcare] = useState('');
    const [winsFilter, setWinsFilter] = useState<'all' | 'week'>('all');

    const handleSaveWin = (e: React.FormEvent) => {
        e.preventDefault();
        if (!survived && !action && !selfcare) {
            alert("Please fill out at least one field.");
            return;
        }
        const newWin: TinyWin = {
            date: new Date().toISOString(),
            survived,
            action,
            selfcare
        };
        setWins(prev => [newWin, ...prev]);
        setSurvived('');
        setAction('');
        setSelfcare('');
    };
    
    const filteredWins = useMemo(() => {
        if (winsFilter === 'week') {
            const oneWeekAgo = new Date();
            oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
            return wins.filter(win => new Date(win.date) >= oneWeekAgo);
        }
        return wins;
    }, [wins, winsFilter]);
    
    const exportWins = () => {
        if (wins.length === 0) {
            alert('No wins to export.');
            return;
        }
        let exportText = "My Tiny Wins\n\n";
        wins.forEach(win => {
            exportText += `Date: ${new Date(win.date).toLocaleDateString()}\n`;
            if(win.survived) exportText += `- I survived: ${win.survived}\n`;
            if(win.action) exportText += `- Action I took: ${win.action}\n`;
            if(win.selfcare) exportText += `- Self-care moment: ${win.selfcare}\n`;
            exportText += "\n";
        });
        const blob = new Blob([exportText], { type: 'text/plain;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'my-tiny-wins.txt';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    return (
        <div className="space-y-6">
            <div className="text-center">
                <h2 className="text-2xl font-bold text-amber-800">Tiny Wins Tracker</h2>
                <p className="text-amber-700 chinese-text">小小胜利记录</p>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-bold text-amber-800">Daily Progress</h3>
                    <button onClick={exportWins} className="bg-amber-600 hover:bg-amber-700 text-white p-2 rounded-lg transition duration-300">
                       <ExportIcon className="h-5 w-5" />
                    </button>
                </div>
                <p className="text-gray-500 mb-4">Celebrate your small victories each day.</p>
                <form onSubmit={handleSaveWin} className="space-y-4 mb-6">
                    <WinInput label="Something I survived today:" value={survived} setValue={setSurvived} placeholder="I survived..." />
                    <WinInput label="One small action I took:" value={action} setValue={setAction} placeholder="I took action by..." />
                    <WinInput label="One self-care moment:" value={selfcare} setValue={setSelfcare} placeholder="I cared for myself by..." />
                    <button type="submit" className="w-full bg-amber-600 hover:bg-amber-700 text-white font-bold py-3 px-4 rounded-lg transition duration-300 flex items-center justify-center">
                        <SaveIcon className="h-5 w-5 mr-2" />
                        Save Today's Wins
                    </button>
                </form>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6">
                 <div className="flex justify-between items-center mb-3">
                    <h3 className="text-lg font-semibold text-amber-800">Your Progress Journal</h3>
                    <div className="flex space-x-1">
                        <button onClick={() => setWinsFilter('all')} className={`px-3 py-1 rounded-md text-sm font-medium transition ${winsFilter === 'all' ? 'bg-amber-100 text-amber-800' : 'bg-amber-50 hover:bg-amber-200 text-amber-900'}`}>All</button>
                        <button onClick={() => setWinsFilter('week')} className={`px-3 py-1 rounded-md text-sm font-medium transition ${winsFilter === 'week' ? 'bg-amber-100 text-amber-800' : 'bg-amber-50 hover:bg-amber-200 text-amber-900'}`}>This Week</button>
                    </div>
                </div>
                <div className="space-y-4 wins-scroll max-h-96 overflow-y-auto pr-2">
                    {filteredWins.length > 0 ? filteredWins.map((win, index) => (
                        <div key={index} className="bg-amber-50 p-4 rounded-lg">
                            <p className="text-sm text-amber-900 font-semibold mb-2">{new Date(win.date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                            <ul className="list-disc list-inside space-y-1 text-amber-800">
                                {win.survived && <li><span className="font-medium">Survived:</span> {win.survived}</li>}
                                {win.action && <li><span className="font-medium">Action:</span> {win.action}</li>}
                                {win.selfcare && <li><span className="font-medium">Self-care:</span> {win.selfcare}</li>}
                            </ul>
                        </div>
                    )) : <p className="text-gray-500 text-center py-4">Your tiny wins will appear here.</p>}
                </div>
            </div>
        </div>
    );
};

interface WinInputProps {
    label: string;
    value: string;
    setValue: (val: string) => void;
    placeholder: string;
}

const WinInput: React.FC<WinInputProps> = ({ label, value, setValue, placeholder }) => (
    <div>
        <label className="block text-amber-800 font-medium mb-1">{label}</label>
        <input
            type="text"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder={placeholder}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500"
        />
    </div>
);

export default WinsSection;
