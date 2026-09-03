import React, { useState, useEffect } from 'react';
import { AuthProvider } from './contexts/AuthContext';
import { FavoritesProvider } from './contexts/FavoritesContext';
import { Sidebar, NavTab } from './components/layout/Sidebar';
import { AuthModal } from './components/auth/AuthModal';
import { OnboardingSurveyModal } from './components/auth/OnboardingSurveyModal';
import { HomePage } from './pages/HomePage';
import { CityHubPage } from './pages/CityHubPage';
import { RoutesPage } from './pages/RoutesPage';
import { ItineraryPage } from './pages/ItineraryPage';
import { Heritage3DPage } from './pages/Heritage3DPage';
import { MapPage } from './pages/MapPage';
import { AIAssistantPage } from './pages/AIAssistantPage';
import { MyTripsPage } from './pages/MyTripsPage';
import { FavoritesPage } from './pages/FavoritesPage';
import { ProfilePage } from './pages/ProfilePage';
import { DestinationDetailPage } from './pages/DestinationDetailPage';
import { SearchPage } from './pages/SearchPage';
import { PlaceSummary } from './types';
import { api } from './services/api';
import { Menu, Compass, Search } from 'lucide-react';

const AppContent: React.FC = () => {
  const [activeTab, setActiveTab] = useState<NavTab>('home');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedPlaceId, setSelectedPlaceId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string | null>(null);
  const [selectedCity, setSelectedCity] = useState<string>('Mumbai');
  const [places, setPlaces] = useState<PlaceSummary[]>([]);

  useEffect(() => {
    const loadAllPlaces = async () => {
      try {
        const res = await api.getPlaces({ limit: 100 });
        setPlaces(res.data);
      } catch (err) {
        console.error('Failed to load places:', err);
      }
    };
    loadAllPlaces();
  }, []);

  const handleSelectPlace = (id: string) => {
    setSelectedPlaceId(id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setSelectedPlaceId(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavigateTab = (tab: NavTab) => {
    setActiveTab(tab);
    setSelectedPlaceId(null);
    setSearchQuery(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectState = (stateId: string) => {
    if (stateId === 'mumbai') setSelectedCity('Mumbai');
    else if (stateId === 'rajasthan') setSelectedCity('Jaipur');
    else if (stateId === 'kerala') setSelectedCity('Kochi');
    else if (stateId === 'goa') setSelectedCity('Goa');
    setActiveTab('dashboard');
    setSelectedPlaceId(null);
    setSearchQuery(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="flex min-h-screen bg-slate-950 text-slate-100 selection:bg-orange-500 selection:text-white">
      {/* Sidebar Navigation */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={handleNavigateTab}
        isOpen={isSidebarOpen}
        setIsOpen={setIsSidebarOpen}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile Header Bar */}
        <header className="sticky top-0 z-30 flex items-center justify-between px-4 py-3 bg-slate-950/90 backdrop-blur-md border-b border-parchment-300 lg:hidden">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="p-2 rounded-xl bg-slate-900 border border-parchment-300 text-charcoal-light hover:text-charcoal"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-orange-500 flex items-center justify-center text-charcoal">
                <Compass className="w-4 h-4 text-slate-950" />
              </div>
              <span className="font-extrabold text-sm text-charcoal tracking-tight">
                Bharat<span className="text-orange-500">Yatra</span>
              </span>
            </div>
          </div>

          <button
            onClick={() => handleSearch('')}
            className="p-2 rounded-xl bg-slate-900 border border-parchment-300 text-charcoal-light hover:text-charcoal"
          >
            <Search className="w-4 h-4" />
          </button>
        </header>

        {/* Page Content View */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {selectedPlaceId ? (
            <DestinationDetailPage
              placeId={selectedPlaceId}
              onBack={() => setSelectedPlaceId(null)}
              onSelectPlace={handleSelectPlace}
            />
          ) : searchQuery !== null ? (
            <SearchPage
              initialQuery={searchQuery}
              onSelectPlace={handleSelectPlace}
              onBack={() => setSearchQuery(null)}
            />
          ) : (
            <>
              {activeTab === 'home' && (
                <HomePage
                  onSearch={handleSearch}
                  onNavigateTab={handleNavigateTab}
                  onSelectPlace={handleSelectPlace}
                  onSelectState={handleSelectState}
                  selectedCity={selectedCity}
                  onSelectCity={setSelectedCity}
                  places={places}
                />
              )}

              {activeTab === 'dashboard' && (
                <CityHubPage
                  onSelectPlace={handleSelectPlace}
                  onNavigateTab={handleNavigateTab}
                  selectedCity={selectedCity}
                  onSelectCity={setSelectedCity}
                />
              )}

              {activeTab === 'map' && (
                <MapPage
                  onSelectPlace={handleSelectPlace}
                  selectedCity={selectedCity}
                  onSelectCity={setSelectedCity}
                />
              )}

              {activeTab === 'routes' && (
                <RoutesPage
                  places={places}
                  onSelectPlace={handleSelectPlace}
                />
              )}

              {activeTab === 'itinerary' && (
                <ItineraryPage
                  onSelectPlace={handleSelectPlace}
                  onNavigateTab={handleNavigateTab}
                  selectedCity={selectedCity}
                />
              )}

              {activeTab === '3d' && <Heritage3DPage />}

              {activeTab === 'ai' && (
                <AIAssistantPage
                  onSelectPlace={handleSelectPlace}
                  selectedCity={selectedCity}
                />
              )}

              {activeTab === 'trips' && (
                <MyTripsPage
                  onNavigateTab={handleNavigateTab}
                  onSelectPlace={handleSelectPlace}
                />
              )}

              {activeTab === 'favorites' && (
                <FavoritesPage
                  onSelectPlace={handleSelectPlace}
                  places={places}
                />
              )}

              {activeTab === 'profile' && (
                <ProfilePage onNavigateTab={handleNavigateTab} />
              )}
            </>
          )}
        </main>
      </div>

      {/* Global Modals */}
      <AuthModal />
      <OnboardingSurveyModal />
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <FavoritesProvider>
        <AppContent />
      </FavoritesProvider>
    </AuthProvider>
  );
}
