import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api';
import { Clock, ChevronRight, BarChart3 } from 'lucide-react';

const Home = () => {
    const [polls, setPolls] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPolls = async () => {
            try {
                const res = await api.get('/polls');
                setPolls(res.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchPolls();
    }, []);

    if (loading) return (
        <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
    );

    return (
        <div className="max-w-7xl mx-auto">
            <header className="mb-12 text-center">
                <h1 className="text-5xl font-extrabold mb-4 bg-gradient-to-r from-blue-400 to-indigo-600 bg-clip-text text-transparent">
                    Discover Public Polls
                </h1>
                <p className="text-neutral-400 text-lg">Voice your opinion or create a poll to get feedback instantly.</p>
            </header>

            <div className="grid gap-6">
                {polls.map((poll) => (
                    <Link key={poll._id} to={`/poll/${poll._id}`} className="block group">
                        <div className="p-6 rounded-2xl bg-neutral-800/50 border border-neutral-700 hover:border-blue-500/50 transition-all hover:shadow-[0_0_30px_-10px_rgba(59,130,246,0.3)] backdrop-blur-sm relative overflow-hidden">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h2 className="text-2xl font-bold group-hover:text-blue-400 transition-colors mb-2">{poll.title}</h2>
                                    <p className="text-neutral-400 line-clamp-2">{poll.description}</p>
                                </div>
                                {poll.isClosed ? (
                                    <span className="bg-red-500/10 text-red-500 text-xs font-bold px-3 py-1 rounded-full border border-red-500/20">Closed</span>
                                ) : (
                                    <span className="bg-green-500/10 text-green-500 text-xs font-bold px-3 py-1 rounded-full border border-green-500/20">Active</span>
                                )}
                            </div>
                            <div className="flex items-center gap-6 text-sm text-neutral-500">
                                <div className="flex items-center gap-2">
                                    <BarChart3 className="w-4 h-4" />
                                    <span>{poll.options.reduce((acc, opt) => acc + opt.votes, 0)} votes</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Clock className="w-4 h-4" />
                                    <span>{new Date(poll.createdAt).toLocaleDateString()}</span>
                                </div>
                            </div>
                            <ChevronRight className="absolute right-6 bottom-6 w-6 h-6 text-neutral-600 group-hover:text-blue-500 transition-all transform group-hover:translate-x-1" />
                        </div>
                    </Link>
                ))}
            </div>
            {polls.length === 0 && (
                <div className="text-center py-20 bg-neutral-800/30 rounded-3xl border border-dashed border-neutral-700">
                    <p className="text-neutral-500">No polls found. Be the first to create one!</p>
                </div>
            )}
        </div>
    );
};

export default Home;
