import { useState } from 'react';
import { TrackingSearch } from '../components/TrackingSearch';
import { TrackingResult } from '../components/TrackingResult';
import { dbService } from '../services/dbService';
import { Parcel } from '../types';
import { motion } from 'motion/react';
import { ShieldCheck, Search, Package } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Home() {
  const [result, setResult] = useState<Parcel | null | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(false);

  const handleSearch = (id: string) => {
    setIsLoading(true);
    // Simulate network delay
    setTimeout(() => {
      const parcel = dbService.getParcelByTrackingId(id);
      setResult(parcel || null);
      setIsLoading(false);
    }, 800);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-blue-900 py-6 px-4 shadow-lg">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center font-bold text-blue-900 text-xl">
              NP
            </div>
            <h1 className="text-white text-2xl font-bold tracking-tight">Neo Pay Service</h1>
          </div>
          <Link 
            to="/admin/login" 
            className="flex items-center gap-2 text-blue-100 hover:text-white transition-colors text-sm font-medium"
          >
            <ShieldCheck className="h-4 w-4" />
            Espace Admin
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-4 py-16 md:py-24">
        <div className="text-center mb-12">
          <motion.h2 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-6xl font-extrabold text-slate-900 mb-6 tracking-tight"
          >
            Suivez votre colis en <span className="text-blue-600">temps réel</span>
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-lg text-slate-600 max-w-2xl mx-auto"
          >
            Entrez votre numéro de suivi Neo Pay Service pour connaître l'état actuel et la localisation de votre livraison.
          </motion.p>
        </div>

        <TrackingSearch onSearch={handleSearch} isLoading={isLoading} />

        <div className="mt-12">
          {result === null && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center p-8 bg-red-50 border border-red-100 rounded-2xl max-w-md mx-auto"
            >
              <p className="text-red-800 font-medium">Aucun colis trouvé avec ce numéro de suivi.</p>
              <p className="text-red-600 text-sm mt-1">Veuillez vérifier le numéro et réessayer.</p>
            </motion.div>
          )}

          {result && <TrackingResult parcel={result} />}
        </div>
      </main>

      {/* Features */}
      <section className="bg-slate-50 py-20 border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-12">
          <div className="space-y-4">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center text-blue-900">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-900">Sécurisé</h3>
            <p className="text-slate-600">Vos données de livraison sont protégées et accessibles uniquement via votre numéro de suivi unique.</p>
          </div>
          <div className="space-y-4">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center text-blue-900">
              <motion.div animate={{ rotate: 360 }} transition={{ duration: 4, repeat: Infinity, ease: "linear" }}>
                <Search className="h-6 w-6" />
              </motion.div>
            </div>
            <h3 className="text-xl font-bold text-slate-900">Rapide</h3>
            <p className="text-slate-600">Obtenez des informations instantanées sur vos colis sans avoir à créer de compte.</p>
          </div>
          <div className="space-y-4">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center text-blue-900">
              <Package className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-900">Fiable</h3>
            <p className="text-slate-600">Neo Pay Service assure un suivi précis de chaque étape du transport jusqu'à votre porte.</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white py-12 border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-slate-400 text-sm">© 2026 Neo Pay Service. Tous droits réservés.</p>
        </div>
      </footer>
    </div>
  );
}
