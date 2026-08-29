import { motion } from 'motion/react';
import { useState } from 'react';
import { CheckCircle2, Award, ArrowUpRight } from 'lucide-react';

const outcomes = [
  {
    number: "01",
    title: "Theories of Origin",
    description: "Explain key theories addressing the origins of women’s oppression (Goddess to God worship transitions, Eve and ideological othering, Shift of Production)."
  },
  {
    number: "02",
    title: "Explanatory Differentiation",
    description: "Differentiate ideological, materialist, and socio-political explanations for historical and contemporary gender inequality."
  },
  {
    number: "03",
    title: "Historical Context Analysis",
    description: "Analyze historical contexts influencing gender norms, division of labor, and the public vs. private domain dichotomy."
  },
  {
    number: "04",
    title: "Critical Theoretical Evaluation",
    description: "Critically evaluate classical (Liberal, Radical, Socialist, Postmodern) and contemporary (Intersectional, Postcolonial, Queer) feminist theories."
  },
  {
    number: "05",
    title: "Global Equality & Advocacy Reflection",
    description: "Reflect on implications for achieving gender equality globally through applied anti-discriminatory and anti-oppressive frameworks."
  }
];

export default function LearningOutcomes() {
  const [checkedItems, setCheckedItems] = useState<Record<number, boolean>>({});

  const toggleCheck = (idx: number) => {
    setCheckedItems(prev => ({
      ...prev,
      [idx]: !prev[idx]
    }));
  };

  const completedCount = Object.values(checkedItems).filter(Boolean).length;
  const progressPercent = Math.round((completedCount / outcomes.length) * 100);

  return (
    <section id="outcomes" className="bg-[#121212] p-8 md:p-14 text-white relative overflow-hidden rounded-sm scroll-mt-24 shadow-md">
      {/* Decorative gradient overlay */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
      
      <div className="relative z-10 max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-white/10"
        >
          <div>
            <span className="text-xs uppercase tracking-widest text-gray-400 font-semibold mb-2 block">
              Section 6 • Module Assessment Checklist
            </span>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-2">
              Intended Learning Outcomes (ILOs)
            </h2>
            <p className="text-xs md:text-sm text-gray-400 font-light max-w-xl">
              Upon completing this module, students will demonstrate comprehensive mastery across theoretical, historical, and applied advocacy benchmarks.
            </p>
          </div>

          <div className="bg-white/10 border border-white/15 p-4 rounded-sm flex items-center gap-4 shrink-0">
            <Award className="w-8 h-8 text-white" />
            <div>
              <span className="text-[10px] uppercase tracking-wider text-gray-400 block font-semibold">
                Self-Mastery Progress
              </span>
              <span className="text-lg font-bold text-white">
                {completedCount} of {outcomes.length} Verified ({progressPercent}%)
              </span>
            </div>
          </div>
        </motion.div>

        {/* ILO List */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {outcomes.map((outcome, idx) => {
            const isChecked = !!checkedItems[idx];
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.08 }}
                onClick={() => toggleCheck(idx)}
                className={`p-5 rounded-sm border transition-all duration-200 cursor-pointer flex items-start gap-4 ${
                  isChecked 
                    ? 'bg-white/15 border-white text-white' 
                    : 'bg-white/5 border-white/10 text-gray-300 hover:bg-white/10 hover:border-white/20'
                }`}
              >
                <button
                  type="button"
                  className="shrink-0 mt-0.5"
                  aria-label="Toggle learning outcome completion"
                >
                  <CheckCircle2 className={`w-5 h-5 transition-colors ${isChecked ? 'text-white fill-white/20' : 'text-gray-500'}`} />
                </button>

                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] font-mono font-bold text-gray-400">
                      ILO {outcome.number}
                    </span>
                    <h4 className="text-sm font-semibold text-white">
                      {outcome.title}
                    </h4>
                  </div>
                  <p className="text-xs text-gray-300 font-light leading-relaxed">
                    {outcome.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
