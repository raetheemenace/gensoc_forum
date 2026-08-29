import { motion } from 'motion/react';
import { useState } from 'react';
import { Scale, Flame, DollarSign, MessageCircle } from 'lucide-react';

const coreTheories = [
  {
    id: 'liberal',
    title: 'Liberal Feminism',
    icon: Scale,
    tagline: 'Gradualist Institutional & Legal Reform',
    content: "A gradualist approach that seeks to improve women's position by promoting equal opportunity through legislation and challenging unequal socialization processes.",
    diagnosis: "Rooted in customary beliefs, legal discrimination, and unequal early childhood socialization that restricts women's civil potential.",
    praxis: "Legislative lobbying, judicial reform, equal pay mandates, institutional policy revision, and dismantling gendered educational barriers.",
    strengths: "Achieved widespread constitutional and legislative enfranchisement, formal workplace entry, and reproductive rights protections.",
    critique: "Frequently focuses on individual advancement within existing capitalist structures without challenging deeper patriarchal foundations."
  },
  {
    id: 'radical',
    title: 'Radical Feminism',
    icon: Flame,
    tagline: 'Patriarchal Dismantling & Structural Revolution',
    content: "Focuses on patriarchy and men's systemic privilege, arguing that personal miseries experienced by women are actually political issues rooted in power imbalances.",
    diagnosis: "Patriarchy is the foundational, most pervasive system of power; male control over female bodies, reproduction, and sexuality constitutes primary subordination.",
    praxis: "'The Personal is Political' — re-evaluating domestic violence, sexual harassment, rape culture, and creating autonomous female solidarity spaces.",
    strengths: "Brought taboo issues (domestic violence, sexual violence, reproductive control) into mainstream political and legal consciousness.",
    critique: "Can risk essentializing gender categories by treating 'women' and 'men' as homogeneous, universally adversarial classes."
  },
  {
    id: 'socialist',
    title: 'Socialist / Marxist Feminism',
    icon: DollarSign,
    tagline: 'Capitalist Property & Class Critique',
    content: "Attributes women's oppression to the private property system within capitalist and class-based social structures.",
    diagnosis: "Capitalism relies on unpaid reproductive care work (cooking, cleaning, childbearing) performed by women to subsidize and replenish the labor force.",
    praxis: "Dual-systems theory: Overthrowing capitalism and class hierarchy simultaneously with patriarchal property ownership.",
    strengths: "Connects gender subordination directly to socioeconomic mode of production, labor exploitation, and welfare systems.",
    critique: "Historical Marxist movements at times subordinated gender emancipation as secondary to the overarching proletarian class revolution."
  },
  {
    id: 'postmodern',
    title: 'Postmodern Feminism',
    icon: MessageCircle,
    tagline: 'Linguistic Deconstruction & Multiplicity',
    content: "Focuses on how societal discourse and language create assumptions about women, acknowledging the complexity and diversity of social relations.",
    diagnosis: "Power operates through discourse, cultural narratives, and language systems that construct binary categories (male/female, rational/emotional).",
    praxis: "Deconstructing dominant narratives, questioning universal 'womanhood', celebrating plurality, fluidity, and localized resistance.",
    strengths: "Rejects rigid dogmatism and opens space for multiple subjective truths and diverse cultural realities.",
    critique: "Hyper-relativism can sometimes impede broad-based, collective political mobilization and unified policy agendas."
  }
];

export default function FeministTheories() {
  const [activeTab, setActiveTab] = useState(coreTheories[0].id);
  const activeTheory = coreTheories.find(t => t.id === activeTab) || coreTheories[0];

  return (
    <section id="feminist-theories" className="scroll-mt-24">
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
              Section 3 • Epistemological Frameworks
            </span>
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-[#121212]">
              Core Feminist Theories
            </h2>
          </div>
          <p className="text-sm text-gray-500 max-w-md font-light">
            Examine how four dominant paradigms formulate diagnoses, analytical frameworks, and practical strategies for dismantling gender oppression.
          </p>
        </div>
        <div className="w-20 h-1 bg-[#000000]" />
      </motion.div>

      <div className="bg-white border border-gray-200 shadow-xs rounded-sm overflow-hidden">
        {/* Navigation Tabs */}
        <div className="grid grid-cols-2 md:grid-cols-4 border-b border-gray-200 bg-gray-50/50">
          {coreTheories.map((theory) => {
            const isCurrent = activeTab === theory.id;
            const Icon = theory.icon;
            return (
              <button
                key={theory.id}
                onClick={() => setActiveTab(theory.id)}
                className={`py-4 px-4 text-xs sm:text-sm font-semibold tracking-wide transition-all relative flex items-center justify-center gap-2 cursor-pointer ${
                  isCurrent 
                    ? 'text-black bg-white shadow-xs' 
                    : 'text-gray-500 hover:text-black hover:bg-gray-100/60'
                }`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span className="truncate">{theory.title}</span>
                {isCurrent && (
                  <motion.div
                    layoutId="activeTabIndicator"
                    className="absolute bottom-0 left-0 right-0 h-[2px] bg-black"
                    initial={false}
                    transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                  />
                )}
              </button>
            );
          })}
        </div>

        {/* Tab Content Display */}
        <div className="p-6 md:p-12">
          <motion.div
            key={activeTheory.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
            className="flex flex-col gap-8"
          >
            {/* Header Box */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-gray-100">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs uppercase font-bold tracking-widest text-gray-500">
                    {activeTheory.tagline}
                  </span>
                </div>
                <h3 className="text-2xl md:text-3xl font-bold text-gray-900 tracking-tight">
                  {activeTheory.title}
                </h3>
              </div>
            </div>

            {/* Core Definition Banner */}
            <div className="bg-gray-50 p-6 rounded-sm border-l-4 border-black">
              <span className="text-[10px] uppercase tracking-wider font-bold text-gray-500 block mb-1">
                Core Theoretical Definition:
              </span>
              <p className="text-base md:text-lg text-gray-800 font-light leading-relaxed">
                "{activeTheory.content}"
              </p>
            </div>

            {/* Comparative Breakdown Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-5 border border-gray-200 rounded-sm bg-white">
                <span className="text-xs font-bold uppercase tracking-wider text-black block mb-2">
                  1. Diagnosis of Oppression
                </span>
                <p className="text-xs md:text-sm text-gray-600 font-light leading-relaxed">
                  {activeTheory.diagnosis}
                </p>
              </div>

              <div className="p-5 border border-gray-200 rounded-sm bg-white">
                <span className="text-xs font-bold uppercase tracking-wider text-black block mb-2">
                  2. Strategic Method & Praxis
                </span>
                <p className="text-xs md:text-sm text-gray-600 font-light leading-relaxed">
                  {activeTheory.praxis}
                </p>
              </div>

              <div className="p-5 border border-gray-200 rounded-sm bg-white">
                <span className="text-xs font-bold uppercase tracking-wider text-black block mb-2">
                  3. Key Contributions
                </span>
                <p className="text-xs md:text-sm text-gray-600 font-light leading-relaxed">
                  {activeTheory.strengths}
                </p>
              </div>

              <div className="p-5 border border-gray-200 rounded-sm bg-white">
                <span className="text-xs font-bold uppercase tracking-wider text-black block mb-2">
                  4. Theoretical Critique & Limits
                </span>
                <p className="text-xs md:text-sm text-gray-600 font-light leading-relaxed">
                  {activeTheory.critique}
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
