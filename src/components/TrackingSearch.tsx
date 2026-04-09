import { useState } from 'react';
import { Search } from 'lucide-react';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { motion } from 'motion/react';

interface TrackingSearchProps {
  onSearch: (id: string) => void;
  isLoading?: boolean;
}

export function TrackingSearch({ onSearch, isLoading }: TrackingSearchProps) {
  const [trackingId, setTrackingId] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (trackingId.trim()) {
      onSearch(trackingId.trim());
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-xl mx-auto"
    >
      <form onSubmit={handleSubmit} className="relative flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
          <Input
            type="text"
            placeholder="Entrez votre numéro de suivi (ex: NEO123...)"
            className="pl-10 h-14 text-lg border-2 border-slate-200 focus:border-blue-600 transition-colors rounded-xl shadow-sm"
            value={trackingId}
            onChange={(e) => setTrackingId(e.target.value)}
          />
        </div>
        <Button 
          type="submit" 
          disabled={isLoading}
          className="h-14 px-8 bg-blue-900 hover:bg-blue-800 text-white font-semibold rounded-xl transition-all active:scale-95"
        >
          {isLoading ? 'Recherche...' : 'Suivre'}
        </Button>
      </form>
    </motion.div>
  );
}
