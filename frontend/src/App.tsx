import React, { useState, useEffect } from 'react';
import { PlaceSummary, StateItem } from './types';
import { api } from './services/api';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { FavoritesProvider } from './contexts/FavoritesContext';
import { AuthModal } from './components/auth/AuthModal';
import { OnboardingSurveyModal } from './components/auth/OnboardingSurveyModal';
import { Navbar } from './components/layout/Navbar';
import { Sidebar } from './components/layout/Sidebar';
import { Footer } from './components/common/Footer';
import { DataStatusBadge } from './components/common/DataStatusBadge';
import { HomePage } from './pages/HomePage';
import { MumbaiDashboard } from './components/mumbai/MumbaiDashboard';
import { DestinationDetailPage } from './pages/DestinationDetailPage';
import { MapPage } from './pages/MapPage';
import { RoutesPage } from './pages/RoutesPage';
import { ItineraryPage } from './pages/ItineraryPage';
import { Heritage3DPage } from './pages/Heritage3DPage';
import { AIAssistantPage } from './pages/AIAssistantPage';
import { SearchPage } from './pages/SearchPage';
import { FavoritesPage } from './pages/FavoritesPage';
import { MyTripsPage } from './pages/MyTripsPage';
import { ProfilePage } from './pages/ProfilePage';
import { AIChatDrawer } from './components/ai/AIChatDrawer';
import { AIChatWidget } from './components/ai/AIChatWidget';
import { ThreeDViewerModal } from './components/threed/ThreeDViewerModal';

const AppContent: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('home');
  const [selectedCity, setSelectedCity] = useState<string>('Mumbai');
  const [places, setPlaces] = useState<PlaceSummary[]>([]);
  const [states, setStates] = useState<StateItem[]>([]);
  const [selectedPlaceId, setSelectedPlaceId] = useState<string | null>(null);
  const [searchInitialQuery, setSearchInitialQuery] = useState<string>('');
  
  // AI Drawer State
  const [aiDrawerOpen, setAiDrawerOpen] = useState(false);
  const [aiInitialPlace, setAiInitialPlace] = useState<{ id?: string; name?: string; message?: string }>({});

  // 3D Modal State
  const [threeDModalPlaceId, setThreeDModalPlaceId] = useState<string | null>(null);

  useEffect(() => {
    // Load pan-India places and states
    api.getPlaces({ limit: 50 })
      .then((res) => setPlaces(res.data))
      .catch((err) => console.error('Failed to load places:', err));

    api.getStates()
      .then((res) => setStates(res))
      .catch((err) => console.error('Failed to load states:', err));
  }, []);

  const handleSelectPlace = (placeId: string) => {
    setSelectedPlaceId(placeId);
    setActiveTab('place-detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSearchSubmit = (query: string, city?: string) => {
    setSearchInitialQuery(query);
    setActiveTab('search');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenAIChat = (placeId?: string, placeName?: string, message?: string) => {
    setAiInitialPlace({ id: placeId, name: placeName, message });
    setAiDrawerOpen(true);
  };

  const isExploreOrDashboard = activeTab === 'explore' || activeTab === 'dashboard';

  return (
    <div className="min-h-screen bg-parchment text-charcoal flex flex-col selection:bg-terracotta selection:text-charcoal">
      {/* Modals */}
      <AuthModal />
      <OnboardingSurveyModal />

      {/* Top Navbar on Home / Landing Mode or Header */}
      {!isExploreOrDashboard && (
        <Navbar
          activeTab={activeTab}
          setActiveTab={(tab) => {
            setSelectedPlaceId(null);
            setActiveTab(tab);
          }}
          onSearchClick={() => setActiveTab('search')}
        />
      )}

      {/* Main Container */}
      <div className="flex-1 flex">
        {/* Left Sidebar on Explore / Dashboard Mode matching Image 2 */}
        {isExploreOrDashboard && (
          <Sidebar
            activeTab={activeTab}
            setActiveTab={(tab) => {
              if (tab === 'home') {
                setActiveTab('home');
              } else if (tab === 'dashboard' || tab === 'explore') {
                setActiveTab('explore');
              } else {
                setActiveTab(tab);
              }
            }}
            selectedCity={selectedCity}
            setSelectedCity={setSelectedCity}
          />
        )}

        {/* Dynamic Page Content */}
        <main className={`flex-1 ${isExploreOrDashboard ? 'p-6 lg:p-8 max-w-7xl mx-auto overflow-x-hidden' : ''}`}>
          {/* Top Live Data Provenance Badge for Judges */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-3 pb-1 flex justify-end">
            <DataStatusBadge />
          </div>

          {activeTab === 'home' && (
            <HomePage
              places={places}
              states={states}
              onSelectPlace={handleSelectPlace}
              onSearchSubmit={handleSearchSubmit}
              onNavigateTab={(tab) => {
                if (tab === 'explore') setActiveTab('explore');
                else setActiveTab(tab);
              }}
              onOpenAIChatWithMessage={(msg) => handleOpenAIChat(undefined, undefined, msg)}
            />
          )}

          {isExploreOrDashboard && (
            <MumbaiDashboard
              places={places}
              states={states}
              selectedCity={selectedCity}
              onSelectPlace={handleSelectPlace}
              onNavigateToPlace={(id) => {
                setSelectedPlaceId(id);
                setActiveTab('routes');
              }}
              onView3DPlace={(id) => setThreeDModalPlaceId(id)}
              onNavigateTab={(tab) => setActiveTab(tab)}
              onSearchSubmit={handleSearchSubmit}
              onOpenAIChatWithMessage={(msg) => handleOpenAIChat(undefined, undefined, msg)}
            />
          )}

          {activeTab === 'place-detail' && selectedPlaceId && (
            <DestinationDetailPage
              placeId={selectedPlaceId}
              onBack={() => setActiveTab('explore')}
              onSelectPlace={handleSelectPlace}
              onOpenAIChat={(id, name) => handleOpenAIChat(id, name)}
              onView3D={(id) => setThreeDModalPlaceId(id)}
            />
          )}

          {activeTab === 'search' && (
            <SearchPage
              initialQuery={searchInitialQuery}
              places={places}
              onSelectPlace={handleSelectPlace}
              onBack={() => setActiveTab('home')}
              onBackToHome={() => setActiveTab('home')}
            />
          )}

          {activeTab === 'map' && (
            <MapPage
              places={places}
              states={states}
              onSelectPlace={handleSelectPlace}
              onNavigateToPlace={(id) => {
                setSelectedPlaceId(id);
                setActiveTab('routes');
              }}
              onView3DPlace={(id) => setThreeDModalPlaceId(id)}
            />
          )}

          {activeTab === 'routes' && (
            <RoutesPage
              places={places}
              onSelectPlace={handleSelectPlace}
            />
          )}

          {activeTab === 'itinerary' && (
            <ItineraryPage />
          )}

          {activeTab === '3d' && (
            <Heritage3DPage
              places={places}
              onSelectPlace={handleSelectPlace}
              onNavigateToPlace={(id) => {
                setSelectedPlaceId(id);
                setActiveTab('routes');
              }}
            />
          )}

          {activeTab === 'ai' && (
            <AIAssistantPage
              onSelectPlace={handleSelectPlace}
              onView3DPlace={(id) => setThreeDModalPlaceId(id)}
            />
          )}

          {activeTab === 'favorites' && (
            <FavoritesPage
              onSelectPlace={handleSelectPlace}
              onNavigateToExplore={() => setActiveTab('explore')}
            />
          )}

          {activeTab === 'trips' && (
            <MyTripsPage
              onSelectPlace={handleSelectPlace}
              onNavigateToPlanner={() => setActiveTab('itinerary')}
            />
          )}

          {activeTab === 'profile' && (
            <ProfilePage
              onNavigateHome={() => setActiveTab('home')}
            />
          )}

          {activeTab === 'about' && (
            <div className="max-w-4xl mx-auto px-4 py-16 space-y-6 text-center">
              <h1 className="text-3xl font-black text-charcoal font-['Plus_Jakarta_Sans']">
                Bharat<span className="text-terracotta">Yatra</span>
              </h1>
              <p className="text-charcoal-light text-sm leading-relaxed max-w-2xl mx-auto">
                BharatYatra is an intelligent digital tourism exploration platform built for India. Integrating WebGL 3D heritage inspection, multi-modal transit intelligence, transparent fare provenance, and grounded AI travel guidance.
              </p>
            </div>
          )}
        </main>
      </div>

      {/* Footer */}
      <Footer onNavigate={(tab) => setActiveTab(tab)} />

      {/* Floating AI Chat Widget */}
      <AIChatWidget
        onClick={() => setAiDrawerOpen(true)}
        isOpen={aiDrawerOpen}
      />

      {/* AI Chat Drawer */}
      <AIChatDrawer
        isOpen={aiDrawerOpen}
        onClose={() => setAiDrawerOpen(false)}
        initialPlaceId={aiInitialPlace.id}
        initialPlaceName={aiInitialPlace.name}
        initialMessage={aiInitialPlace.message}
        onSelectPlace={handleSelectPlace}
        onView3DPlace={(id) => setThreeDModalPlaceId(id)}
      />

      {/* 3D Model Modal */}
      <ThreeDViewerModal
        isOpen={!!threeDModalPlaceId}
        onClose={() => setThreeDModalPlaceId(null)}
        placeName={places.find((p) => p.id === threeDModalPlaceId)?.name || 'Gateway of India'}
        onNavigateToPlace={() => {
          if (threeDModalPlaceId) {
            setSelectedPlaceId(threeDModalPlaceId);
            setThreeDModalPlaceId(null);
            setActiveTab('routes');
          }
        }}
      />
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <AuthProvider>
      <FavoritesProvider>
        <AppContent />
      </FavoritesProvider>
    </AuthProvider>
  );
};
