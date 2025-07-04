import React, { useState } from 'react';
import useLocalStorage from '../hooks/useLocalStorage';
import { DEFAULT_IN_CONTROL_ITEMS, DEFAULT_NOT_CONTROL_ITEMS } from '../constants';
import { CheckIcon, XIcon, ExportIcon, IconProps } from './icons';

const ControlSection: React.FC = () => {
    const [inControlItems, setInControlItems] = useLocalStorage<string[]>('inControlItems', DEFAULT_IN_CONTROL_ITEMS);
    const [notControlItems, setNotControlItems] = useLocalStorage<string[]>('notControlItems', DEFAULT_NOT_CONTROL_ITEMS);
    const [newInControl, setNewInControl] = useState('');
    const [newNotControl, setNewNotControl] = useState('');

    const addItem = (list: 'in' | 'not') => {
        if (list === 'in' && newInControl.trim()) {
            setInControlItems(prev => [...prev, newInControl.trim()]);
            setNewInControl('');
        } else if (list === 'not' && newNotControl.trim()) {
            setNotControlItems(prev => [...prev, newNotControl.trim()]);
            setNewNotControl('');
        }
    };

    const removeItem = (list: 'in' | 'not', itemToRemove: string) => {
        if (list === 'in') {
            setInControlItems(prev => prev.filter(item => item !== itemToRemove));
        } else {
            setNotControlItems(prev => prev.filter(item => item !== itemToRemove));
        }
    };
    
    const exportLists = () => {
        let exportText = "What's In My Control\n\n";
        exportText += "✅ In My Control:\n";
        inControlItems.forEach(item => { exportText += `- ${item}\n`; });
        
        exportText += "\n❌ Not In My Control:\n";
        notControlItems.forEach(item => { exportText += `- ${item}\n`; });

        const blob = new Blob([exportText], { type: 'text/plain;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'my-control-list.txt';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    return (
        <div className="space-y-6">
            <div className="text-center">
                <h2 className="text-2xl font-bold text-green-800">What's in My Control</h2>
                <p className="text-green-700 chinese-text">我能控制的事情</p>
            </div>
            <div className="bg-white rounded-lg shadow-lg p-6">
                 <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-bold text-green-800">Control Exercise</h3>
                    <button onClick={exportLists} className="bg-green-600 hover:bg-green-700 text-white p-2 rounded-lg transition duration-300">
                        <ExportIcon className="h-5 w-5" />
                    </button>
                </div>
                <p className="text-gray-500 mb-4">Identify what you can and cannot control.</p>
                <div className="grid sm:grid-cols-2 gap-6">
                    <ControlList title="In My Control" items={inControlItems} onRemove={item => removeItem('in', item)} onAdd={() => addItem('in')} value={newInControl} setValue={setNewInControl} color="green" Icon={CheckIcon} />
                    <ControlList title="Not In My Control" items={notControlItems} onRemove={item => removeItem('not', item)} onAdd={() => addItem('not')} value={newNotControl} setValue={setNewNotControl} color="red" Icon={XIcon} />
                </div>
            </div>
        </div>
    );
};

interface ControlListProps {
    title: string;
    items: string[];
    onRemove: (item: string) => void;
    onAdd: () => void;
    value: string;
    setValue: (val: string) => void;
    color: 'green' | 'red';
    Icon: React.FC<IconProps>;
}

const ControlList: React.FC<ControlListProps> = ({ title, items, onRemove, onAdd, value, setValue, color, Icon }) => {
    const colors = {
        green: {
            text: 'text-green-800',
            bg: 'bg-green-50',
            ring: 'focus:ring-green-500',
            button: 'bg-green-600 hover:bg-green-700',
            iconText: 'text-green-700'
        },
        red: {
            text: 'text-red-800',
            bg: 'bg-red-50',
            ring: 'focus:ring-red-500',
            button: 'bg-red-600 hover:bg-red-700',
            iconText: 'text-red-700'
        }
    };
    const c = colors[color];
    
    return (
        <div>
            <h4 className={`flex items-center text-lg font-semibold ${c.iconText} mb-2`}>
                <Icon className="h-5 w-5 mr-2" />
                {title}
            </h4>
            <ul className={`space-y-2 mb-4 max-h-[200px] overflow-y-auto pr-1`}>
                {items.map((item, index) => (
                    <li key={index} className={`flex items-center justify-between ${c.bg} p-3 rounded-md group`}>
                        <span className={c.text}>{item}</span>
                        <button onClick={() => onRemove(item)} className={`opacity-0 group-hover:opacity-100 transition-opacity text-${color}-400 hover:text-${color}-600`}>
                            <XIcon className="h-4 w-4" />
                        </button>
                    </li>
                ))}
            </ul>
            <div className="flex">
                <input type="text" value={value} onChange={e => setValue(e.target.value)} onKeyDown={e => e.key === 'Enter' && onAdd()} placeholder="Add new item..." className={`flex-grow border border-gray-300 rounded-l-md px-3 py-2 focus:outline-none focus:ring-2 ${c.ring}`} />
                <button onClick={onAdd} className={`${c.button} text-white px-4 py-2 rounded-r-md`}>Add</button>
            </div>
        </div>
    );
};

export default ControlSection;