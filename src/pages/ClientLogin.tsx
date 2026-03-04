import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/sonner';

export default function ClientLogin() {
    const navigate = useNavigate();
    const location = useLocation();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        if (params.get('registered') === 'true') {
            window.history.replaceState({}, '', location.pathname);
            toast.success('Account created successfully!', {
                description: 'You can now login to your Event Planner portal.',
                duration: 5000,
            });
        }
    }, [location]);

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        setTimeout(() => {
            // Credentials from original signup page logic
            if ((email === 'event@gmail.com' || email === 'admin@gmail.com') && password === '123') {
                toast.success('Login successful!');
                localStorage.setItem('currentUser', JSON.stringify({ email, type: 'client' }));
                navigate('/client/dashboard');
            } else {
                toast.error('Invalid email or password', {
                    description: 'Please use event@gmail.com and 123'
                });
            }
            setIsLoading(false);
        }, 800);
    };

    return (
        <div className="min-h-screen pt-20 flex items-center justify-center bg-background px-4">
            <div className="absolute inset-0 z-0 bg-secondary/30 pointer-events-none" />

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ type: "spring", stiffness: 300, damping: 25 }}
                className="max-w-md w-full z-10"
            >
                <div className="bg-card rounded-3xl p-8 md:p-10 border border-border shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-1.5 gradient-bg" />

                    <div className="text-center mb-10">
                        <h1 className="font-heading font-bold text-3xl text-foreground mb-3">Client Login</h1>
                        <p className="text-muted-foreground">Access your event planner portal</p>
                    </div>

                    <form onSubmit={handleLogin} className="space-y-6">
                        <div className="space-y-1.5">
                            <label className="text-sm font-semibold text-foreground px-1 block">Email Address</label>
                            <input
                                type="email"
                                required
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                className="w-full h-12 px-4 rounded-xl bg-secondary focus:bg-card text-foreground border border-border focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all outline-none text-sm"
                                placeholder="event@gmail.com"
                            />
                        </div>
                        <div className="space-y-1.5">
                            <div className="flex justify-between items-center px-1">
                                <label className="text-sm font-semibold text-foreground block">Password</label>
                                <button type="button" className="text-xs text-primary hover:underline font-medium">Forgot?</button>
                            </div>
                            <input
                                type="password"
                                required
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                className="w-full h-12 px-4 rounded-xl bg-secondary focus:bg-card text-foreground border border-border focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all outline-none text-sm"
                                placeholder="••••••"
                            />
                        </div>

                        <Button
                            type="submit"
                            className="w-full h-12 rounded-xl mt-4 gradient-bg text-primary-foreground font-bold shadow-lg shadow-primary/20 hover:shadow-primary/30 active:scale-[0.98] transition-all"
                            size="lg"
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <div className="flex items-center gap-2">
                                    <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                                    Logging in...
                                </div>
                            ) : 'Login'}
                        </Button>
                    </form>

                    <div className="mt-10 text-center pt-8 border-t border-border">
                        <p className="text-sm text-muted-foreground">
                            Don't have an account?{' '}
                            <Link to="/client/signup" className="text-primary font-bold hover:underline">
                                Join as Event Planner
                            </Link>
                        </p>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
