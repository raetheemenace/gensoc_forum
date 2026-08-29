import { motion } from 'motion/react';

const members = [
  'Montes, Elana',
  'Unera, John Raven',
  'Rango, Khalid',
  'Rivera, Sebastian',
  'Anicete, Ace',
  'Casuga, Andrei',
  'Mendoza, Michael Louis',
  'Guerrero, Kyle'
];

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-100 py-12 md:py-16 mt-auto">
      <div className="max-w-7xl mx-auto px-6 w-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex flex-col md:flex-row justify-between items-start gap-12"
        >
          {/* Left Column */}
          <div>
            <span className="text-[#000000] font-medium tracking-wider uppercase text-xs mb-2 block">
              Course Information
            </span>
            <h3 className="text-xl font-bold text-[#121212] mb-1">
              GEE001B - Gender and Society
            </h3>
            <p className="text-gray-500 text-sm mb-6">
              Week 10 Module
            </p>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-gray-50 border border-gray-100 rounded-sm text-sm text-gray-600 font-medium">
              <span>Section:</span>
              <span className="text-[#121212]">IT31S3</span>
            </div>
          </div>

          {/* Right Column */}
          <div className="md:text-right">
            <span className="text-[#000000] font-medium tracking-wider uppercase text-xs mb-4 block md:inline-block md:mb-2">
              Group 1 Members
            </span>
            <ul className="grid grid-cols-2 gap-x-8 gap-y-2 text-sm text-gray-600 font-light text-left md:text-right">
              {members.map((member) => (
                <li key={member}>{member}</li>
              ))}
            </ul>
          </div>
        </motion.div>

        <div className="mt-16 pt-8 border-t border-gray-100 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-gray-400 font-light">
          <p>© {new Date().getFullYear()} Group 1. Educational purposes only.</p>
          <p>Designed for analytical and critical reflection.</p>
        </div>
      </div>
    </footer>
  );
}
