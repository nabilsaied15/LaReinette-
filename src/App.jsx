import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import TopBanner from './components/TopBanner';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Services from './components/Services';
import ServiceWizard from './components/ServiceWizard';
import Testimonials from './components/Testimonials';
import FeatureHighlight from './components/FeatureHighlight';
import AccessibilityToolbar from './components/AccessibilityToolbar';
import ScrollProgress from './components/ScrollProgress';
import Footer from './components/Footer';
import LatestNews from './components/LatestNews';
import LaReinette from './pages/LaReinette';
import TarifsLaReinette from './pages/TarifsLaReinette';
import ChiffresCles from './pages/ChiffresCles';
import Destinations from './pages/Destinations';
import Booking from './pages/Booking';
import Contact from './pages/Contact';
import FAQ from './pages/FAQ';
import Partners from './pages/Partners';
import News from './pages/News';
import NewsDetail from './pages/NewsDetail';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import ProtectedRoute from './components/ProtectedRoute';
import ErrorBoundary from './components/ErrorBoundary';
import Chatbot from './components/Chatbot';
import ScrollingBanner from './components/ScrollingBanner';
import SEO from './components/SEO';
import RouteSeo from './components/RouteSeo';
import CookieConsent from './components/CookieConsent';
import ServiceDetail from './pages/ServiceDetail';
import Teleassistance from './pages/Teleassistance';
import SAAD from './pages/SAAD';
import SSIAD from './pages/SSIAD';
import Asad from './pages/Asad';
import LandingVideo from './pages/LandingVideo';
import './App.css';

const Home = () => (
  <main>
    <SEO
      title="Accueil"
      description="La Reinette - Service de transport et d'accompagnement pour seniors à Bourg-la-Reine. Sécurité, confort et sérénité."
    />
    <Hero />
    <About />
    <Services />

    <Testimonials />
    <FeatureHighlight />
  </main>
);

const AppContent = () => {
  const location = useLocation();
  const isLandingPage = location.pathname === '/';

  React.useEffect(() => {
    if (isLandingPage) {
      document.body.classList.add('landing-mode');
    } else {
      document.body.classList.remove('landing-mode');
    }
  }, [isLandingPage]);

  return (
    <div className="app">
      <RouteSeo />
      <a href="#main-content" className="skip-link">Aller au contenu principal</a>
      <ScrollProgress />
      <AccessibilityToolbar />
      {!isLandingPage && <TopBanner />}
      <Navbar />
      {!isLandingPage && <ScrollingBanner />}
      <main id="main-content">
          <Routes>
            <Route path="/" element={<LandingVideo />} />
            <Route path="/accueil" element={<Home />} />
            <Route path="/avis" element={<Testimonials />} />
            <Route path="/la-reinette" element={<LaReinette />} />
            <Route path="/tarifs-lareinette" element={<TarifsLaReinette />} />
            <Route path="/chiffres-cles" element={<ChiffresCles />} />
            <Route path="/destinations" element={<Destinations />} />
            <Route path="/reservation" element={<Booking />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/faq" element={<FAQ />} />
            <Route path="/partenaires" element={<Partners />} />
            <Route path="/asad" element={<Asad />} />
            <Route path="/actualites" element={<News />} />
            <Route path="/actualites/:id" element={<NewsDetail />} />
            <Route path="/saad" element={<SAAD />} />
            <Route path="/ssiad" element={<SSIAD />} />
            <Route path="/teleassistance" element={<Teleassistance />} />
            <Route path="/direction/admin" element={<AdminLogin />} />
            <Route
              path="/direction/admin/dashboard"
              element={
                <ProtectedRoute>
                  <ErrorBoundary>
                    <AdminDashboard />
                  </ErrorBoundary>
                </ProtectedRoute>
              }
            />
          </Routes>
        </main>
        <Chatbot />
        <CookieConsent />
        {!isLandingPage && <Footer />}
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
