import { APIProvider, Map, AdvancedMarker, Pin, InfoWindow, useMap } from '@vis.gl/react-google-maps';
import { useState, useEffect, useCallback, useRef } from 'react';
import { NewsArticle } from '../types';
import { Shield, AlertTriangle, CheckCircle, Info, User, Navigation } from 'lucide-react';
import { analyzeArticle } from '../services/intelligence';
import { MarkerClusterer } from '@googlemaps/markerclusterer';
import type { Marker } from '@googlemaps/markerclusterer';

const API_KEY = process.env.GOOGLE_MAPS_PLATFORM_KEY || '';

const isPlaceholder = (key: string | undefined) => {
  if (!key) return true;
  const p = key.trim();
  if (p === '') return true;
  const up = p.toUpperCase();
  return [
    'API_KEY', 
    'YOUR_API_KEY', 
    'MY_API_KEY', 
    'PLACEHOLDER', 
    'YOUR_GOOGLE_MAPS_PLATFORM_KEY'
  ].includes(up) || up.startsWith('YOUR_') || up.startsWith('MY_');
};

const mask = (key: string | undefined) => {
  if (!key) return 'MISSING';
  if (key.length < 8) return 'TOO_SHORT';
  return `${key.substring(0, 4)}...${key.substring(key.length - 4)}`;
};

console.log("Maps Node Config Check:", mask(API_KEY));

const hasValidKey = !isPlaceholder(API_KEY);

interface MapViewProps {
  articles: NewsArticle[];
  onArticleSelect: (article: NewsArticle) => void;
  bypassActive?: boolean;
}

function MapContent({ 
  articles, 
  onArticleSelect, 
  userLocation, 
  selectedArticle, 
  setSelectedArticle 
}: { 
  articles: NewsArticle[], 
  onArticleSelect: (article: NewsArticle) => void,
  userLocation: google.maps.LatLngLiteral | null,
  selectedArticle: NewsArticle | null,
  setSelectedArticle: (article: NewsArticle | null) => void
}) {
  const map = useMap();
  const firstLocationSet = useRef(false);
  const [markers, setMarkers] = useState<{[key: string]: Marker}>({});
  const clusterer = useRef<MarkerClusterer | null>(null);

  // Initialize MarkerClusterer
  useEffect(() => {
    if (!map) return;
    if (!clusterer.current) {
      clusterer.current = new MarkerClusterer({ map });
    }
  }, [map]);

  // Update markers in clusterer
  useEffect(() => {
    if (!clusterer.current) return;
    clusterer.current.clearMarkers();
    clusterer.current.addMarkers(Object.values(markers));
  }, [markers]);

  const setMarkerRef = useCallback((marker: Marker | null, key: string) => {
    setMarkers(prev => {
      if (marker) {
        if (prev[key] === marker) return prev;
        return { ...prev, [key]: marker };
      } else {
        if (!prev[key]) return prev;
        const newMarkers = { ...prev };
        delete newMarkers[key];
        return newMarkers;
      }
    });
  }, []);

  useEffect(() => {
    if (map && userLocation && !firstLocationSet.current) {
      map.setCenter(userLocation);
      map.setZoom(12);
      firstLocationSet.current = true;
    } else if (map && userLocation) {
      map.panTo(userLocation);
    }
  }, [map, userLocation]);

  return (
    <>
      {/* User Location Marker */}
      {userLocation && (
        <AdvancedMarker position={userLocation} zIndex={100}>
          <div className="relative">
            <div className="absolute inset-0 bg-blue-500/30 blur-xl rounded-full animate-pulse" />
            <div className="relative flex items-center justify-center w-10 h-10 rounded-full bg-blue-600 border-2 border-white shadow-2xl">
              <User size={20} className="text-white" />
            </div>
            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 border-2 border-white rounded-full" />
          </div>
        </AdvancedMarker>
      )}

      {articles.map((article, idx) => {
        const key = `${article.url}-${idx}`;
        return article.location && (
          <AdvancedMarker
            key={key}
            position={{ lat: article.location.lat, lng: article.location.lng }}
            ref={marker => setMarkerRef(marker, key)}
            onClick={() => {
              setSelectedArticle(article);
              onArticleSelect(article);
            }}
          >
            <div className="group relative cursor-pointer">
               <div className="flex items-center justify-center w-8 h-8 rounded-full bg-zinc-900 border-2 border-emerald-500 shadow-lg group-hover:scale-110 transition-transform">
                  <Shield size={16} className="text-emerald-500" />
               </div>
            </div>
          </AdvancedMarker>
        );
      })}

      {selectedArticle && selectedArticle.location && (
        <InfoWindow
          position={{ lat: selectedArticle.location.lat, lng: selectedArticle.location.lng }}
          onCloseClick={() => setSelectedArticle(null)}
        >
          <div className="p-2 max-w-xs text-zinc-900">
            <h3 className="font-bold text-sm line-clamp-2 mb-1">{selectedArticle.title}</h3>
            <p className="text-xs opacity-70 mb-2">{selectedArticle.source.name} • {selectedArticle.location.name}</p>
            <button 
              onClick={() => onArticleSelect(selectedArticle)}
              className="text-xs font-bold text-emerald-600 hover:underline"
            >
              View Intelligence Report →
            </button>
          </div>
        </InfoWindow>
      )}
    </>
  );
}

export default function MapView({ articles, onArticleSelect, bypassActive = false }: MapViewProps) {
  const [selectedArticle, setSelectedArticle] = useState<NewsArticle | null>(null);
  const [enrichedArticles, setEnrichedArticles] = useState<NewsArticle[]>([]);
  const [userLocation, setUserLocation] = useState<google.maps.LatLngLiteral | null>(null);
  const [geoError, setGeoError] = useState<string | null>(null);

  useEffect(() => {
    if (!navigator.geolocation) {
      setGeoError("Geolocation is not supported by your browser");
      return;
    }

    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        console.log(`User location updated: ${latitude}, ${longitude}`);
        setUserLocation({ lat: latitude, lng: longitude });
      },
      (error) => {
        console.error("Geolocation error:", error);
        setGeoError(error.message);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      }
    );

    return () => navigator.geolocation.clearWatch(watchId);
  }, []);

  if (!hasValidKey && !bypassActive) {
    return (
      <div className="flex items-center justify-center h-full bg-zinc-900 text-zinc-400 p-8 text-center">
        <div className="max-w-md space-y-4">
          <AlertTriangle className="mx-auto text-amber-500" size={32} />
          <h2 className="text-lg font-bold uppercase tracking-tighter">Maps API Key Required</h2>
          <p className="text-xs font-mono leading-relaxed">
            Geospatial intelligence visualization is disabled. Please configure your GOOGLE_MAPS_PLATFORM_KEY in the system settings.
          </p>
        </div>
      </div>
    );
  }

  // Simulate Geocoding for demo purposes if articles don't have location
  useEffect(() => {
    const mockLocations = [
      { lat: 51.5074, lng: -0.1278, name: "London" },
      { lat: 40.7128, lng: -74.0060, name: "New York" },
      { lat: 35.6762, lng: 139.6503, name: "Tokyo" },
      { lat: -33.8688, lng: 151.2093, name: "Sydney" },
      { lat: 48.8566, lng: 2.3522, name: "Paris" },
      { lat: 55.7558, lng: 37.6173, name: "Moscow" },
      { lat: 31.2304, lng: 121.4737, name: "Shanghai" },
      { lat: -23.5505, lng: -46.6333, name: "São Paulo" },
      { lat: 28.6139, lng: 77.2090, name: "New Delhi" },
      { lat: 30.0444, lng: 31.2357, name: "Cairo" },
    ];

    const enriched = articles.map((article, index) => ({
      ...article,
      location: mockLocations[index % mockLocations.length]
    }));
    setEnrichedArticles(enriched);
  }, [articles]);

  return (
    <APIProvider apiKey={API_KEY} version="weekly">
      <div className="relative w-full h-full">
        <Map
          defaultCenter={{ lat: 20, lng: 0 }}
          defaultZoom={3}
          mapId="VERITAS_MAP"
          gestureHandling={'greedy'}
          disableDefaultUI={true}
          // @ts-ignore
          internalUsageAttributionIds={['gmp_mcp_codeassist_v1_aistudio']}
          className="w-full h-full"
          style={{ background: '#18181b' }}
          colorScheme="DARK"
        >
          <MapContent 
            articles={enrichedArticles}
            onArticleSelect={onArticleSelect}
            userLocation={userLocation}
            selectedArticle={selectedArticle}
            setSelectedArticle={setSelectedArticle}
          />
        </Map>

        {/* Geolocation Status Overlay */}
        <div className="absolute bottom-6 right-6 flex flex-col gap-2 pointer-events-none">
          {geoError && (
            <div className="bg-red-500/90 backdrop-blur-md text-white px-3 py-1.5 rounded text-[10px] font-mono uppercase tracking-wider flex items-center gap-2 shadow-xl animate-pulse">
              <AlertTriangle size={12} />
              GPS Error: {geoError}
            </div>
          )}
          {userLocation && (
            <div className="bg-zinc-900/90 backdrop-blur-md border border-zinc-800 text-emerald-500 px-3 py-1.5 rounded text-[10px] font-mono uppercase tracking-wider flex items-center gap-2 shadow-xl pointer-events-auto">
              <Navigation size={12} className="animate-pulse" />
              Satellite Lock: {userLocation.lat.toFixed(4)}, {userLocation.lng.toFixed(4)}
            </div>
          )}
        </div>
      </div>
    </APIProvider>
  );
}
