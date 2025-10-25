import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Filter, Tag, Clock, User, DollarSign } from 'lucide-react';
import api from '../services/api';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';

const Courses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [showFreeOnly, setShowFreeOnly] = useState(false);

  const categories = [
    { value: '', label: 'Todos los cursos' },
    { value: 'primaria', label: 'Primaria' },
    { value: 'secundaria', label: 'Secundaria' },
    { value: 'universidad', label: 'Universidad' },
    { value: 'programacion', label: 'Programación' },
    { value: 'otros', label: 'Otros' }
  ];

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const response = await api.get('/courses');
      setCourses(response.data.data);
    } catch (error) {
      console.error('Error fetching courses:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         course.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !selectedCategory || course.category === selectedCategory;
    const matchesFree = !showFreeOnly || course.isFree;
    
    return matchesSearch && matchesCategory && matchesFree;
  });

  const handleWhatsAppPayment = (course) => {
    if (course.isFree) {
      // Para cursos gratis, asignar inmediatamente
      handleFreeCourse(course);
    } else {
      // Para cursos de pago, redirigir a WhatsApp
      const message = `Hola! Estoy interesado en el curso: ${course.title} por $${course.price}`;
      const whatsappUrl = `https://wa.me/506TU_NUMERO?text=${encodeURIComponent(message)}`;
      window.open(whatsappUrl, '_blank');
    }
  };

  const handleFreeCourse = async (course) => {
    try {
      const response = await api.post('/payments/initiate', { courseId: course._id });
      if (response.data.success) {
        alert('✅ Curso gratis asignado exitosamente!');
        window.location.reload();
      }
    } catch (error) {
      alert('Error al asignar curso gratis: ' + error.response?.data?.message);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando cursos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Nuestros Cursos
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Descubre una amplia variedad de cursos diseñados para tu crecimiento educativo
          </p>
        </div>

        {/* Filters */}
        <div className="mb-8 bg-white p-6 rounded-lg shadow-sm">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                type="text"
                placeholder="Buscar cursos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-4">
              <div className="flex gap-2 items-center">
                <Filter className="h-4 w-4 text-gray-400" />
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {categories.map(category => (
                    <option key={category.value} value={category.value}>
                      {category.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="freeOnly"
                  checked={showFreeOnly}
                  onChange={(e) => setShowFreeOnly(e.target.checked)}
                  className="mr-2"
                />
                <label htmlFor="freeOnly" className="text-sm text-gray-700">
                  Solo gratis
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Courses Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map(course => (
            <Card key={course._id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle className="text-xl">{course.title}</CardTitle>
                  {course.isFree && (
                    <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
                      GRATIS
                    </span>
                  )}
                </div>
                <CardDescription className="line-clamp-2">
                  {course.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center space-x-1">
                      <Tag className="h-4 w-4 text-gray-400" />
                      <span className="text-gray-600">Categoría:</span>
                    </div>
                    <span className="capitalize font-medium">{course.category}</span>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center space-x-1">
                      <User className="h-4 w-4 text-gray-400" />
                      <span className="text-gray-600">Instructor:</span>
                    </div>
                    <span>{course.instructor}</span>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center space-x-1">
                      <Clock className="h-4 w-4 text-gray-400" />
                      <span className="text-gray-600">Duración:</span>
                    </div>
                    <span>{course.duration}</span>
                  </div>

                  <div className="flex items-center justify-between text-lg font-bold mt-4 pt-4 border-t">
                    <div className="flex items-center space-x-1">
                      <DollarSign className="h-4 w-4" />
                      <span>Precio:</span>
                    </div>
                    <span className={course.isFree ? "text-green-600" : "text-blue-600"}>
                      {course.isFree ? "Gratis" : `$${course.price}`}
                    </span>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex flex-col space-y-2">
                <Button 
                  className="w-full" 
                  onClick={() => handleWhatsAppPayment(course)}
                  variant={course.isFree ? "outline" : "default"}
                >
                  {course.isFree ? "Obtener Gratis" : "Comprar por WhatsApp"}
                </Button>
                <Button variant="ghost" size="sm" className="w-full" asChild>
                  <Link to={`/course/${course._id}`}>
                    Ver Detalles
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        {filteredCourses.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No se encontraron cursos que coincidan con tu búsqueda.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Courses;