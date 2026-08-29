import { motion } from 'motion/react';
import { ShieldAlert, Users, Zap, CheckCircle, ArrowUpRight } from 'lucide-react';

const principles = [
  {
    icon: ShieldAlert,
    title: 'Combating Institutional Discrimination',
    subtitle: 'Structural Ideological Resistance',
    description: 'These theories focus on combating institutionalized discrimination maintained by powerful societal groups and ideologies.',
    details: 'Shifts analytical focus away from treating inequality as individual prejudice, targeting systemic gatekeeping in legal systems, educational bodies, and workplace hierarchies.'
  },
  {
    icon: Users,
    title: 'Generic Anti-Oppressive Approaches',
    subtitle: '1990s Integrated Evolution',
    description: 'In the 1990s, these frameworks began incorporating all forms of oppression into generic approaches to avoid creating a hierarchy of discrimination.',
    details: 'Acknowledges that racism, sexism, ableism, homophobia, and ageism share common roots in systemic dominance, advocating for cross-movement coalition building.'
  },
  {
    icon: Zap,
    title: 'Empowerment & Client Agency',
    subtitle: 'Subverting Systemic Power Imbalances',
    description: 'A core guideline of anti-oppressive practice is to empower clients to gain control, overcome systemic obstacles, and have their voices heard in decision-making.',
    details: 'Practitioners position marginalized individuals not as passive recipients of charity, but as active agents capable of shaping institutional decisions and community policies.'
  }
];

const actionablePillars = [
  {
    title: "Critical Self-Reflexivity",
    desc: "Practitioners continuously examine their own unearned social privilege, power dynamics, and unconscious institutional biases."
  },
  {
    title: "Dismantling Hierarchies",
    desc: "Redesigning organizational processes to foster non-hierarchical, democratic participatory decision-making models."
  },
  {
    title: "Systemic Advocacy",
    desc: "Mobilizing resources for structural policy changes rather than superficial tokenism or short-term band-aid remedies."
  }
];

export default function AntiOppressive() {
  return (
    <section id="anti-oppressive" className="relative py-8 overflow-hidden scroll-mt-24">
      <div className="relative z-10 flex flex-col gap-12">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-4">
            <div>
              <span className="text-xs uppercase tracking-widest text-gray-500 font-semibold mb-2 block">
                Section 5 • Applied Advocacy & Action
              </span>
              <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-[#121212]">
                Anti-Discriminatory & Anti-Oppressive Practice
              </h2>
            </div>
            <p className="text-sm text-gray-500 max-w-md font-light">
              Transforming theoretical paradigms into ethical, structural frameworks designed to dismantle power imbalances in public institutions and social practice.
            </p>
          </div>
          <div className="w-20 h-1 bg-[#000000]" />
        </motion.div>

        {/* 3 Core Principles Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {principles.map((item, idx) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.5, delay: idx * 0.15 }}
              className="p-7 bg-white border border-gray-200 shadow-xs rounded-sm hover:border-black transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-6">
                  <div className="w-10 h-10 rounded-sm bg-black text-white flex items-center justify-center">
                    <item.icon className="w-5 h-5" />
                  </div>
                </div>

                <span className="text-[10px] uppercase font-bold tracking-wider text-gray-400 block mb-1">
                  {item.subtitle}
                </span>
                <h3 className="text-lg font-bold mb-3 text-gray-900 leading-snug">
                  {item.title}
                </h3>
                
                <p className="text-gray-800 font-normal leading-relaxed text-xs md:text-sm mb-4">
                  "{item.description}"
                </p>

                <p className="text-gray-500 font-light leading-relaxed text-xs pt-4 border-t border-gray-100">
                  {item.details}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Actionable Pillars Banner */}
        <div className="bg-black text-white p-8 md:p-10 rounded-sm">
          <div className="flex flex-col lg:flex-row gap-8 items-start justify-between">
            <div className="max-w-md">
              <span className="text-xs uppercase tracking-widest text-gray-400 font-semibold block mb-2">
                Ethical Praxis in Action
              </span>
              <h3 className="text-2xl font-bold mb-3 tracking-tight">
                Pillars of Anti-Oppressive Advocacy
              </h3>
              <p className="text-xs text-gray-300 font-light leading-relaxed">
                Anti-oppressive frameworks require moving beyond passive non-discrimination toward active structural intervention, institutional accountability, and genuine power reallocation.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 flex-1">
              {actionablePillars.map((p, idx) => (
                <div key={idx} className="bg-white/5 border border-white/10 p-5 rounded-sm">
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle className="w-4 h-4 text-white" />
                    <h4 className="text-sm font-semibold">{p.title}</h4>
                  </div>
                  <p className="text-xs text-gray-300 font-light leading-relaxed">
                    {p.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
