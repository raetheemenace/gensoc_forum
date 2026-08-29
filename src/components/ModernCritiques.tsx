import { motion } from 'motion/react';
import { Network, Globe, Shuffle, ArrowRight } from 'lucide-react';

const critiques = [
  {
    icon: Network,
    title: 'Intersectional & Black Feminism',
    citation: '[cite: 2]',
    subtitle: 'Critique of Universalized White Feminism',
    content: 'Early feminist theories often generalized oppression, which led to frameworks like Black feminism that prioritize the intersection of racism, sexism, and diverse experiences.',
    implications: [
      "Addresses how race, socioeconomic class, and gender interlock simultaneously to produce unique forms of marginalization.",
      "Rejects the assumption of a universal 'female experience' that historically centered bourgeois white Western women.",
      "Highlights the pioneering interventions of Combahee River Collective, Kimberlé Crenshaw, bell hooks, and Audre Lorde."
    ]
  },
  {
    icon: Globe,
    title: 'Postcolonial Feminism',
    citation: '[cite: 2]',
    subtitle: 'Decolonizing Gender & Cultural Hegemony',
    content: 'Highlights how colonialism imposed Western gender norms, erasing indigenous understandings of gender roles.',
    implications: [
      "Critiques the imperialist export of Victorian nuclear gender norms onto indigenous egalitarian societies.",
      "Challenges the 'Third World Woman' monolith portrayed in Western media as passive and universally helpless.",
      "Reclaims pre-colonial matriarchal traditions, indigenous kinship systems, and autonomous community leadership roles."
    ]
  },
  {
    icon: Shuffle,
    title: 'Queer Theory',
    citation: '[cite: 2]',
    subtitle: 'Disruption of the Heteronormative Binary',
    content: 'Disrupts traditional binary understandings of gender and sexuality, challenging the foundational categories of "man" and "woman."',
    implications: [
      "Posits gender as performative—an iterative social act rather than an innate biological essence.",
      "Deconstructs compulsory heterosexuality and the institutionalized policing of non-conforming gender expressions.",
      "Examines how state apparatuses enforce rigid categorization to maintain patriarchal power structures."
    ]
  }
];

export default function ModernCritiques() {
  return (
    <section id="modern-critiques" className="scroll-mt-24">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-100px' }}
        transition={{ duration: 0.6 }}
        className="mb-16 flex flex-col md:flex-row justify-between items-start md:items-end gap-6"
      >
        <div>
          <span className="text-xs uppercase tracking-widest text-gray-500 font-semibold mb-2 block">
            Section 4 • Contemporary Re-evaluations
          </span>
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-[#121212] mb-4">
            Modern Critiques & Evolving Perspectives
          </h2>
          <div className="w-20 h-1 bg-[#000000]" />
        </div>
        <p className="text-gray-500 max-w-md font-light text-sm md:text-right">
          Expanding the analytical discourse beyond monolithic frameworks to incorporate intersectionality, anti-colonial paradigms, and non-binary epistemologies.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {critiques.map((item, idx) => (
          <motion.div
            key={item.title}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.6, delay: idx * 0.15 }}
            className="group p-8 border border-gray-200 bg-white hover:shadow-md transition-all duration-300 rounded-sm flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-6">
                <div className="w-12 h-12 bg-gray-100 rounded-sm flex items-center justify-center group-hover:bg-black group-hover:text-white transition-colors duration-300">
                  <item.icon className="w-5 h-5 text-black group-hover:text-white transition-colors duration-300" />
                </div>
                <span className="text-[10px] bg-black text-white px-2 py-0.5 rounded-xs font-mono font-bold">
                  {item.citation}
                </span>
              </div>

              <span className="text-[11px] uppercase font-bold tracking-wider text-gray-400 block mb-1">
                {item.subtitle}
              </span>
              <h3 className="text-xl font-bold mb-3 text-gray-900 leading-snug">
                {item.title}
              </h3>
              
              <p className="text-gray-700 font-light leading-relaxed text-sm mb-6 pb-6 border-b border-gray-100">
                {item.content}
              </p>

              <div className="flex flex-col gap-2.5">
                <span className="text-[10px] uppercase font-bold tracking-wider text-gray-500">
                  Core Theoretical Interventions:
                </span>
                {item.implications.map((imp, impIdx) => (
                  <div key={impIdx} className="flex items-start gap-2 text-xs text-gray-600 font-light leading-relaxed">
                    <ArrowRight className="w-3.5 h-3.5 text-gray-400 shrink-0 mt-0.5" />
                    <span>{imp}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
