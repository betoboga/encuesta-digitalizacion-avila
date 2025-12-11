import { Outlet, Navigate, Link } from 'react-router-dom';
import { LogOut, BarChart2 } from 'lucide-react';
import { useAuth } from '../features/auth/AuthContext';

export default function AdminLayout() {
  const { user, loading, logout } = useAuth();

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Cargando...</div>;
  }

  if (!user) {
    return <Navigate to="/admin/login" replace />;
  }

  return (
    <div className="min-h-screen bg-gray-100 flex">
      <aside className="w-64 bg-white shadow-md z-10 hidden md:block">
        <div className="p-6 border-b">
          <h2 className="text-xl font-bold text-gray-800">Panel IAPA</h2>
          <p className="text-xs text-gray-500 mt-1">{user.email}</p>
        </div>
        <nav className="p-4 space-y-2">
          <Link to="/admin/dashboard" className="flex items-center gap-3 px-4 py-2 text-gray-700 hover:bg-green-50 rounded-lg group">
            <BarChart2 className="w-5 h-5 group-hover:text-green-600" />
            <span>Dashboard</span>
          </Link>
        </nav>
        <div className="absolute bottom-0 w-64 p-4 border-t bg-gray-50">
          <button 
            onClick={() => logout()}
            className="flex items-center gap-3 px-4 py-2 text-red-600 w-full hover:bg-red-50 rounded-lg"
          >
            <LogOut className="w-5 h-5" />
            <span>Cerrar Sesión</span>
          </button>
        </div>
      </aside>
      <main className="flex-1 p-8 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
}
