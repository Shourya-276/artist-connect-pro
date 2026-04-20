import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Shield, Lock, Mail } from 'lucide-react';
import { toast } from 'sonner';

export default function AdminLogin() {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        if (email === 'admin@gmail.com' && password === '123') {
            toast.success('Admin access granted');
            navigate('/admin');
        } else {
            toast.error('Invalid admin credentials');
        }
    };

    return (
        <div className="min-h-screen pt-20 bg-background flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="max-w-md w-full bg-card border border-border rounded-2xl p-8 card-elevated"
            >
                <div className="text-center mb-8">
                    <div className="w-16 h-16 rounded-2xl gradient-bg flex items-center justify-center mx-auto mb-4 shadow-lg shadow-primary/20">
                        <Shield size={32} className="text-primary-foreground" />
                    </div>
                    <h1 className="font-heading font-bold text-2xl text-foreground">Admin Portal</h1>
                    <p className="text-sm text-muted-foreground mt-2">Enter your secure credentials to access the command center</p>
                </div>

                <form onSubmit={handleLogin} className="space-y-4">
                    <div className="space-y-1">
                        <label className="text-sm font-medium text-foreground">Admin Email</label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                            <input
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="admin@gmail.com"
                                className="w-full h-11 pl-10 pr-4 rounded-xl bg-secondary text-foreground border border-border focus:ring-2 focus:ring-primary outline-none text-sm transition-all"
                            />
                        </div>
                    </div>

                    <div className="space-y-1">
                        <label className="text-sm font-medium text-foreground">Security Password</label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                            <input
                                type="password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                                className="w-full h-11 pl-10 pr-4 rounded-xl bg-secondary text-foreground border border-border focus:ring-2 focus:ring-primary outline-none text-sm transition-all"
                            />
                        </div>
                    </div>

                    <Button type="submit" className="w-full h-11 rounded-xl mt-4 font-bold tracking-wide">
                        Access Dashboard
                    </Button>
                </form>

                <div className="mt-8 pt-6 border-t border-border text-center">
                    <p className="text-xs text-muted-foreground">
                        Unauthorized access is strictly prohibited and monitored.
                    </p>
                </div>
            </motion.div>
        </div>
    );
}
