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
                    className="max-w-5xl mx-auto"
                >
                    <motion.p variants={itemVariants} className="text-white font-semibold text-sm tracking-widest uppercase mb-4">
                        India's #1 Artist Booking Platform
                    </motion.p>
                    <motion.h1
                        variants={itemVariants}
                        className="font-heading font-bold text-2xl sm:text-4xl md:text-5xl text-white leading-tight mb-6"
                    >
                        Book Live Artist For Events
                    </motion.h1>

                    <motion.div
                        variants={itemVariants}
                        className="flex flex-col sm:flex-row gap-3 max-w-xl mx-auto mb-12"
                    >
                        <div className="flex-1 relative">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
                            <input
                                type="text"
                                placeholder="Search Artists, Categories, Cities..."
                                className="w-full h-12 pl-12 pr-4 rounded-xl bg-white text-foreground placeholder:text-muted-foreground border-none focus:ring-2 focus:ring-primary outline-none text-sm"
                            />
                        </div>
                        <Link to="/search">
                            <Button size="lg" className="h-12 px-8 rounded-xl w-full sm:w-auto bg-red-600 hover:bg-red-700 text-white shadow-lg shadow-red-600/20">
                                Explore <ArrowRight size={18} className="ml-2" />
                            </Button>
                        </Link>
                    </motion.div>

                    <motion.div variants={itemVariants} className="flex flex-wrap justify-center gap-10 md:gap-20 pt-8">
                        <div className="text-center flex flex-col items-center min-w-[120px]">
                            <div className="text-xl md:text-2xl font-heading font-bold text-white mb-2 tracking-tight">20000+</div>
                            <div className="w-full h-[1px] bg-white mb-3 shadow-[0_0_10px_rgba(255,255,255,0.3)]" />
                            <div className="text-sm md:text-base text-white font-light tracking-wide">Bookings</div>
                        </div>
                        <div className="text-center flex flex-col items-center min-w-[120px]">
                            <div className="text-xl md:text-2xl font-heading font-bold text-white mb-2 tracking-tight">15000+</div>
                            <div className="w-full h-[1px] bg-white mb-3 shadow-[0_0_10px_rgba(255,255,255,0.3)]" />
                            <div className="text-sm md:text-base text-white font-light tracking-wide leading-tight">
                                Live<br />Entertainers
                            </div>
                        </div>
                        <div className="text-center flex flex-col items-center min-w-[120px]">
                            <div className="text-xl md:text-2xl font-heading font-bold text-white mb-2 tracking-tight">50+</div>
                            <div className="w-full h-[1px] bg-white mb-3 shadow-[0_0_10px_rgba(255,255,255,0.3)]" />
                            <div className="text-sm md:text-base text-white font-light tracking-wide">Cities</div>
                        </div>
                    </motion.div>
                </motion.div>
            </div>
        </section>
    );
}
