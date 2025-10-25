import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import api from '../services/api';

const CreateCourse = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'primaria',
    price: '',
    isFree: false,
    level: 'basico',
    duration: '',
    instructor: '',
    whatsappMessage: ''
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const courseData = {
        ...formData,
        price: formData.isFree ? 0 : parseFloat(formData.price),
        instructor: formData.instructor || 'Yo mismo'
      };

      const response = await api.post('/courses', courseData);
      
      setMessage('✅ Curso creado exitosamente!');
      setTimeout(() => {
        navigate('/vendor/dashboard');
      }, 2000);
    } catch (error) {
      setMessage('❌ Error creando curso: ' + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4">
        <Card>
          <CardHeader>
            <CardTitle>Crear Nuevo Curso</CardTitle>
            <CardDescription>
              Completa la información para crear tu curso
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {message && (
                <div className={`p-3 rounded-md ${
                  message.includes('✅') ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {message}
                </div>
              )}

              <div className="space-y-2">
                <label className="text-sm font-medium">Título del Curso *</label>
                <Input
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="Ej: Matemáticas Básicas para Primaria"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Descripción *</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows="4"
                  className="w-full border rounded-md p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Describe detalladamente tu curso, qué aprenderán los estudiantes, etc."
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Categoría *</label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="w-full border rounded-md p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="primaria">Primaria</option>
                    <option value="secundaria">Secundaria</option>
                    <option value="universidad">Universidad</option>
                    <option value="programacion">Programación</option>
                    <option value="otros">Otros</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Nivel *</label>
                  <select
                    name="level"
                    value={formData.level}
                    onChange={handleChange}
                    className="w-full border rounded-md p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="basico">Básico</option>
                    <option value="intermedio">Intermedio</option>
                    <option value="avanzado">Avanzado</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Duración *</label>
                <Input
                  name="duration"
                  value={formData.duration}
                  onChange={handleChange}
                  placeholder="Ej: 10 horas, 4 semanas, 30 lecciones"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Instructor</label>
                <Input
                  name="instructor"
                  value={formData.instructor}
                  onChange={handleChange}
                  placeholder="Tu nombre o nombre del instructor"
                />
                <p className="text-xs text-gray-500">
                  Si se deja vacío, se usará "Yo mismo"
                </p>
              </div>

              <div className="space-y-4 p-4 border rounded-lg">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="isFree"
                    name="isFree"
                    checked={formData.isFree}
                    onChange={handleChange}
                    className="mr-2"
                  />
                  <label htmlFor="isFree" className="text-sm font-medium">
                    Este curso es gratuito
                  </label>
                </div>
                <p className="text-xs text-gray-500">
                  Los cursos gratis son accesibles inmediatamente por todos los estudiantes sin pago.
                </p>
              </div>

              {!formData.isFree && (
                <div className="space-y-2">
                  <label className="text-sm font-medium">Precio ($) *</label>
                  <Input
                    name="price"
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.price}
                    onChange={handleChange}
                    placeholder="29.99"
                    required={!formData.isFree}
                  />
                </div>
              )}

              <div className="space-y-2">
                <label className="text-sm font-medium">Mensaje para WhatsApp *</label>
                <textarea
                  name="whatsappMessage"
                  value={formData.whatsappMessage}
                  onChange={handleChange}
                  rows="3"
                  className="w-full border rounded-md p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Hola! Estoy interesado en el curso: [nombre del curso] por $[precio]"
                  required
                />
                <p className="text-xs text-gray-500">
                  Este mensaje se enviará por WhatsApp cuando alguien quiera comprar tu curso
                </p>
              </div>

              <Button type="submit" className="w-full" loading={loading} size="lg">
                Crear Curso
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CreateCourse;