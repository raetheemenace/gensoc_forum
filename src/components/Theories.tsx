import { motion, AnimatePresence } from 'motion/react';
import { useState } from 'react';
import { BookOpen, Sparkles, Image as ImageIcon } from 'lucide-react';

const theories = [
  {
    id: 'theory-1',
    category: 'Theological & Spiritual Shift',
    title: 'Goddess Worship to God Worship',
    subtitle: 'From Reverence of Fertility to Violent Marginalization',
    description: "Early human civilizations celebrated and revered women for their fertility, a period characterized by goddess-based social organization. The transition from female-centric to male-centric worship was a slow, violent process that marginalized women's status.",
    analyticalPoints: [
      "Early matrilineal and matrifocal societies viewed female fertility and life-giving capacities as sacred cosmic forces.",
      "The rise of patriarchal deities coincided with militarism, conquest, and the systematic dismantling of female spiritual leadership.",
      "Women were gradually demoted from central spiritual conduits to subordinate subjects within male-dominated theological hierarchies."
    ],
    image: '/The_Just_Government_League_of_Maryland_marching_in_the_Womens_suffrage_parade_March_3_1913_main.jpg',
    imageCaption: 'Historical Record: Just Government League marching during the 1913 Women\'s Suffrage Procession'
  },
  {
    id: 'theory-2',
    category: 'Ideological & Moral Framing',
    title: 'Eve and the Other',
    subtitle: 'Religious Codification of Female Folly and Subordination',
    description: "Western religions introduced negative perceptions of women, often portraying them as feeble-minded. The Judeo-Christian story of Eve is a prime example, depicting a woman's folly as the cause of human suffering.",
    analyticalPoints: [
      "Institutionalized narratives constructed women as inherently morally frail, seductive, and in need of continuous patriarchal supervision.",
      "The Eve archetype served as a universal philosophical rationalization for denying women legal, educational, and civic autonomy.",
      "Established the philosophical dichotomy of 'Woman as Other'—defined solely in relation to or deviation from the male norm."
    ],
    image: '/Suffrage-March-UST1.jpg',
    imageCaption: 'Historical Record: Women organized against institutionalized theological and civic marginalization'
  },
  {
    id: 'theory-3',
    category: 'Materialist & Socioeconomic Shift',
    title: 'A Shift of Production',
    subtitle: 'Agrarian Expansion and the Subjugation of Reproductive Labor',
    description: "The societal shift from hunter-gathering to agriculture required immense manpower, turning reproduction into an essential, highly controlled task. Women were consequently reduced to passive incubators, whose primary role was producing the next generation of laborers.",
    analyticalPoints: [
      "The transition from foraging to sedentary farming created a structural demand for intense agricultural field labor.",
      "Female reproductive capacity became an economic asset under private property regimes, requiring strict control over female sexuality.",
      "Women's social position transitioned from egalitarian food providers to sequestered domestic producers of labor."
    ],
    image: '/suffragette-parade-washington-dc-on-march-3-1913-640.jpg',
    imageCaption: 'Historical Record: Suffragette mobilization reclaiming public sphere presence and bodily autonomy'
  }
];

export default function Theories() {
  const [activeTheory, setActiveTheory] = useState(theories[0].id);

  return (
    <section className="scroll-mt-24" id="origins">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-100px' }}
        transition={{ duration: 0.6 }}
        className="mb-12"
      >
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-4">
          <div>
            <span className="text-xs uppercase tracking-widest text-gray-500 font-semibold mb-2 block">
              Section 2 • Historical Roots & Paradigms
            </span>
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-[#121212]">
              Theories on the Origin of Women’s Oppression
            </h2>
          </div>
          <p className="text-sm text-gray-500 max-w-md font-light">
            Interactive inquiry examining theological, ideological, and materialist transitions that institutionalized systemic inequality throughout world history.
          </p>
        </div>
        <div className="w-20 h-1 bg-[#000000]" />
      </motion.div>

      {/* Quick Theory Switcher / Tabs for Mobile & Desktop */}
      <div className="grid grid-cols-3 gap-2 md:gap-3 mb-8">
        {theories.map((theory, idx) => {
          const isActive = activeTheory === theory.id;
          return (
            <button
              key={`tab-${theory.id}`}
              onClick={() => setActiveTheory(theory.id)}
              className={`p-3 md:p-4 text-left border rounded-sm transition-all duration-200 cursor-pointer flex flex-col justify-between ${
                isActive 
                  ? 'bg-black text-white border-black shadow-sm' 
                  : 'bg-white text-gray-700 border-gray-200 hover:border-black'
              }`}
            >
              <div className="flex items-center justify-between w-full mb-1">
                <span className={`text-[9px] md:text-[10px] font-mono uppercase tracking-wider ${isActive ? 'text-gray-300' : 'text-gray-500'}`}>
                  Paradigm 0{idx + 1}
                </span>
                <ImageIcon className="w-3.5 h-3.5 opacity-60" />
              </div>
              <span className="text-xs md:text-sm font-bold truncate block">
                {theory.title.split(' to ')[0]}
              </span>
            </button>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* Accordion / Interactive Selector */}
        <div className="lg:col-span-6 flex flex-col gap-5">
          {theories.map((theory, idx) => {
            const isActive = activeTheory === theory.id;
            return (
              <motion.div
                key={theory.id}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                onClick={() => setActiveTheory(theory.id)}
                className={`cursor-pointer border-l-2 p-5 md:p-7 transition-all duration-300 rounded-r-sm ${
                  isActive 
                    ? 'border-[#000000] bg-gray-50 shadow-xs' 
                    : 'border-gray-200 hover:border-gray-400 hover:bg-gray-50/50'
                }`}
              >
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="text-[11px] font-semibold tracking-wider uppercase text-gray-500">
                    {theory.category}
                  </span>
                </div>

                <h3 className={`text-xl md:text-2xl font-bold mb-1 tracking-tight ${isActive ? 'text-[#000000]' : 'text-gray-800'}`}>
                  {theory.title}
                </h3>
                <p className="text-xs text-gray-500 font-medium mb-3">
                  {theory.subtitle}
                </p>

                <AnimatePresence>
                  {isActive && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      {/* Mobile Dedicated Inline Image Display */}
                      <div className="block lg:hidden my-4 border border-gray-200 rounded-sm overflow-hidden bg-black text-white">
                        <div className="relative h-56 sm:h-64 w-full">
                          <img 
                            src={theory.image} 
                            alt={theory.title}
                            className="w-full h-full object-cover filter grayscale contrast-125"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent flex items-end p-3.5">
                            <div>
                              <div className="flex items-center gap-1.5 text-[10px] text-gray-300 font-semibold uppercase tracking-wider mb-1">
                                <BookOpen className="w-3 h-3" />
                                Archival Photo • {theory.title}
                              </div>
                              <p className="text-xs text-gray-200 font-light leading-snug">
                                {theory.imageCaption}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>

                      <p className="text-gray-700 leading-relaxed font-light text-sm pt-2 pb-4 border-t border-gray-200/60">
                        {theory.description}
                      </p>
                      
                      <div className="bg-white p-4 rounded-sm border border-gray-200/80 mb-2">
                        <span className="text-[10px] uppercase font-bold text-gray-500 tracking-wider block mb-2">
                          Key Analytical Mechanisms:
                        </span>
                        <ul className="flex flex-col gap-2">
                          {theory.analyticalPoints.map((point, pIdx) => (
                            <li key={pIdx} className="text-xs text-gray-600 font-light flex items-start gap-2 leading-relaxed">
                              <span className="w-1.5 h-1.5 bg-black rounded-full mt-1.5 shrink-0" />
                              <span>{point}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>

        {/* Large Desktop Visual Frame with Smooth Crossfade */}
        <div className="hidden lg:block lg:col-span-6 h-[580px] relative sticky top-8">
          {theories.map((theory) => (
            <motion.div
              key={`desktop-img-${theory.id}`}
              initial={false}
              animate={{ 
                opacity: activeTheory === theory.id ? 1 : 0,
                scale: activeTheory === theory.id ? 1 : 0.98,
                zIndex: activeTheory === theory.id ? 10 : 0
              }}
              transition={{ duration: 0.4, ease: 'easeInOut' }}
              className="absolute inset-0 w-full h-full flex flex-col pointer-events-none"
            >
              <div className="w-full h-full relative overflow-hidden bg-gray-100 rounded-sm border border-gray-200 shadow-sm">
                <div className="absolute inset-0 bg-[#121212]/20 z-10 mix-blend-multiply" />
                <img 
                  src={theory.image} 
                  alt={theory.title}
                  className="w-full h-full object-cover filter grayscale contrast-125"
                />
                <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black via-black/80 to-transparent z-20 text-white">
                  <div className="flex items-center gap-2 mb-1">
                    <BookOpen className="w-3.5 h-3.5 text-gray-300" />
                    <span className="text-[11px] uppercase tracking-wider font-semibold text-gray-300">
                      Historical Archive Reflection
                    </span>
                  </div>
                  <h4 className="text-base font-bold text-white mb-1">
                    {theory.title}
                  </h4>
                  <p className="text-xs text-gray-300 font-light leading-relaxed">
                    {theory.imageCaption}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

