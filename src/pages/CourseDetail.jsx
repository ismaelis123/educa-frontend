import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Clock, User, DollarSign, Tag, BookOpen } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/Card';
import Button from '../components/ui/Button';
import api from '../services/api';
import { useAuth } from '../contexts/AuthContext';

const CourseDetail = () => {
  const { id } = useParams();
  const { isAuthenticated, user } = useAuth();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCourse();
  }, [id]);

  const fetchCourse = async () => {
    try {
      const response = await api.get(`/courses/${id}`);
      setCourse(response.data.data);
    } catch (error) {
      console.error('Error fetching course:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleWhatsAppPayment = async () => {
    if (course.isFree) {
      // Para cursos gratis, asignar inmediatamente
      try {
        const response = await api.post('/payments/initiate', { courseId: course._id });
        if (response.data.success) {
          alert('✅ Curso gratis asignado exitosamente!');
          window.location.reload();
        }
      } catch (error) {
        alert('Error al asignar curso gratis: ' + error.response?.data?.message);
      }
    } else {
      // Para cursos de pago, redirigir a WhatsApp
      const message = `Hola! Estoy interesado en el curso: ${course.title} por $${course.price}. Mi ID de curso es: ${course._id}`;
      const whatsappUrl = `https://wa.me/506TU_NUMERO?text=${encodeURIComponent(message)}`;
      window.open(whatsappUrl, '_blank');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando curso...</p>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Curso no encontrado</h2>
          <Link to="/courses" className="text-blue-600 hover:underline">
            Volver a los cursos
          </Link>
        </div>
      </div>
    );
  }

  const hasAccess = user?.purchasedCourses?.includes(course._id) || course.isFree;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Back Button */}
        <Link
          to="/courses"
          className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Volver a cursos
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-3xl">{course.title}</CardTitle>
                    <CardDescription className="text-lg mt-2">
                      {course.description}
                    </CardDescription>
                  </div>
                  {course.isFree && (
                    <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                      GRATIS
                    </span>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <div className="prose max-w-none">
                  <h3 className="text-xl font-semibold mb-4">Descripción del Curso</h3>
                  <p className="text-gray-700 mb-6">
                    {course.description}
                  </p>

                  <h3 className="text-xl font-semibold mb-4">Lo que aprenderás</h3>
                  <ul className="list-disc list-inside space-y-2 text-gray-700 mb-6">
                    <li>Conceptos fundamentales del tema</li>
                    <li>Ejercicios prácticos y ejemplos reales</li>
                    <li>Mejores prácticas y técnicas avanzadas</li>
                    <li>Proyectos para aplicar lo aprendido</li>
                  </ul>

                  {hasAccess && (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4 mt-6">
                      <h4 className="font-semibold text-green-800 mb-2">✅ Tienes acceso a este curso</h4>
                      <p className="text-green-700 text-sm">
                        {course.isFree 
                          ? 'Este curso es gratis y ya puedes acceder al contenido.'
                          : 'Has comprado este curso y puedes acceder a todo el contenido.'
                        }
                      </p>
                      <Button className="mt-3" asChild>
                        <Link to={`/course/${course._id}/content`}>
                          <BookOpen className="mr-2 h-4 w-4" />
                          Ver Contenido del Curso
                        </Link>
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Información del Curso</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Precio:</span>
                  <span className={`text-2xl font-bold ${course.isFree ? 'text-green-600' : 'text-blue-600'}`}>
                    {course.isFree ? 'Gratis' : `$${course.price}`}
                  </span>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Clock className="h-4 w-4 text-gray-400" />
                  <span className="text-gray-600">Duración:</span>
                  <span>{course.duration}</span>
                </div>

                <div className="flex items-center space-x-2">
                  <User className="h-4 w-4 text-gray-400" />
                  <span className="text-gray-600">Instructor:</span>
                  <span>{course.instructor}</span>
                </div>

                <div className="flex items-center space-x-2">
                  <Tag className="h-4 w-4 text-gray-400" />
                  <span className="text-gray-600">Categoría:</span>
                  <span className="capitalize px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                    {course.category}
                  </span>
                </div>

                <div className="flex items-center space-x-2">
                  <span className="text-gray-600">Nivel:</span>
                  <span className="capitalize px-2 py-1 bg-purple-100 text-purple-800 rounded-full text-sm">
                    {course.level}
                  </span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                {isAuthenticated ? (
                  hasAccess ? (
                    <div className="text-center space-y-4">
                      <div className="text-green-600 font-semibold">
                        ✅ Ya tienes acceso a este curso
                      </div>
                      <Button className="w-full" asChild>
                        <Link to={`/course/${course._id}/content`}>
                          <BookOpen className="mr-2 h-4 w-4" />
                          Ver Contenido
                        </Link>
                      </Button>
                    </div>
                  ) : (
                    <Button 
                      className="w-full" 
                      size="lg" 
                      onClick={handleWhatsAppPayment}
                      variant={course.isFree ? "outline" : "default"}
                    >
                      <DollarSign className="h-4 w-4 mr-2" />
                      {course.isFree ? "Obtener Gratis" : "Comprar por WhatsApp"}
                    </Button>
                  )
                ) : (
                  <div className="text-center space-y-4">
                    <p className="text-gray-600">Inicia sesión para {course.isFree ? 'obtener' : 'comprar'} este curso</p>
                    <Button className="w-full" asChild>
                      <Link to="/login">Iniciar Sesión</Link>
                    </Button>
                    <Button variant="outline" className="w-full" asChild>
                      <Link to="/register">Crear Cuenta</Link>
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Vendedor Info */}
            {course.vendor && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Sobre el Vendedor</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <User className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium">{course.vendor.name}</p>
                      {course.vendor.vendorInfo?.businessName && (
                        <p className="text-sm text-gray-600">{course.vendor.vendorInfo.businessName}</p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetail;