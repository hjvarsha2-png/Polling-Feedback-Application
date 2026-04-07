import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { AuthContext } from '../context/AuthContext';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Cell, Tooltip } from 'recharts';
import { MessageSquare, Lock, Unlock, Share2, CornerDownRight, Trash2 } from 'lucide-react';

const PollDetail = () => {
    const { id } = useParams();
    const { user } = useContext(AuthContext);
    const [poll, setPoll] = useState(null);
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    const [loading, setLoading] = useState(true);
    const [voting, setVoting] = useState(false);
    const navigate = useNavigate();

    const fetchPoll = async () => {
        try {
            const res = await api.get(`/polls/${id}`);
            setPoll(res.data);
            const commRes = await api.get(`/comments/${id}`);
            setComments(commRes.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPoll();
    }, [id]);

    const handleVote = async (index) => {
        if (!user) return navigate('/login');
        setVoting(true);
        try {
            await api.post(`/polls/${id}/vote`, { optionIndex: index });
            fetchPoll();
        } catch (err) {
            alert(err.response?.data?.message || 'Voting failed');
        } finally {
            setVoting(false);
        }
    };

    const handleClose = async () => {
        try {
            await api.put(`/polls/${id}/close`);
            fetchPoll();
        } catch (err) {
            console.error(err);
        }
    };

    const handleDelete = async () => {
        if (window.confirm('Are you sure you want to delete this poll? This action cannot be undone.')) {
            try {
                await api.delete(`/polls/${id}`);
                navigate('/');
            } catch (err) {
                alert(err.response?.data?.message || 'Deletion failed');
            }
        }
    };

    const handleComment = async (e) => {
        e.preventDefault();
        if (!newComment.trim()) return;
        try {
            const res = await api.post(`/comments/${id}`, { text: newComment });
            setComments([res.data, ...comments]);
            setNewComment('');
        } catch (err) {
            console.error(err);
        }
    };

    if (loading) return <div className="flex justify-center py-20 animate-pulse text-neutral-500">Loading poll...</div>;
    if (!poll) return <div className="text-center py-20 font-bold text-2xl">Poll not found</div>;

    const data = poll.options.map(opt => ({ name: opt.text, value: opt.votes || 0 }));
    const colors = ['#3b82f6', '#8b5cf6', '#ec4899', '#f97316', '#10b981'];

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <div className="bg-neutral-800/50 border border-neutral-700 p-8 rounded-3xl backdrop-blur-sm">
                <div className="flex justify-between items-start mb-6">
                    <div>
                        <h1 className="text-4xl font-bold mb-3">{poll.title}</h1>
                        <p className="text-neutral-400 text-lg">{poll.description}</p>
                    </div>
                    {user?.id === poll.creator && (
                        <div className="flex gap-2">
                            {!poll.isClosed && (
                                <button onClick={handleClose} className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-xl text-sm font-bold shadow-lg shadow-red-600/20 transition-all hover:scale-105">
                                    <Lock className="w-4 h-4" />
                                    Close Poll
                                </button>
                            )}
                            <button onClick={handleDelete} className="flex items-center gap-2 bg-neutral-700 hover:bg-red-600 text-white px-4 py-2 rounded-xl text-sm font-bold transition-all hover:scale-105">
                                <Trash2 className="w-4 h-4" />
                                Delete Poll
                            </button>
                        </div>
                    )}
                </div>

                {poll.hasVoted || poll.isClosed ? (
                    <div className="mt-8">
                        <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                            <Unlock className="w-5 h-5 text-blue-500" />
                            Results
                        </h3>
                        <div className="h-64 mt-4">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={data} layout="vertical">
                                    <XAxis type="number" hide />
                                    <YAxis dataKey="name" type="category" width={100} tick={{ fill: '#9ca3af' }} />
                                    <Tooltip cursor={{ fill: '#262626' }} contentStyle={{ backgroundColor: '#171717', border: '1px solid #404040', borderRadius: '12px' }} />
                                    <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                                        {data.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-4 mt-8">
                        <h3 className="text-xl font-bold mb-4">Cast Your Vote</h3>
                        {poll.options.map((opt, index) => (
                            <button
                                key={index}
                                onClick={() => handleVote(index)}
                                disabled={voting}
                                className="w-full text-left p-5 rounded-2xl bg-black/40 border border-neutral-700 hover:border-blue-500 transition-all hover:bg-blue-500/5 group"
                            >
                                <div className="flex justify-between items-center">
                                    <span className="text-lg font-medium group-hover:text-blue-400 transition-colors">{opt.text}</span>
                                    <div className="w-6 h-6 rounded-full border-2 border-neutral-600 group-hover:border-blue-500 flex items-center justify-center transition-all">
                                        <div className="w-3 h-3 rounded-full bg-blue-500 opacity-0 group-hover:opacity-100 transition-all"></div>
                                    </div>
                                </div>
                            </button>
                        ))}
                    </div>
                )}
            </div>

            <div className="space-y-6">
                <h3 className="text-2xl font-bold flex items-center gap-3">
                    <MessageSquare className="w-6 h-6 text-neutral-500" />
                    Feedback & Comments ({comments.length})
                </h3>

                {user ? (
                    <form onSubmit={handleComment} className="flex gap-4">
                        <input
                            type="text"
                            placeholder="Add a comment..."
                            className="flex-1 bg-neutral-800 border border-neutral-700 rounded-2xl py-3 px-6 outline-none focus:border-blue-500 transition-all"
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                        />
                        <button className="bg-white text-black font-bold px-8 rounded-2xl hover:bg-neutral-200 transition-all">Post</button>
                    </form>
                ) : (
                    <div className="bg-neutral-800/20 border border-neutral-700/50 p-4 rounded-2xl text-center text-neutral-500 italic">
                        Please login to add a comment
                    </div>
                )}

                <div className="space-y-4">
                    {comments.map((comment) => (
                        <div key={comment._id} className="p-5 bg-neutral-800/30 rounded-2xl border border-neutral-800 flex gap-4">
                            <div className="w-10 h-10 rounded-full bg-neutral-700 flex items-center justify-center font-bold text-blue-400">
                                {comment.user.username[0].toUpperCase()}
                            </div>
                            <div className="flex-1">
                                <div className="flex justify-between items-center mb-1">
                                    <span className="font-bold">{comment.user.username}</span>
                                    <span className="text-xs text-neutral-500">{new Date(comment.createdAt).toLocaleDateString()}</span>
                                </div>
                                <p className="text-neutral-300">{comment.text}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default PollDetail;
