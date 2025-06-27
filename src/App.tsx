import React, { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { LanguageProvider } from './contexts/LanguageContext';
import { AuthProvider } from './contexts/AuthContext';
import { BookingProvider } from './contexts/BookingContext';
import { FavoritesProvider } from './contexts/FavoritesContext';
import { ReviewsProvider } from './contexts/ReviewsContext';
import { ToastProvider } from './components/Toast';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import CatalogPage from './pages/CatalogPage';
import EquipmentDetailPage from './pages/EquipmentDetailPage';
import BookingPage from './pages/BookingPage';
import AccountPage from './pages/AccountPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ContactPage from './pages/ContactPage';
import AdminDashboard from './pages/AdminDashboard';
import BookingConfirmationPage from './pages/BookingConfirmationPage';
import FavoritesPage from './pages/FavoritesPage';
import ProtectedRoute from './components/ProtectedRoute';

// Создание QueryClient для React Query
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 минут
      gcTime: 10 * 60 * 1000, // 10 минут
      retry: (failureCount, error: any) => {
        // Не повторять для 4xx ошибок
        if (error?.status >= 400 && error?.status < 500) {
          return false;
        }
        return failureCount < 3;
      },
    },
  },
});

// Loading компонент
const LoadingSpinner = () => (
  <div className="flex justify-center items-center h-64">
    <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
  </div>
);

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ToastProvider>
        <LanguageProvider>
          <AuthProvider>
            <BookingProvider>
              <FavoritesProvider>
                <ReviewsProvider>
                  <Router>
                    <div className="min-h-screen bg-white">
                      <Header />
                      <main>
                        <Suspense fallback={<LoadingSpinner />}>
                          <Routes>
                            <Route path="/" element={<HomePage />} />
                            <Route path="/catalog" element={<CatalogPage />} />
                            <Route path="/equipment/:id" element={<EquipmentDetailPage />} />
                            <Route path="/booking/:id" element={<BookingPage />} />
                            <Route path="/booking-confirmation" element={<BookingConfirmationPage />} />
                            <Route path="/login" element={<LoginPage />} />
                            <Route path="/register" element={<RegisterPage />} />
                            <Route path="/contact" element={<ContactPage />} />
                            <Route path="/favorites" element={<FavoritesPage />} />
                            <Route 
                              path="/account" 
                              element={
                                <ProtectedRoute>
                                  <AccountPage />
                                </ProtectedRoute>
                              } 
                            />
                            <Route 
                              path="/admin" 
                              element={
                                <ProtectedRoute adminOnly>
                                  <AdminDashboard />
                                </ProtectedRoute>
                              } 
                            />
                          </Routes>
                        </Suspense>
                      </main>
                      <Footer />
                    </div>
                  </Router>
                </ReviewsProvider>
              </FavoritesProvider>
            </BookingProvider>
          </AuthProvider>
        </LanguageProvider>
      </ToastProvider>
    </QueryClientProvider>
  );
}

export default App;