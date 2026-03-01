import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { toursAPI, bookingsAPI } from './services/api';
import LoginPage from './components/LoginPage';
import RegisterPage from './components/RegisterPage';
import AdminDashboard from './components/AdminDashboard';
import TourCard from './components/TourCard';
import TourModal from './components/TourModal';
import ChatBot from './components/ChatBot';
import BookingFlow from './components/BookingFlow';
import ThankYouPage from './components/ThankYouPage';
import ToursPage from './components/ToursPage';
import DestinationsPage from './components/DestinationsPage';
import AboutPage from './components/AboutPage';

// Types
interface Review {
  id: string;
  name: string;
  avatar: string;
  rating: number;
  date: string;
  comment: string;
}

interface Tour {
  id: string;
  title: string;
  location: string;
  description: string;
  price: number;
  duration: string;
  rating: number;
  image: string;
  category: string[];
  difficulty: string;
  bestFor: string[];
  highlights: string[];
  reviews: Review[];
}

interface BookingData {
  id?: string;
  tourId: string;
  tourTitle: string;
  tourImage: string;
  tourLocation: string;
  tourDuration: string;
  tourPrice: number;
  personalInfo: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    dateOfBirth: string;
    nationality: string;
  };
  travelDetails: {
    travelDate: string;
    travelers: number;
    travelStyle: string;
    accommodation: string;
    dietaryRequirements: string;
    specialRequests: string;
  };
  emergencyContact: {
    name: string;
    relationship: string;
    phone: string;
  };
  paymentInfo: {
    cardHolder: string;
    cardNumber: string;
  };
  totalAmount: number;
}

// Tours Data
const TOURS_DATA: Tour[] = [
  {
    id: 'tour-1',
    title: 'Machu Picchu Explorer',
    location: 'Peru, South America',
    description: 'Journey through the heart of the Inca Empire. Trek ancient trails, explore the Sacred Valley, and witness the sunrise over the legendary Machu Picchu citadel.',
    price: 145000,
    duration: '8 Days',
    rating: 4.9,
    image: 'https://images.unsplash.com/photo-1587595431973-160d0d94add1?w=800',
    category: ['adventure', 'culture', 'hiking'],
    difficulty: 'Moderate',
    bestFor: ['couples', 'solo', 'groups'],
    highlights: ['Inca Trail Trek', 'Machu Picchu Sunrise', 'Sacred Valley Tour', 'Cusco Heritage Walk', 'Local Cuisine Experience'],
    reviews: [
      { id: 'r1', name: 'Rahul Sharma', avatar: '👨', rating: 5, date: '2024-01-15', comment: 'Absolutely breathtaking! Worth every rupee spent.' },
      { id: 'r2', name: 'Priya Patel', avatar: '👩', rating: 5, date: '2024-01-10', comment: 'Life-changing experience. The sunrise was magical!' },
    ],
  },
  {
    id: 'tour-2',
    title: 'Japanese Seasons',
    location: 'Japan, East Asia',
    description: 'Experience the perfect harmony of ancient traditions and cutting-edge modernity. From serene Kyoto temples to the electric streets of Tokyo.',
    price: 165000,
    duration: '10 Days',
    rating: 4.8,
    image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=800',
    category: ['culture', 'city', 'food'],
    difficulty: 'Easy',
    bestFor: ['couples', 'solo', 'family'],
    highlights: ['Tokyo Exploration', 'Mount Fuji Views', 'Kyoto Temples', 'Tea Ceremony', 'Sushi Making Class'],
    reviews: [
      { id: 'r3', name: 'Sneha Reddy', avatar: '👩', rating: 5, date: '2024-01-20', comment: 'Japan exceeded all expectations!' },
    ],
  },
  {
    id: 'tour-3',
    title: 'Serengeti Safari',
    location: 'Tanzania, Africa',
    description: 'Witness the incredible wildlife of Africa on this unforgettable safari. See the Big Five and experience the Great Migration in its full glory.',
    price: 178000,
    duration: '7 Days',
    rating: 4.9,
    image: 'https://images.unsplash.com/photo-1516426122078-c23e76319801?w=800',
    category: ['wildlife', 'adventure', 'nature'],
    difficulty: 'Easy',
    bestFor: ['couples', 'family', 'groups'],
    highlights: ['Big Five Safari', 'Great Migration', 'Ngorongoro Crater', 'Maasai Village', 'Hot Air Balloon Ride'],
    reviews: [
      { id: 'r4', name: 'Deepak Joshi', avatar: '👨', rating: 5, date: '2024-01-18', comment: 'Seeing lions in the wild was surreal!' },
    ],
  },
  {
    id: 'tour-4',
    title: 'Greek Island Hopping',
    location: 'Greece, Mediterranean',
    description: 'Island hop through the stunning Cyclades. Experience the iconic blue domes of Santorini, party in Mykonos, and discover hidden gems.',
    price: 125000,
    duration: '8 Days',
    rating: 4.8,
    image: 'https://images.unsplash.com/photo-1533105079780-92b9be482077?w=800',
    category: ['beach', 'culture', 'romantic'],
    difficulty: 'Easy',
    bestFor: ['couples', 'solo', 'groups'],
    highlights: ['Santorini Sunset', 'Mykonos Beaches', 'Wine Tasting', 'Greek Cooking', 'Ancient Ruins'],
    reviews: [
      { id: 'r5', name: 'Arjun Kapoor', avatar: '👨', rating: 5, date: '2024-01-22', comment: 'Perfect honeymoon destination!' },
    ],
  },
  {
    id: 'tour-5',
    title: 'Bali Wellness Journey',
    location: 'Indonesia, Southeast Asia',
    description: 'Rejuvenate your mind, body, and soul in the spiritual paradise of Bali. Yoga, meditation, spa treatments, and ancient temples await.',
    price: 89000,
    duration: '7 Days',
    rating: 4.7,
    image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800',
    category: ['wellness', 'beach', 'culture'],
    difficulty: 'Easy',
    bestFor: ['solo', 'couples'],
    highlights: ['Ubud Rice Terraces', 'Temple Visits', 'Daily Yoga', 'Spa Treatments', 'Balinese Cooking'],
    reviews: [
      { id: 'r6', name: 'Neha Agarwal', avatar: '👩', rating: 5, date: '2024-01-19', comment: 'Came back feeling completely refreshed!' },
    ],
  },
  {
    id: 'tour-6',
    title: 'Norwegian Fjords',
    location: 'Norway, Scandinavia',
    description: 'Sail through majestic fjords, chase the Northern Lights, and explore charming Scandinavian villages in this winter wonderland.',
    price: 168000,
    duration: '9 Days',
    rating: 4.8,
    image: 'https://images.unsplash.com/photo-1520769669658-f07657f5a307?w=800',
    category: ['nature', 'cruise', 'adventure'],
    difficulty: 'Easy',
    bestFor: ['couples', 'solo', 'family'],
    highlights: ['Fjord Cruise', 'Northern Lights Hunt', 'Bergen Old Town', 'Flam Railway', 'Viking Museum'],
    reviews: [
      { id: 'r7', name: 'Ravi Krishnan', avatar: '👨', rating: 5, date: '2024-01-08', comment: 'The fjords are absolutely stunning!' },
    ],
  },
  {
    id: 'tour-7',
    title: 'Morocco Discovery',
    location: 'Morocco, North Africa',
    description: 'Experience the magic of Morocco from bustling Marrakech souks to golden Sahara dunes. A feast for all senses.',
    price: 98000,
    duration: '8 Days',
    rating: 4.7,
    image: 'https://images.unsplash.com/photo-1489749798305-4fea3ae63d43?w=800',
    category: ['adventure', 'culture', 'desert'],
    difficulty: 'Moderate',
    bestFor: ['couples', 'solo', 'groups'],
    highlights: ['Marrakech Medina', 'Sahara Camping', 'Camel Trek', 'Atlas Mountains', 'Traditional Hammam'],
    reviews: [
      { id: 'r8', name: 'Simran Kaur', avatar: '👩', rating: 5, date: '2024-01-04', comment: 'Vibrant culture and delicious food!' },
    ],
  },
  {
    id: 'tour-8',
    title: 'Iceland Ring Road',
    location: 'Iceland, Nordic',
    description: 'Circle the land of fire and ice. Witness geysers, waterfalls, volcanoes, and the magical Northern Lights on this epic adventure.',
    price: 175000,
    duration: '10 Days',
    rating: 4.9,
    image: 'https://images.unsplash.com/photo-1504893524553-b855bce32c67?w=800',
    category: ['adventure', 'nature', 'road-trip'],
    difficulty: 'Moderate',
    bestFor: ['couples', 'solo', 'groups'],
    highlights: ['Golden Circle', 'Northern Lights', 'Blue Lagoon', 'Glacier Hiking', 'Whale Watching'],
    reviews: [
      { id: 'r9', name: 'Rohit Verma', avatar: '👨', rating: 5, date: '2024-01-21', comment: 'Iceland is otherworldly!' },
    ],
  },
];

// Main App Content
const AppContent: React.FC = () => {
  const { user, isLoading, isAuthenticated, logout } = useAuth();
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [tours, setTours] = useState<Tour[]>(TOURS_DATA);
  const [selectedTour, setSelectedTour] = useState<Tour | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [bookingTour, setBookingTour] = useState<Tour | null>(null);
  const [completedBooking, setCompletedBooking] = useState<BookingData | null>(null);
  const [isLoadingTours, setIsLoadingTours] = useState(true);
  const [currentPage, setCurrentPage] = useState<'home' | 'tours' | 'destinations' | 'about'>('home');
  const [isScrolled, setIsScrolled] = useState(false);

  // Handle scroll for header
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Fetch tours
  useEffect(() => {
    const fetchTours = async () => {
      try {
        const response = await toursAPI.getAll();
        if (response.tours && response.tours.length > 0) {
          setTours(response.tours);
        }
      } catch (error) {
        console.log('Using default tours');
      }
      setIsLoadingTours(false);
    };
    fetchTours();
  }, []);

  // Handle booking completion
  const handleBookingComplete = async (bookingData: BookingData) => {
    try {
      const response = await bookingsAPI.create(bookingData);
      setCompletedBooking({ ...bookingData, id: response.booking.id });
      setBookingTour(null);
    } catch (error) {
      setCompletedBooking({ ...bookingData, id: `WL${Date.now().toString(36).toUpperCase()}` });
      setBookingTour(null);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-emerald-900 to-slate-900 flex items-center justify-center">
        <div className="text-center text-white">
          <div className="relative w-24 h-24 mx-auto mb-6">
            <div className="absolute inset-0 border-4 border-emerald-500/30 rounded-full"></div>
            <div className="absolute inset-0 border-4 border-transparent border-t-emerald-500 rounded-full animate-spin"></div>
            <span className="absolute inset-0 flex items-center justify-center text-4xl">🌍</span>
          </div>
          <p className="text-xl font-light">Loading your adventure...</p>
        </div>
      </div>
    );
  }

  // Auth pages
  if (!isAuthenticated) {
    if (authMode === 'login') {
      return <LoginPage onSwitchToRegister={() => setAuthMode('register')} />;
    }
    return <RegisterPage onSwitchToLogin={() => setAuthMode('login')} />;
  }

  // Admin Dashboard
  if (user?.role === 'admin') {
    return <AdminDashboard />;
  }

  // Thank You Page
  if (completedBooking) {
    return (
      <ThankYouPage
        booking={completedBooking}
        onBackToHome={() => {
          setCompletedBooking(null);
          setCurrentPage('home');
        }}
      />
    );
  }

  // Booking Flow
  if (bookingTour) {
    return (
      <BookingFlow
        tour={bookingTour}
        onComplete={handleBookingComplete}
        onCancel={() => setBookingTour(null)}
      />
    );
  }

  // Tours Page
  if (currentPage === 'tours') {
    return (
      <>
        <ToursPage
          tours={tours}
          onBack={() => setCurrentPage('home')}
          onViewTour={(tour) => setSelectedTour(tour)}
          onBookTour={(tour) => setBookingTour(tour)}
        />
        {selectedTour && (
          <TourModal
            tour={selectedTour}
            onClose={() => setSelectedTour(null)}
            onBook={() => {
              setBookingTour(selectedTour);
              setSelectedTour(null);
            }}
          />
        )}
        <ChatBot
          tours={tours}
          onViewTour={(tour: Tour) => setSelectedTour(tour)}
          onBookTour={(tour: Tour) => setBookingTour(tour)}
        />
      </>
    );
  }

  // Destinations Page
  if (currentPage === 'destinations') {
    return (
      <>
        <DestinationsPage
          onBack={() => setCurrentPage('home')}
          onExploreTours={() => setCurrentPage('tours')}
        />
        <ChatBot
          tours={tours}
          onViewTour={(tour: Tour) => setSelectedTour(tour)}
          onBookTour={(tour: Tour) => setBookingTour(tour)}
        />
      </>
    );
  }

  // About Page
  if (currentPage === 'about') {
    return (
      <>
        <AboutPage onBack={() => setCurrentPage('home')} />
        <ChatBot
          tours={tours}
          onViewTour={(tour: Tour) => setSelectedTour(tour)}
          onBookTour={(tour: Tour) => setBookingTour(tour)}
        />
      </>
    );
  }

  // Filter tours by category
  const filteredTours = selectedCategory === 'all'
    ? tours
    : tours.filter((tour) => tour.category.includes(selectedCategory));

  const categories = [
    { id: 'all', label: 'All Destinations', icon: '🌍' },
    { id: 'adventure', label: 'Adventure', icon: '🏔️' },
    { id: 'beach', label: 'Beach', icon: '🏖️' },
    { id: 'culture', label: 'Culture', icon: '🏛️' },
    { id: 'wildlife', label: 'Wildlife', icon: '🦁' },
    { id: 'nature', label: 'Nature', icon: '🌲' },
    { id: 'wellness', label: 'Wellness', icon: '🧘' },
  ];

  const featuredDestinations = [
    { name: 'Santorini', country: 'Greece', image: 'https://images.unsplash.com/photo-1533105079780-92b9be482077?w=400' },
    { name: 'Kyoto', country: 'Japan', image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=400' },
    { name: 'Bali', country: 'Indonesia', image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=400' },
    { name: 'Machu Picchu', country: 'Peru', image: 'https://images.unsplash.com/photo-1587595431973-160d0d94add1?w=400' },
  ];

  // HOME PAGE
  return (
    <div className="min-h-screen bg-slate-950">
      {/* Navigation Header */}
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${isScrolled ? 'bg-slate-900/95 backdrop-blur-lg shadow-2xl py-3' : 'bg-transparent py-5'}`}>
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-center">
            {/* Logo */}
            <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setCurrentPage('home')}>
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center shadow-lg shadow-emerald-500/30">
                <span className="text-xl">🌍</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-white" style={{ fontFamily: 'Playfair Display, serif' }}>Wanderlust</h1>
                <p className="text-[10px] text-emerald-300 -mt-0.5">Premium Travel</p>
              </div>
            </div>

            {/* Navigation Links */}
            <nav className="hidden md:flex items-center space-x-1">
              {[
                { id: 'home', label: 'Home' },
                { id: 'tours', label: 'Tours' },
                { id: 'destinations', label: 'Destinations' },
                { id: 'about', label: 'About' },
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => setCurrentPage(item.id as 'home' | 'tours' | 'destinations' | 'about')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    currentPage === item.id
                      ? 'bg-emerald-500/20 text-emerald-400'
                      : 'text-gray-300 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </nav>

            {/* User Menu */}
            <div className="flex items-center space-x-4">
              <div className="hidden sm:block text-right">
                <p className="text-sm font-medium text-white">{user?.name?.split(' ')[0]}</p>
                <p className="text-xs text-emerald-300">Explorer</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-white font-semibold">
                {user?.name?.charAt(0).toUpperCase()}
              </div>
              <button
                onClick={logout}
                className="px-4 py-2 text-sm text-gray-300 hover:text-white border border-gray-600 hover:border-emerald-500 rounded-lg transition-all"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Navigation */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-slate-900/95 backdrop-blur-lg border-t border-slate-800">
        <div className="flex justify-around py-2">
          {[
            { id: 'home', label: 'Home', icon: '🏠' },
            { id: 'tours', label: 'Tours', icon: '🗺️' },
            { id: 'destinations', label: 'Places', icon: '📍' },
            { id: 'about', label: 'About', icon: 'ℹ️' },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setCurrentPage(item.id as 'home' | 'tours' | 'destinations' | 'about')}
              className={`flex flex-col items-center py-2 px-4 rounded-lg transition-all ${
                currentPage === item.id ? 'text-emerald-400' : 'text-gray-400'
              }`}
            >
              <span className="text-xl">{item.icon}</span>
              <span className="text-xs mt-1">{item.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=1920')] bg-cover bg-center" />
          <div className="absolute inset-0 bg-gradient-to-b from-slate-950/70 via-slate-950/50 to-slate-950" />
        </div>

        {/* Floating Elements */}
        <div className="absolute top-1/4 left-10 text-6xl opacity-20 animate-bounce" style={{ animationDuration: '3s' }}>✈️</div>
        <div className="absolute bottom-1/3 right-10 text-5xl opacity-20 animate-bounce" style={{ animationDuration: '4s' }}>🌴</div>
        <div className="absolute top-1/2 left-1/4 text-4xl opacity-20 animate-bounce" style={{ animationDuration: '5s' }}>⛰️</div>

        {/* Content */}
        <div className="relative z-10 text-center px-4 max-w-5xl mx-auto pt-20">
          <div>
            <span className="inline-block px-4 py-1.5 bg-emerald-500/20 border border-emerald-500/30 rounded-full text-emerald-300 text-sm mb-6">
              ✨ Curated Travel Experiences
            </span>
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight" style={{ fontFamily: 'Playfair Display, serif' }}>
              Discover Your Next
              <span className="block bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
                Adventure
              </span>
            </h1>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto leading-relaxed">
              Explore handpicked destinations starting from{' '}
              <span className="text-emerald-400 font-semibold">{formatCurrency(89000)}</span>.
              Premium experiences crafted for unforgettable memories.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => setCurrentPage('tours')}
              className="px-8 py-4 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-semibold rounded-xl transition-all transform hover:scale-105 shadow-lg shadow-emerald-500/30"
            >
              Explore Tours →
            </button>
            <button
              onClick={() => setCurrentPage('destinations')}
              className="px-8 py-4 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-xl border border-white/20 backdrop-blur-sm transition-all"
            >
              View Destinations
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-8 mt-16">
            {[
              { value: '50K+', label: 'Happy Travelers' },
              { value: '25+', label: 'Destinations' },
              { value: '4.9★', label: 'Average Rating' },
            ].map((stat, idx) => (
              <div key={idx} className="text-center">
                <p className="text-3xl md:text-4xl font-bold text-white">{stat.value}</p>
                <p className="text-gray-400 text-sm">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center pt-2">
            <div className="w-1 h-2 bg-white/50 rounded-full" />
          </div>
        </div>
      </section>

      {/* Featured Destinations */}
      <section className="py-20 px-4 bg-gradient-to-b from-slate-950 to-slate-900">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-emerald-400 text-sm font-medium">POPULAR CHOICES</span>
            <h2 className="text-4xl font-bold text-white mt-2" style={{ fontFamily: 'Playfair Display, serif' }}>
              Featured Destinations
            </h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {featuredDestinations.map((dest, idx) => (
              <div
                key={idx}
                onClick={() => setCurrentPage('destinations')}
                className="group relative h-64 rounded-2xl overflow-hidden cursor-pointer"
              >
                <img
                  src={dest.image}
                  alt={dest.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                <div className="absolute bottom-4 left-4">
                  <p className="text-white font-semibold text-lg">{dest.name}</p>
                  <p className="text-emerald-300 text-sm">{dest.country}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-8">
            <button
              onClick={() => setCurrentPage('destinations')}
              className="px-6 py-3 border border-emerald-500 text-emerald-400 hover:bg-emerald-500 hover:text-white rounded-xl transition-all"
            >
              View All Destinations →
            </button>
          </div>
        </div>
      </section>

      {/* Category Filter */}
      <section className="py-8 bg-slate-900 sticky top-16 z-30">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-wrap justify-center gap-3">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`flex items-center space-x-2 px-5 py-2.5 rounded-full transition-all transform hover:scale-105 ${
                  selectedCategory === cat.id
                    ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg shadow-emerald-500/30'
                    : 'bg-slate-800 text-gray-300 hover:bg-slate-700 border border-slate-700'
                }`}
              >
                <span>{cat.icon}</span>
                <span className="text-sm font-medium">{cat.label}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Tours Grid */}
      <section className="py-16 bg-slate-900">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-end mb-10">
            <div>
              <span className="text-emerald-400 text-sm font-medium">CURATED FOR YOU</span>
              <h2 className="text-3xl font-bold text-white mt-1" style={{ fontFamily: 'Playfair Display, serif' }}>
                {selectedCategory === 'all' ? 'All Adventures' : `${selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1)} Tours`}
              </h2>
            </div>
            <button
              onClick={() => setCurrentPage('tours')}
              className="text-emerald-400 hover:text-emerald-300 text-sm font-medium"
            >
              View All →
            </button>
          </div>

          {isLoadingTours ? (
            <div className="text-center py-16">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-emerald-500 mx-auto"></div>
              <p className="mt-4 text-gray-400">Discovering amazing tours...</p>
            </div>
          ) : filteredTours.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-gray-400 text-lg">No tours found in this category.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredTours.slice(0, 6).map((tour) => (
                <TourCard
                  key={tour.id}
                  tour={tour}
                  onViewDetails={() => setSelectedTour(tour)}
                  onBook={() => setBookingTour(tour)}
                />
              ))}
            </div>
          )}

          {filteredTours.length > 6 && (
            <div className="text-center mt-12">
              <button
                onClick={() => setCurrentPage('tours')}
                className="px-8 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-semibold rounded-xl transition-all"
              >
                View All {filteredTours.length} Tours →
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20 bg-gradient-to-b from-slate-900 to-slate-950">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <span className="text-emerald-400 text-sm font-medium">WHY WANDERLUST</span>
            <h2 className="text-4xl font-bold text-white mt-2" style={{ fontFamily: 'Playfair Display, serif' }}>
              Travel with Confidence
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: '🎯', title: 'AI-Powered Recommendations', desc: 'Our smart chatbot learns your preferences to suggest perfect destinations.' },
              { icon: '💎', title: 'Premium Experiences', desc: 'Handpicked tours with quality accommodations and expert local guides.' },
              { icon: '🛡️', title: 'Secure & Trusted', desc: 'Verified operators, secure payments, and 24/7 travel support.' },
            ].map((item, idx) => (
              <div
                key={idx}
                className="text-center p-8 rounded-2xl bg-slate-800/50 border border-slate-700 hover:border-emerald-500/50 transition-all hover:-translate-y-2"
              >
                <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-teal-500/20 flex items-center justify-center text-3xl">
                  {item.icon}
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">{item.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-emerald-600 to-teal-600">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-white mb-4" style={{ fontFamily: 'Playfair Display, serif' }}>
            Ready for Your Next Adventure?
          </h2>
          <p className="text-emerald-100 text-lg mb-8">
            Join thousands of travelers who have discovered their dream destinations with us.
          </p>
          <button
            onClick={() => setCurrentPage('tours')}
            className="px-8 py-4 bg-white text-emerald-600 font-semibold rounded-xl hover:bg-gray-100 transition-colors shadow-lg"
          >
            Start Exploring →
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-950 border-t border-slate-800 py-12 pb-24 md:pb-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center">
                  <span className="text-xl">🌍</span>
                </div>
                <span className="text-xl font-bold text-white" style={{ fontFamily: 'Playfair Display, serif' }}>Wanderlust</span>
              </div>
              <p className="text-gray-400 text-sm">
                Extraordinary travel experiences for the modern explorer.
              </p>
            </div>
            {[
              { title: 'Explore', links: ['All Tours', 'Destinations', 'Reviews', 'Blog'] },
              { title: 'Support', links: ['Help Center', 'Contact Us', 'FAQs', 'Travel Insurance'] },
              { title: 'Legal', links: ['Privacy Policy', 'Terms of Service', 'Refund Policy', 'Cookies'] },
            ].map((col, idx) => (
              <div key={idx}>
                <h4 className="font-semibold text-white mb-4">{col.title}</h4>
                <ul className="space-y-2">
                  {col.links.map((link) => (
                    <li key={link}>
                      <button className="text-gray-400 hover:text-emerald-400 text-sm transition-colors">
                        {link}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-500 text-sm">© 2024 Wanderlust. All rights reserved.</p>
            <div className="flex space-x-4 mt-4 md:mt-0">
              {['📘', '📸', '🐦', '💼'].map((icon, idx) => (
                <button key={idx} className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-slate-700 transition-colors">
                  {icon}
                </button>
              ))}
            </div>
          </div>
        </div>
      </footer>

      {/* Tour Modal */}
      {selectedTour && (
        <TourModal
          tour={selectedTour}
          onClose={() => setSelectedTour(null)}
          onBook={() => {
            setBookingTour(selectedTour);
            setSelectedTour(null);
          }}
        />
      )}

      {/* ChatBot */}
      <ChatBot
        tours={tours}
        onViewTour={(tour: Tour) => setSelectedTour(tour)}
        onBookTour={(tour: Tour) => setBookingTour(tour)}
      />
    </div>
  );
};

// App with Auth Provider
const App: React.FC = () => {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
};

export default App;
