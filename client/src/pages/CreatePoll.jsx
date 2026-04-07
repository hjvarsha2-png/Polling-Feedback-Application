import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { Plus, Trash2, Send } from 'lucide-react';

const CreatePoll = () => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [options, setOptions] = useState(['', '']);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleAddOption = () => {
        setOptions([...options, '']);
    };

    const handleRemoveOption = (index) => {
        if (options.length > 2) {
            const newOptions = options.filter((_, i) => i !== index);
            setOptions(newOptions);
        }
    };

    const handleOptionChange = (index, value) => {
        const newOptions = [...options];
        newOptions[index] = value;
        setOptions(newOptions);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            await api.post('/polls', { title, description, options: options.filter(o => o.trim()) });
            navigate('/');
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to create poll');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl font-bold mb-8 text-center">Create New Poll</h1>
            <div className="bg-neutral-800 p-8 rounded-3xl border border-neutral-700 shadow-xl">
                {error && <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-3 rounded-xl mb-6">{error}</div>}
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-neutral-400 mb-2">Poll Title</label>
                        <input
                            type="text"
                            required
                            placeholder="What's on your mind?"
                            className="w-full bg-black/30 border border-neutral-700 rounded-xl py-3 px-4 focus:border-blue-500 outline-none transition-all"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-neutral-400 mb-2">Description (Optional)</label>
                        <textarea
                            placeholder="Add more details..."
                            className="w-full bg-black/30 border border-neutral-700 rounded-xl py-3 px-4 focus:border-blue-500 outline-none transition-all h-24 resize-none"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-neutral-400 mb-2">Options</label>
                        <div className="space-y-3">
                            {options.map((option, index) => (
                                <div key={index} className="flex gap-2">
                                    <input
                                        type="text"
                                        required
                                        placeholder={`Option ${index + 1}`}
                                        className="flex-1 bg-black/30 border border-neutral-700 rounded-xl py-3 px-4 focus:border-blue-500 outline-none transition-all"
                                        value={option}
                                        onChange={(e) => handleOptionChange(index, e.target.value)}
                                    />
                                    {options.length > 2 && (
                                        <button
                                            type="button"
                                            onClick={() => handleRemoveOption(index)}
                                            className="p-3 text-neutral-500 hover:text-red-500 hover:bg-red-500/10 rounded-xl transition-all"
                                        >
                                            <Trash2 className="w-5 h-5" />
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>
                        <button
                            type="button"
                            onClick={handleAddOption}
                            className="mt-4 flex items-center gap-2 text-blue-500 hover:text-blue-400 font-medium py-2 px-4 rounded-xl hover:bg-blue-500/10 transition-all border border-blue-500/20"
                        >
                            <Plus className="w-4 h-4" />
                            <span>Add Option</span>
                        </button>
                    </div>
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold py-4 rounded-2xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-blue-600/20 h-16 text-lg"
                    >
                        {loading ? 'Creating...' : (
                            <>
                                <Send className="w-5 h-5" />
                                <span>Publish Poll</span>
                            </>
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default CreatePoll;
