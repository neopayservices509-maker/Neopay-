import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { dbService } from '../services/dbService';
import { Parcel, TrackingStatus } from '../types';
import { 
  Plus, 
  Search, 
  Edit2, 
  Trash2, 
  LogOut, 
  Package, 
  LayoutDashboard,
  CheckCircle2,
  Truck,
  Clock,
  AlertCircle
} from 'lucide-react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '../components/ui/table';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Badge } from '../components/ui/badge';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogFooter
} from '../components/ui/dialog';
import { Label } from '../components/ui/label';
import { motion } from 'motion/react';

const statusLabels: Record<TrackingStatus, string> = {
  pending: 'En attente',
  in_transit: 'En transit',
  delivered: 'Livré',
  cancelled: 'Annulé',
};

export default function AdminDashboard() {
  const [parcels, setParcels] = useState<Parcel[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editingParcel, setEditingParcel] = useState<Parcel | null>(null);
  
  const [formData, setFormData] = useState({
    tracking_id: '',
    status: 'pending' as TrackingStatus,
    location: '',
    estimated_date: '',
  });

  const navigate = useNavigate();

  useEffect(() => {
    const isAuth = localStorage.getItem('admin_auth');
    if (!isAuth) {
      navigate('/admin/login');
    } else {
      setParcels(dbService.getParcels());
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('admin_auth');
    navigate('/admin/login');
  };

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    dbService.addParcel(formData);
    setParcels(dbService.getParcels());
    setIsAddOpen(false);
    resetForm();
  };

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingParcel) {
      dbService.updateParcel(editingParcel.id, formData);
      setParcels(dbService.getParcels());
      setIsEditOpen(false);
      setEditingParcel(null);
      resetForm();
    }
  };

  const handleDelete = (id: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce colis ?')) {
      dbService.deleteParcel(id);
      setParcels(dbService.getParcels());
    }
  };

  const resetForm = () => {
    setFormData({
      tracking_id: '',
      status: 'pending',
      location: '',
      estimated_date: '',
    });
  };

  const openEdit = (parcel: Parcel) => {
    setEditingParcel(parcel);
    setFormData({
      tracking_id: parcel.tracking_id,
      status: parcel.status,
      location: parcel.location,
      estimated_date: parcel.estimated_date,
    });
    setIsEditOpen(true);
  };

  const filteredParcels = parcels.filter(p => 
    p.tracking_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-blue-900 text-white hidden lg:flex flex-col">
        <div className="p-8">
          <div className="flex items-center gap-3 mb-10">
            <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center font-bold text-blue-900 text-lg">
              NP
            </div>
            <h1 className="text-xl font-bold tracking-tight">Admin Portal</h1>
          </div>
          
          <nav className="space-y-2">
            <button className="w-full flex items-center gap-3 px-4 py-3 bg-blue-800 rounded-xl font-medium transition-colors">
              <LayoutDashboard className="h-5 w-5" />
              Tableau de bord
            </button>
            <button className="w-full flex items-center gap-3 px-4 py-3 text-blue-100 hover:bg-blue-800 rounded-xl font-medium transition-colors">
              <Package className="h-5 w-5" />
              Tous les colis
            </button>
          </nav>
        </div>
        
        <div className="mt-auto p-8">
          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 text-blue-100 hover:text-white hover:bg-red-500/20 rounded-xl font-medium transition-all"
          >
            <LogOut className="h-5 w-5" />
            Déconnexion
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Header */}
        <header className="h-20 bg-white border-b border-slate-200 px-8 flex items-center justify-between shrink-0">
          <h2 className="text-xl font-bold text-slate-900">Gestion des Colis</h2>
          <div className="flex items-center gap-4">
            <div className="relative hidden md:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input 
                placeholder="Rechercher..." 
                className="pl-10 w-64 h-10 border-slate-200 rounded-lg"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
              <DialogTrigger render={
                <Button className="bg-blue-900 hover:bg-blue-800 text-white rounded-lg gap-2">
                  <Plus className="h-4 w-4" />
                  Nouveau Colis
                </Button>
              } />
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Ajouter un colis</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleAdd} className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="tracking_id">Numéro de suivi</Label>
                    <Input 
                      id="tracking_id" 
                      placeholder="NEO..." 
                      value={formData.tracking_id}
                      onChange={(e) => setFormData({...formData, tracking_id: e.target.value})}
                      required 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="status">Statut</Label>
                    <select 
                      id="status"
                      className="w-full h-10 px-3 rounded-md border border-slate-200 bg-white text-sm"
                      value={formData.status}
                      onChange={(e) => setFormData({...formData, status: e.target.value as TrackingStatus})}
                    >
                      <option value="pending">En attente</option>
                      <option value="in_transit">En transit</option>
                      <option value="delivered">Livré</option>
                      <option value="cancelled">Annulé</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="location">Localisation</Label>
                    <Input 
                      id="location" 
                      placeholder="Ville, Pays" 
                      value={formData.location}
                      onChange={(e) => setFormData({...formData, location: e.target.value})}
                      required 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="date">Date estimée</Label>
                    <Input 
                      id="date" 
                      type="date" 
                      value={formData.estimated_date}
                      onChange={(e) => setFormData({...formData, estimated_date: e.target.value})}
                      required 
                    />
                  </div>
                  <DialogFooter className="pt-4">
                    <Button type="submit" className="w-full bg-blue-900">Enregistrer</Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </header>

        {/* Dashboard Content */}
        <div className="flex-1 overflow-auto p-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <StatsCard title="Total" value={parcels.length} icon={Package} color="blue" />
            <StatsCard title="En transit" value={parcels.filter(p => p.status === 'in_transit').length} icon={Truck} color="orange" />
            <StatsCard title="Livrés" value={parcels.filter(p => p.status === 'delivered').length} icon={CheckCircle2} color="green" />
            <StatsCard title="En attente" value={parcels.filter(p => p.status === 'pending').length} icon={Clock} color="yellow" />
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            <Table>
              <TableHeader className="bg-slate-50">
                <TableRow>
                  <TableHead className="font-bold">Tracking ID</TableHead>
                  <TableHead className="font-bold">Statut</TableHead>
                  <TableHead className="font-bold">Localisation</TableHead>
                  <TableHead className="font-bold">Date Estimée</TableHead>
                  <TableHead className="text-right font-bold">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredParcels.map((parcel) => (
                  <TableRow key={parcel.id} className="hover:bg-slate-50 transition-colors">
                    <TableCell className="font-mono font-medium">{parcel.tracking_id}</TableCell>
                    <TableCell>
                      <Badge className={getStatusBadgeColor(parcel.status)}>
                        {statusLabels[parcel.status]}
                      </Badge>
                    </TableCell>
                    <TableCell>{parcel.location}</TableCell>
                    <TableCell>{new Date(parcel.estimated_date).toLocaleDateString()}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8 text-slate-400 hover:text-blue-600"
                          onClick={() => openEdit(parcel)}
                        >
                          <Edit2 className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8 text-slate-400 hover:text-red-600"
                          onClick={() => handleDelete(parcel.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {filteredParcels.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} className="h-32 text-center text-slate-500">
                      Aucun colis trouvé.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </main>

      {/* Edit Dialog */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Modifier le colis</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleUpdate} className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit_tracking_id">Numéro de suivi</Label>
              <Input 
                id="edit_tracking_id" 
                value={formData.tracking_id}
                onChange={(e) => setFormData({...formData, tracking_id: e.target.value})}
                required 
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit_status">Statut</Label>
              <select 
                id="edit_status"
                className="w-full h-10 px-3 rounded-md border border-slate-200 bg-white text-sm"
                value={formData.status}
                onChange={(e) => setFormData({...formData, status: e.target.value as TrackingStatus})}
              >
                <option value="pending">En attente</option>
                <option value="in_transit">En transit</option>
                <option value="delivered">Livré</option>
                <option value="cancelled">Annulé</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit_location">Localisation</Label>
              <Input 
                id="edit_location" 
                value={formData.location}
                onChange={(e) => setFormData({...formData, location: e.target.value})}
                required 
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit_date">Date estimée</Label>
              <Input 
                id="edit_date" 
                type="date" 
                value={formData.estimated_date}
                onChange={(e) => setFormData({...formData, estimated_date: e.target.value})}
                required 
              />
            </div>
            <DialogFooter className="pt-4">
              <Button type="submit" className="w-full bg-blue-900">Mettre à jour</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function StatsCard({ title, value, icon: Icon, color }: any) {
  const colors: any = {
    blue: 'bg-blue-50 text-blue-600',
    orange: 'bg-orange-50 text-orange-600',
    green: 'bg-green-50 text-green-600',
    yellow: 'bg-yellow-50 text-yellow-600',
  };

  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div className={`p-2 rounded-lg ${colors[color]}`}>
          <Icon className="h-5 w-5" />
        </div>
      </div>
      <p className="text-slate-500 text-sm font-medium">{title}</p>
      <p className="text-2xl font-bold text-slate-900">{value}</p>
    </div>
  );
}

function getStatusBadgeColor(status: TrackingStatus) {
  switch (status) {
    case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    case 'in_transit': return 'bg-blue-100 text-blue-800 border-blue-200';
    case 'delivered': return 'bg-green-100 text-green-800 border-green-200';
    case 'cancelled': return 'bg-red-100 text-red-800 border-red-200';
    default: return '';
  }
}
