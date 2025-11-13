import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { faqData } from '@/data/faq';
import { useIntersectionReveal } from '@/hooks/useIntersectionReveal';
import { cn } from '@/lib/utils';

export const Faq = () => {
  const { ref, isVisible } = useIntersectionReveal();
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleItem = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      toggleItem(index);
    }
  };

  return (
    <section
      ref={ref}
      className={cn(
        'py-20 bg-secondary/50',
        isVisible && 'reveal-in'
      )}
    >
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
            PERGUNTAS FREQUENTES
          </h2>
          <p className="text-lg text-foreground/70 max-w-2xl mx-auto">
            Tire suas dúvidas sobre nossos cursos e procedimentos
          </p>
        </div>

        <div className="max-w-3xl mx-auto space-y-4">
          {faqData.map((item, index) => {
            const isOpen = openIndex === index;
            
            return (
              <div key={index} className="glass rounded-xl overflow-hidden">
                <button
                  onClick={() => toggleItem(index)}
                  onKeyDown={(e) => handleKeyDown(e, index)}
                  className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-white/[0.02] transition-colors focus-ring"
                  aria-expanded={isOpen}
                  aria-controls={`faq-answer-${index}`}
                >
                  <span className="font-semibold pr-8">{item.question}</span>
                  <ChevronDown
                    className={cn(
                      'h-5 w-5 text-primary flex-shrink-0 transition-transform duration-200',
                      isOpen && 'rotate-180'
                    )}
                  />
                </button>
                
                {isOpen && (
                  <div
                    id={`faq-answer-${index}`}
                    className="px-6 pb-4 text-foreground/70 animate-accordion-down"
                  >
                    {item.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
