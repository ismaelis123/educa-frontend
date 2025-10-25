import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Users, Star, ArrowRight, Crown, Store } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/Card';
import Button from '../components/ui/Button';

const Home = () => {
  const { isAuthenticated, user, isVendor } = useAuth();

  const features = [
    {
      icon: <BookOpen className="h-8 w-8" />,
      title: "Cursos Variados",
      description: "Desde primaria hasta universidad y programación"
    },
    {
      icon: <Users className="h-8 w-8" />,
      title: "Aprendizaje Personalizado",
      description: "Contenido adaptado a tu nivel y necesidades"
    },
    {
      icon: <Star className="h-8 w-8" />,
      title: "Calidad Garantizada",
      description: "Contenido creado por expertos en educación"
    }
  ];

  const roles = [
    {
      icon: <Users className="h-6 w-6" />,
      title: "Estudiante",
      description: "Aprende con cursos gratis y de pago",
      features: ["Acceso a cursos gratis", "Compra cursos vía WhatsApp", "Aprende a tu ritmo"]
    },
    {
      icon: <Store className="h-6 w-6" />,
      title: "Vendedor",
      description: "Crea y vende tus propios cursos",
      features: ["Crea cursos gratis/de pago", "Sube contenido multimedia", "Gana dinero enseñando"]
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Aprende sin Límites en 
            <span className="text-blue-600"> Educa Platform</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Descubre cursos de primaria, secundaria, universidad y programación. 
            Aprende a tu ritmo o crea tus propios cursos.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {!isAuthenticated ? (
              <>
                <Button size="lg" asChild>
                  <Link to="/register">
                    Comenzar Ahora <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button variant="outline" size="lg" asChild>
                  <Link to="/login">Iniciar Sesión</Link>
                </Button>
              </>
            ) : (
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" asChild>
                  <Link to="/courses">
                    Explorar Cursos <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                {isVendor() && (
                  <Button variant="outline" size="lg" asChild>
                    <Link to="/vendor/dashboard">
                      <Store className="mr-2 h-4 w-4" />
                      Panel Vendedor
                    </Link>
                  </Button>
                )}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Por qué elegirnos
            </h2>
            <p className="text-lg text-gray-600">
              Ofrecemos la mejor experiencia de aprendizaje en línea
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="text-center border-0 shadow-lg">
                <CardHeader>
                  <div className="flex justify-center text-blue-600 mb-4">
                    {feature.icon}
                  </div>
                  <CardTitle>{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Roles Section */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Elige tu Rol
            </h2>
            <p className="text-lg text-gray-600">
              Sé estudiante o conviértete en vendedor de cursos
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {roles.map((role, index) => (
              <Card key={index} className="text-center">
                <CardHeader>
                  <div className="flex justify-center text-blue-600 mb-4">
                    {role.icon}
                  </div>
                  <CardTitle>{role.title}</CardTitle>
                  <CardDescription>{role.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm text-gray-600 mb-6">
                    {role.features.map((feature, idx) => (
                      <li key={idx}>✓ {feature}</li>
                    ))}
                  </ul>
                  {!isAuthenticated && (
                    <Button asChild className="w-full">
                      <Link to="/register">
                        Registrarse como {role.title}
                      </Link>
                    </Button>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-blue-600">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            ¿Listo para comenzar tu viaje?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Únete a miles de usuarios que aprenden y enseñan con nosotros
          </p>
          <Button size="lg" variant="secondary" asChild>
            <Link to={isAuthenticated ? "/courses" : "/register"}>
              {isAuthenticated ? "Ver Cursos" : "Crear Cuenta Gratis"}
            </Link>
          </Button>
        </div>
      </section>
    </div>
  );
};

export default Home;