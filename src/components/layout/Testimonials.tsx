import { motion } from 'framer-motion';
import { Star } from 'lucide-react';

export const Testimonials = ({ testimonials }: { testimonials: any[] }) => {
    return (
        <section className="section-padding bg-secondary/50">
            <div className="container-wide">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-12"
                >
                    <h2 className="font-heading font-bold text-3xl sm:text-4xl text-foreground mb-3">
                        What Our Clients Say
                    </h2>
                </motion.div>
                <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
                    {testimonials.map((t, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1 }}
                            className="bg-card rounded-xl p-6 border border-border card-elevated"
                        >
                            <div className="flex gap-1 mb-4">
                                {Array.from({ length: t.rating }).map((_, j) => (
                                    <Star key={j} size={16} className="fill-accent text-accent" />
                                ))}
                            </div>
                            <p className="text-card-foreground mb-4 text-sm leading-relaxed">"{t.text}"</p>
                            <div>
                                <p className="font-semibold text-sm text-card-foreground">{t.name}</p>
                                <p className="text-xs text-muted-foreground">{t.role}</p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};
