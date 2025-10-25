import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { BookOpen, DollarSign, Users, Plus, Eye } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/Card';
import Button from '../components/ui/Button';
import api from '../services/api';

const VendorDashboard = () => {
  const { user } = useAuth();
  const [courses, setCourses] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchVendorData();
  }, []);

  const fetchVendorData = async () => {
    try {
      const [coursesResponse, statsResponse] = await Promise.all([
        api.get('/courses/vendor/my-courses'),
        api.get('/vendor/stats')
      ]);

      setCourses(coursesResponse.data.data);
      setStats(statsResponse.data.data);
    } catch (error) {
      console.error('Error fetching vendor data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando panel...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Panel de Vendedor
              </h1>
              <p className="text-gray-600">
                Gestiona tus cursos y contenido educativo
              </p>
            </div>
            <Button asChild>
              <Link to="/vendor/create-course">
                <Plus className="mr-2 h-4 w-4" />
                Crear Nuevo Curso
              </Link>
            </Button>
          </div>
        </div>

        {/* Stats */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Cursos</CardTitle>
                <BookOpen className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalCourses}</div>
                <p className="text-xs text-muted-foreground">
                  Cursos creados
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Cursos Gratis</CardTitle>
                <Eye className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.freeCourses}</div>
                <p className="text-xs text-muted-foreground">
                  Cursos gratuitos
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Cursos de Pago</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.paidCourses}</div>
                <p className="text-xs text-muted-foreground">
                  Cursos premium
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Ingresos</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">${stats.totalRevenue}</div>
                <p className="text-xs text-muted-foreground">
                  Total en ventas
                </p>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Courses List */}
        <Card>
          <CardHeader>
            <CardTitle>Mis Cursos</CardTitle>
            <CardDescription>
              Gestiona todos los cursos que has creado
            </CardDescription>
          </CardHeader>
          <CardContent>
            {courses.length > 0 ? (
              <div className="space-y-4">
                {courses.map((course) => (
                  <div key={course._id} className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 border rounded-lg hover:bg-gray-50">
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg mb-1">{course.title}</h3>
                      <p className="text-gray-600 text-sm mb-2 line-clamp-2">{course.description}</p>
                      <div className="flex gap-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          course.isFree ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                        }`}>
                          {course.isFree ? 'GRATIS' : `$${course.price}`}
                        </span>
                        <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-xs font-medium capitalize">
                          {course.category}
                        </span>
                        <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded-full text-xs font-medium capitalize">
                          {course.level}
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-2 mt-2 sm:mt-0">
                      <Button variant="outline" size="sm" asChild>
                        <Link to={`/course/${course._id}`}>
                          Ver
                        </Link>
                      </Button>
                      <Button variant="outline" size="sm">
                        Editar
                      </Button>
                      <Button variant="outline" size="sm">
                        Contenido
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  No has creado cursos aún
                </h3>
                <p className="text-gray-600 mb-4">
                  Comienza creando tu primer curso para compartir tu conocimiento.
                </p>
                <Button asChild>
                  <Link to="/vendor/create-course">
                    <Plus className="mr-2 h-4 w-4" />
                    Crear Primer Curso
                  </Link>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default VendorDashboard;