import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { Label } from '../components/ui/label';
import { ShieldAlert, Lock } from 'lucide-react';
import { motion } from 'motion/react';

export default function AdminLogin() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Simple admin password for demo purposes
    // In a real app, this would use Firebase Auth
    if (password === 'admin123') {
      localStorage.setItem('admin_auth', 'true');
      navigate('/admin/dashboard');
    } else {
      setError('Mot de passe incorrect');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-900 rounded-2xl mb-4 shadow-lg">
            <Lock className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900">Administration</h1>
          <p className="text-slate-500">Neo Pay Service Tracking</p>
        </div>

        <Card className="border-none shadow-2xl rounded-2xl overflow-hidden">
          <CardHeader className="bg-white pt-8 px-8">
            <CardTitle className="text-xl font-bold">Connexion</CardTitle>
            <CardDescription>Entrez votre mot de passe administrateur pour continuer.</CardDescription>
          </CardHeader>
          <CardContent className="p-8">
            <form onSubmit={handleLogin} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="password">Mot de passe</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  className="h-12 border-slate-200 focus:border-blue-600 rounded-xl"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              {error && (
                <div className="flex items-center gap-2 p-3 bg-red-50 text-red-700 text-sm rounded-lg border border-red-100">
                  <ShieldAlert className="h-4 w-4" />
                  {error}
                </div>
              )}

              <Button 
                type="submit" 
                className="w-full h-12 bg-blue-900 hover:bg-blue-800 text-white font-semibold rounded-xl transition-all active:scale-95 shadow-md"
              >
                Se connecter
              </Button>
            </form>
          </CardContent>
        </Card>
        
        <div className="text-center mt-8">
          <button 
            onClick={() => navigate('/')}
            className="text-slate-500 hover:text-blue-900 text-sm font-medium transition-colors"
          >
            ← Retour au site public
          </button>
        </div>
      </motion.div>
    </div>
  );
}
