import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Search, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { stats } from '@/data/mockData';
import heroBg from '@/assets/hero-bg.jpg';

const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};
const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

export default function Hero() {
    return (
        <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
            <div className="absolute inset-0">
                <img src={heroBg} alt="Concert" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-b from-foreground/70 via-foreground/50 to-foreground/80" />
            </div>
            <div className="relative z-10 container-wide text-center py-20">
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="max-w-4xl mx-auto"
                >
                    <motion.p variants={itemVariants} className="text-white font-semibold text-sm tracking-widest uppercase mb-4">
                        India's #1 Artist Booking Platform
                    </motion.p>
                    <motion.h1
                        variants={itemVariants}
                        className="font-heading font-bold text-4xl sm:text-5xl md:text-7xl text-white leading-tight mb-6"
                    >
                        Book incredible live artists for your events
                    </motion.h1>
                    <motion.p variants={itemVariants} className="text-lg sm:text-xl text-white/80 mb-10 max-w-2xl mx-auto">
                        Discover singers, DJs, bands, comedians and more. From intimate parties to grand celebrations.
                    </motion.p>

                    <motion.div
                        variants={itemVariants}
                        className="flex flex-col sm:flex-row gap-3 max-w-xl mx-auto mb-8"
                    >
                        <div className="flex-1 relative">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
                            <input
                                type="text"
                                placeholder="Search artists, categories, cities..."
                                className="w-full h-12 pl-12 pr-4 rounded-xl bg-background text-foreground placeholder:text-muted-foreground border-none focus:ring-2 focus:ring-primary outline-none text-sm"
                            />
                        </div>
                        <Link to="/search">
                            <Button size="lg" className="h-12 px-8 rounded-xl w-full sm:w-auto">
                                Explore <ArrowRight size={18} className="ml-2" />
                            </Button>
                        </Link>
                    </motion.div>

                    <motion.div variants={itemVariants} className="flex flex-wrap justify-center gap-6">
                        {stats.map((stat) => (
                            <div key={stat.label} className="text-center">
                                <div className="text-2xl font-heading font-bold text-primary-foreground">{stat.value}</div>
                                <div className="text-xs text-primary-foreground/60">{stat.label}</div>
                            </div>
                        ))}
                    </motion.div>
                </motion.div>
            </div>
        </section>
    );
}
