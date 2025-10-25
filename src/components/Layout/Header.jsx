import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, BookOpen, User, Store } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import Button from '../ui/Button';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isAuthenticated, user, logout, isVendor } = useAuth();
  const location = useLocation();

  const navigation = [
    { name: 'Inicio', href: '/' },
    { name: 'Cursos', href: '/courses' },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <header className="bg-white shadow-sm border-b">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <BookOpen className="h-8 w-8 text-blue-600" />
              <span className="font-bold text-xl text-gray-900">Educa Platform</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive(item.href)
                    ? 'text-blue-600 bg-blue-50'
                    : 'text-gray-700 hover:text-blue-600'
                }`}
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* Desktop Auth Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            {isAuthenticated ? (
              <div className="flex items-center space-x-4">
                {isVendor() && (
                  <Link
                    to="/vendor/dashboard"
                    className="flex items-center space-x-2 text-gray-700 hover:text-blue-600"
                  >
                    <Store className="h-5 w-5" />
                    <span>Vendedor</span>
                  </Link>
                )}
                <Link
                  to="/dashboard"
                  className="flex items-center space-x-2 text-gray-700 hover:text-blue-600"
                >
                  <User className="h-5 w-5" />
                  <span>Mi Cuenta</span>
                </Link>
                <Button variant="outline" onClick={logout}>
                  Cerrar Sesión
                </Button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Button variant="ghost" asChild>
                  <Link to="/login">Iniciar Sesión</Link>
                </Button>
                <Button asChild>
                  <Link to="/register">Registrarse</Link>
                </Button>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 bg-white border-t">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`block px-3 py-2 rounded-md text-base font-medium ${
                    isActive(item.href)
                      ? 'text-blue-600 bg-blue-50'
                      : 'text-gray-700 hover:text-blue-600'
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              
              {isAuthenticated ? (
                <div className="border-t pt-4 space-y-2">
                  {isVendor() && (
                    <Link
                      to="/vendor/dashboard"
                      className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-600"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Panel Vendedor
                    </Link>
                  )}
                  <Link
                    to="/dashboard"
                    className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-600"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Mi Cuenta
                  </Link>
                  <Button
                    variant="outline"
                    className="w-full justify-center"
                    onClick={() => {
                      logout();
                      setIsMenuOpen(false);
                    }}
                  >
                    Cerrar Sesión
                  </Button>
                </div>
              ) : (
                <div className="border-t pt-4 space-y-2">
                  <Button variant="outline" className="w-full justify-center" asChild>
                    <Link to="/login" onClick={() => setIsMenuOpen(false)}>
                      Iniciar Sesión
                    </Link>
                  </Button>
                  <Button className="w-full justify-center" asChild>
                    <Link to="/register" onClick={() => setIsMenuOpen(false)}>
                      Registrarse
                    </Link>
                  </Button>
                </div>
              )}
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Header;