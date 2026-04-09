import { Parcel } from '../types';
import { motion } from 'motion/react';
import { Package, MapPin, Calendar, Clock, CheckCircle2, Truck, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';

interface TrackingResultProps {
  parcel: Parcel;
}

const statusConfig = {
  pending: {
    label: 'En attente',
    color: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    icon: Clock,
  },
  in_transit: {
    label: 'En transit',
    color: 'bg-blue-100 text-blue-800 border-blue-200',
    icon: Truck,
  },
  delivered: {
    label: 'Livré',
    color: 'bg-green-100 text-green-800 border-green-200',
    icon: CheckCircle2,
  },
  cancelled: {
    label: 'Annulé',
    color: 'bg-red-100 text-red-800 border-red-200',
    icon: AlertCircle,
  },
};

export function TrackingResult({ parcel }: TrackingResultProps) {
  const config = statusConfig[parcel.status];
  const StatusIcon = config.icon;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className="w-full max-w-2xl mx-auto mt-8"
    >
      <Card className="border-2 shadow-xl overflow-hidden rounded-2xl">
        <CardHeader className="bg-slate-50 border-bottom">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-900 rounded-lg">
                <Package className="h-6 w-6 text-white" />
              </div>
              <div>
                <CardTitle className="text-xl font-bold text-slate-900">
                  Colis #{parcel.tracking_id}
                </CardTitle>
                <p className="text-sm text-slate-500">Mise à jour le {new Date(parcel.updated_at).toLocaleDateString()}</p>
              </div>
            </div>
            <Badge className={`${config.color} px-3 py-1 text-sm font-medium border`}>
              {config.label}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="p-8 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-slate-100 rounded-full">
                <MapPin className="h-6 w-6 text-blue-900" />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-500 uppercase tracking-wider">Localisation actuelle</p>
                <p className="text-lg font-semibold text-slate-900">{parcel.location}</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="p-3 bg-slate-100 rounded-full">
                <Calendar className="h-6 w-6 text-blue-900" />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-500 uppercase tracking-wider">Date de livraison estimée</p>
                <p className="text-lg font-semibold text-slate-900">
                  {new Date(parcel.estimated_date).toLocaleDateString('fr-FR', { 
                    day: 'numeric', 
                    month: 'long', 
                    year: 'numeric' 
                  })}
                </p>
              </div>
            </div>
          </div>

          <div className="relative pt-8">
            <div className="absolute left-0 top-1/2 w-full h-1 bg-slate-100 -translate-y-1/2 rounded-full overflow-hidden">
               <motion.div 
                 initial={{ width: 0 }}
                 animate={{ width: parcel.status === 'delivered' ? '100%' : parcel.status === 'in_transit' ? '50%' : '10%' }}
                 className="h-full bg-blue-600"
               />
            </div>
            <div className="relative flex justify-between">
              <div className="flex flex-col items-center gap-2">
                <div className={`w-4 h-4 rounded-full border-2 border-white shadow-sm ${parcel.status !== 'pending' ? 'bg-blue-600' : 'bg-slate-300'}`} />
                <span className="text-xs font-medium text-slate-500">Expédié</span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <div className={`w-4 h-4 rounded-full border-2 border-white shadow-sm ${parcel.status === 'in_transit' || parcel.status === 'delivered' ? 'bg-blue-600' : 'bg-slate-300'}`} />
                <span className="text-xs font-medium text-slate-500">En transit</span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <div className={`w-4 h-4 rounded-full border-2 border-white shadow-sm ${parcel.status === 'delivered' ? 'bg-blue-600' : 'bg-slate-300'}`} />
                <span className="text-xs font-medium text-slate-500">Livré</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
