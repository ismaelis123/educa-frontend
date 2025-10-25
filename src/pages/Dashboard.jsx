import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { BookOpen, Clock, DollarSign, User, Store } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/Card';
import Button from '../components/ui/Button';
import api from '../services/api';

const Dashboard = () => {
  const { user, isVendor } = useAuth();
  const [purchasedCourses, setPurchasedCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.purchasedCourses) {
      setPurchasedCourses(user.purchasedCourses);
    }
    setLoading(false);
  }, [user]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            ¡Bienvenido, {user?.name}!
          </h1>
          <p className="text-gray-600">
            {isVendor() 
              ? "Aquí puedes gestionar tus cursos como vendedor y ver tu progreso de aprendizaje."
              : "Aquí puedes gestionar tus cursos y ver tu progreso de aprendizaje."
            }
          </p>
        </div>

        {/* Quick Actions */}
        {isVendor() && (
          <div className="mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Panel de Vendedor</h3>
                    <p className="text-gray-600">Gestiona tus cursos y contenido</p>
                  </div>
                  <div className="flex gap-2">
                    <Button asChild>
                      <Link to="/vendor/dashboard">
                        <Store className="mr-2 h-4 w-4" />
                        Panel Vendedor
                      </Link>
                    </Button>
                    <Button variant="outline" asChild>
                      <Link to="/vendor/create-course">
                        Crear Curso
                      </Link>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Cursos Comprados</CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{purchasedCourses.length}</div>
              <p className="text-xs text-muted-foreground">
                Total de cursos adquiridos
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Tiempo de Estudio</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">0h</div>
              <p className="text-xs text-muted-foreground">
                Esta semana
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Inversión Total</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">$0</div>
              <p className="text-xs text-muted-foreground">
                En cursos
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Purchased Courses */}
        <Card>
          <CardHeader>
            <CardTitle>Mis Cursos</CardTitle>
            <CardDescription>
              Los cursos que has comprado y puedes acceder
            </CardDescription>
          </CardHeader>
          <CardContent>
            {purchasedCourses.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {purchasedCourses.map((course) => (
                  <div key={course._id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                    <h3 className="font-semibold text-lg mb-2">{course.title}</h3>
                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">{course.description}</p>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-500 capitalize">{course.category}</span>
                      <div className="flex gap-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          course.isFree ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                        }`}>
                          {course.isFree ? 'Gratis' : `$${course.price}`}
                        </span>
                        <button className="bg-blue-600 text-white px-3 py-1 rounded-md text-sm hover:bg-blue-700">
                          Continuar
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  No tienes cursos comprados
                </h3>
                <p className="text-gray-600 mb-4">
                  Explora nuestros cursos y comienza tu aprendizaje.
                </p>
                <Button asChild>
                  <Link to="/courses">
                    Explorar Cursos
                  </Link>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* User Info */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Información de la Cuenta</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-700">Nombre</label>
                <p className="text-gray-900">{user?.name}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Email</label>
                <p className="text-gray-900">{user?.email}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Teléfono</label>
                <p className="text-gray-900">{user?.phone}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Rol</label>
                <p className="text-gray-900 capitalize">
                  {user?.role === 'vendor' ? 'Vendedor' : user?.role}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;