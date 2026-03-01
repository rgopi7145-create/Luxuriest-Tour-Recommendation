const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();
const PORT = 3001;
const JWT_SECRET = 'tourbot-secret-key-2024';

// Middleware
app.use(cors());
app.use(express.json());

// Database file path
const DB_PATH = path.join(__dirname, 'database.json');

// Initialize database
const initializeDatabase = () => {
  const initialData = {
    users: [
      {
        id: 'admin-001',
        email: 'admin@tourbot.com',
        password: bcrypt.hashSync('admin123', 10),
        name: 'Admin User',
        phone: '+91 9876543210',
        role: 'admin',
        createdAt: new Date().toISOString()
      }
    ],
    bookings: [],
    tours: [
      {
        id: 'tour-1',
        title: 'Machu Picchu Adventure',
        location: 'Peru',
        description: 'Embark on an unforgettable journey to the ancient Incan citadel of Machu Picchu. Trek through the Sacred Valley, explore Cusco, and witness breathtaking Andean landscapes.',
        price: 189999,
        duration: '8 Days',
        rating: 4.9,
        image: 'https://images.unsplash.com/photo-1587595431973-160d0d94add1?w=800',
        category: ['adventure', 'culture', 'hiking'],
        difficulty: 'Moderate',
        bestFor: ['couples', 'solo', 'groups'],
        highlights: ['Inca Trail Trek', 'Machu Picchu Sunrise', 'Sacred Valley Tour', 'Cusco City Walk', 'Local Cuisine Experience'],
        reviews: [
          { id: 'r1', name: 'Rahul Sharma', avatar: '👨', rating: 5, date: '2024-01-15', comment: 'Absolutely breathtaking! The trek was challenging but worth every step. Our guide was knowledgeable and friendly.' },
          { id: 'r2', name: 'Priya Patel', avatar: '👩', rating: 5, date: '2024-01-10', comment: 'A life-changing experience. Watching sunrise at Machu Picchu was magical. Highly recommend!' },
          { id: 'r3', name: 'Amit Kumar', avatar: '👨', rating: 4, date: '2023-12-28', comment: 'Great tour with excellent organization. The altitude can be challenging, so prepare well.' }
        ]
      },
      {
        id: 'tour-2',
        title: 'Japanese Cultural Immersion',
        location: 'Japan',
        description: 'Discover the perfect blend of ancient traditions and modern innovation in Japan. From serene temples in Kyoto to the bustling streets of Tokyo.',
        price: 245999,
        duration: '10 Days',
        rating: 4.8,
        image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=800',
        category: ['culture', 'city', 'food'],
        difficulty: 'Easy',
        bestFor: ['couples', 'solo', 'family'],
        highlights: ['Tokyo City Tour', 'Mount Fuji Visit', 'Kyoto Temples', 'Traditional Tea Ceremony', 'Sushi Making Class'],
        reviews: [
          { id: 'r4', name: 'Sneha Reddy', avatar: '👩', rating: 5, date: '2024-01-20', comment: 'Japan exceeded all my expectations! The blend of tradition and technology is fascinating.' },
          { id: 'r5', name: 'Vikram Singh', avatar: '👨', rating: 5, date: '2024-01-05', comment: 'The cherry blossoms were stunning. Great itinerary covering all major attractions.' }
        ]
      },
      {
        id: 'tour-3',
        title: 'Serengeti Safari Experience',
        location: 'Tanzania',
        description: 'Witness the incredible wildlife of Africa on this safari adventure. See the Big Five and experience the Great Migration in the Serengeti.',
        price: 324999,
        duration: '7 Days',
        rating: 4.9,
        image: 'https://images.unsplash.com/photo-1516426122078-c23e76319801?w=800',
        category: ['wildlife', 'adventure', 'nature'],
        difficulty: 'Easy',
        bestFor: ['couples', 'family', 'groups'],
        highlights: ['Big Five Safari', 'Great Migration', 'Ngorongoro Crater', 'Maasai Village Visit', 'Hot Air Balloon Ride'],
        reviews: [
          { id: 'r6', name: 'Deepak Joshi', avatar: '👨', rating: 5, date: '2024-01-18', comment: 'Seeing lions and elephants in the wild was surreal. The lodges were luxurious and comfortable.' },
          { id: 'r7', name: 'Anjali Mehta', avatar: '👩', rating: 5, date: '2024-01-12', comment: 'A dream come true! The hot air balloon ride over Serengeti was the highlight.' }
        ]
      },
      {
        id: 'tour-4',
        title: 'Norwegian Fjords Cruise',
        location: 'Norway',
        description: 'Sail through the majestic Norwegian fjords, witness the Northern Lights, and explore charming Scandinavian villages.',
        price: 278999,
        duration: '9 Days',
        rating: 4.7,
        image: 'https://images.unsplash.com/photo-1520769669658-f07657f5a307?w=800',
        category: ['nature', 'cruise', 'adventure'],
        difficulty: 'Easy',
        bestFor: ['couples', 'solo', 'family'],
        highlights: ['Fjord Cruise', 'Northern Lights', 'Bergen Old Town', 'Flam Railway', 'Viking History Museum'],
        reviews: [
          { id: 'r8', name: 'Ravi Krishnan', avatar: '👨', rating: 5, date: '2024-01-08', comment: 'The fjords are absolutely stunning. Seeing the Northern Lights was a bucket list moment.' },
          { id: 'r9', name: 'Meera Nair', avatar: '👩', rating: 4, date: '2023-12-30', comment: 'Beautiful scenery everywhere you look. Pack warm clothes!' }
        ]
      },
      {
        id: 'tour-5',
        title: 'Greek Islands Paradise',
        location: 'Greece',
        description: 'Island hop through the stunning Cyclades. Experience the iconic blue domes of Santorini, party in Mykonos, and discover hidden gems.',
        price: 199999,
        duration: '8 Days',
        rating: 4.8,
        image: 'https://images.unsplash.com/photo-1533105079780-92b9be482077?w=800',
        category: ['beach', 'culture', 'romantic'],
        difficulty: 'Easy',
        bestFor: ['couples', 'solo', 'groups'],
        highlights: ['Santorini Sunset', 'Mykonos Beaches', 'Ancient Delos', 'Greek Cooking Class', 'Wine Tasting'],
        reviews: [
          { id: 'r10', name: 'Arjun Kapoor', avatar: '👨', rating: 5, date: '2024-01-22', comment: 'Perfect honeymoon destination! The sunsets in Santorini are unmatched.' },
          { id: 'r11', name: 'Kavya Sharma', avatar: '👩', rating: 5, date: '2024-01-14', comment: 'Greek food, beautiful beaches, and amazing hospitality. Loved every moment!' }
        ]
      },
      {
        id: 'tour-6',
        title: 'Patagonia Expedition',
        location: 'Chile',
        description: 'Explore the wild beauty of Patagonia with its towering glaciers, pristine lakes, and dramatic mountain peaks.',
        price: 356999,
        duration: '12 Days',
        rating: 4.9,
        image: 'https://images.unsplash.com/photo-1531761535209-180857e67b95?w=800',
        category: ['adventure', 'hiking', 'nature'],
        difficulty: 'Challenging',
        bestFor: ['solo', 'groups'],
        highlights: ['Torres del Paine', 'Perito Moreno Glacier', 'W Trek', 'Wildlife Spotting', 'Estancia Experience'],
        reviews: [
          { id: 'r12', name: 'Karthik Rajan', avatar: '👨', rating: 5, date: '2024-01-16', comment: 'The most beautiful landscapes I have ever seen. Challenging but incredibly rewarding.' },
          { id: 'r13', name: 'Divya Gupta', avatar: '👩', rating: 5, date: '2024-01-02', comment: 'Patagonia is a hiker\'s paradise. The glacier trekking was unforgettable.' }
        ]
      },
      {
        id: 'tour-7',
        title: 'Bali Wellness Retreat',
        location: 'Indonesia',
        description: 'Rejuvenate your mind, body, and soul in the spiritual island of Bali. Yoga, meditation, spa treatments, and beautiful temples await.',
        price: 145999,
        duration: '7 Days',
        rating: 4.6,
        image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800',
        category: ['wellness', 'beach', 'culture'],
        difficulty: 'Easy',
        bestFor: ['solo', 'couples'],
        highlights: ['Ubud Rice Terraces', 'Temple Visits', 'Yoga Sessions', 'Spa Treatments', 'Balinese Cooking'],
        reviews: [
          { id: 'r14', name: 'Neha Agarwal', avatar: '👩', rating: 5, date: '2024-01-19', comment: 'Exactly what I needed! Came back feeling completely refreshed and rejuvenated.' },
          { id: 'r15', name: 'Suresh Menon', avatar: '👨', rating: 4, date: '2024-01-06', comment: 'Peaceful and beautiful. The yoga sessions were excellent.' }
        ]
      },
      {
        id: 'tour-8',
        title: 'Iceland Ring Road',
        location: 'Iceland',
        description: 'Circle the land of fire and ice on this epic road trip. Witness geysers, waterfalls, volcanoes, and the magical Northern Lights.',
        price: 312999,
        duration: '10 Days',
        rating: 4.8,
        image: 'https://images.unsplash.com/photo-1520769669658-f07657f5a307?w=800',
        category: ['adventure', 'nature', 'road-trip'],
        difficulty: 'Moderate',
        bestFor: ['couples', 'solo', 'groups'],
        highlights: ['Golden Circle', 'Northern Lights', 'Blue Lagoon', 'Glacier Hiking', 'Whale Watching'],
        reviews: [
          { id: 'r16', name: 'Rohit Verma', avatar: '👨', rating: 5, date: '2024-01-21', comment: 'Iceland is otherworldly! Every day brought new incredible landscapes.' },
          { id: 'r17', name: 'Pooja Sethi', avatar: '👩', rating: 5, date: '2024-01-09', comment: 'The Blue Lagoon and Northern Lights were magical. A must-visit destination!' }
        ]
      },
      {
        id: 'tour-9',
        title: 'Moroccan Desert Adventure',
        location: 'Morocco',
        description: 'Experience the magic of Morocco from the bustling souks of Marrakech to the golden dunes of the Sahara Desert.',
        price: 167999,
        duration: '8 Days',
        rating: 4.7,
        image: 'https://images.unsplash.com/photo-1489749798305-4fea3ae63d43?w=800',
        category: ['adventure', 'culture', 'desert'],
        difficulty: 'Moderate',
        bestFor: ['couples', 'solo', 'groups'],
        highlights: ['Marrakech Medina', 'Sahara Camping', 'Camel Trek', 'Atlas Mountains', 'Traditional Hammam'],
        reviews: [
          { id: 'r18', name: 'Aditya Rao', avatar: '👨', rating: 5, date: '2024-01-17', comment: 'Sleeping under the stars in the Sahara was incredible. Morocco is full of surprises!' },
          { id: 'r19', name: 'Simran Kaur', avatar: '👩', rating: 4, date: '2024-01-04', comment: 'Vibrant culture and delicious food. The camel trek was a highlight.' }
        ]
      },
      {
        id: 'tour-10',
        title: 'New Zealand Adventure',
        location: 'New Zealand',
        description: 'From the Shire to Milford Sound, explore the stunning landscapes of New Zealand through thrilling adventures and scenic tours.',
        price: 389999,
        duration: '14 Days',
        rating: 4.9,
        image: 'https://images.unsplash.com/photo-1469521669194-babb45599def?w=800',
        category: ['adventure', 'nature', 'hiking'],
        difficulty: 'Moderate',
        bestFor: ['couples', 'solo', 'family', 'groups'],
        highlights: ['Milford Sound', 'Hobbiton', 'Queenstown Adventures', 'Rotorua Geothermals', 'Glacier Walk'],
        reviews: [
          { id: 'r20', name: 'Varun Malhotra', avatar: '👨', rating: 5, date: '2024-01-23', comment: 'New Zealand is adventure heaven! Bungee jumping in Queenstown was thrilling.' },
          { id: 'r21', name: 'Ishita Das', avatar: '👩', rating: 5, date: '2024-01-11', comment: 'Absolutely stunning country. Hobbiton was a dream for any LOTR fan!' }
        ]
      }
    ],
    chatLogs: [],
    activityLogs: []
  };

  if (!fs.existsSync(DB_PATH)) {
    fs.writeFileSync(DB_PATH, JSON.stringify(initialData, null, 2));
    console.log('Database initialized with default data');
  }
};

// Read database
const readDB = () => {
  try {
    const data = fs.readFileSync(DB_PATH, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    initializeDatabase();
    return JSON.parse(fs.readFileSync(DB_PATH, 'utf8'));
  }
};

// Write database
const writeDB = (data) => {
  fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
};

// Middleware to verify JWT token
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid or expired token' });
    }
    req.user = user;
    next();
  });
};

// Log activity
const logActivity = (action, userId, details) => {
  const db = readDB();
  db.activityLogs.push({
    id: uuidv4(),
    action,
    userId,
    details,
    timestamp: new Date().toISOString()
  });
  writeDB(db);
};

// ==================== AUTH ROUTES ====================

// Register
app.post('/api/auth/register', async (req, res) => {
  try {
    const { email, password, name, phone } = req.body;
    const db = readDB();

    // Check if user exists
    if (db.users.find(u => u.email === email)) {
      return res.status(400).json({ error: 'Email already registered' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const newUser = {
      id: uuidv4(),
      email,
      password: hashedPassword,
      name,
      phone,
      role: 'user',
      createdAt: new Date().toISOString()
    };

    db.users.push(newUser);
    writeDB(db);

    // Generate token
    const token = jwt.sign({ id: newUser.id, email: newUser.email, role: newUser.role }, JWT_SECRET, { expiresIn: '24h' });

    logActivity('USER_REGISTERED', newUser.id, { email, name });

    res.status(201).json({
      message: 'Registration successful',
      user: { id: newUser.id, email: newUser.email, name: newUser.name, phone: newUser.phone, role: newUser.role },
      token
    });
  } catch (error) {
    res.status(500).json({ error: 'Registration failed' });
  }
});

// Login
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const db = readDB();

    // Find user
    const user = db.users.find(u => u.email === email);
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Check password
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Generate token
    const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: '24h' });

    logActivity('USER_LOGIN', user.id, { email });

    res.json({
      message: 'Login successful',
      user: { id: user.id, email: user.email, name: user.name, phone: user.phone, role: user.role },
      token
    });
  } catch (error) {
    res.status(500).json({ error: 'Login failed' });
  }
});

// Get current user
app.get('/api/auth/me', authenticateToken, (req, res) => {
  const db = readDB();
  const user = db.users.find(u => u.id === req.user.id);
  
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  res.json({
    user: { id: user.id, email: user.email, name: user.name, phone: user.phone, role: user.role }
  });
});

// ==================== TOUR ROUTES ====================

// Get all tours
app.get('/api/tours', (req, res) => {
  const db = readDB();
  res.json({ tours: db.tours });
});

// Get single tour
app.get('/api/tours/:id', (req, res) => {
  const db = readDB();
  const tour = db.tours.find(t => t.id === req.params.id);
  
  if (!tour) {
    return res.status(404).json({ error: 'Tour not found' });
  }

  res.json({ tour });
});

// Add review to tour
app.post('/api/tours/:id/reviews', authenticateToken, (req, res) => {
  const db = readDB();
  const tourIndex = db.tours.findIndex(t => t.id === req.params.id);
  
  if (tourIndex === -1) {
    return res.status(404).json({ error: 'Tour not found' });
  }

  const user = db.users.find(u => u.id === req.user.id);
  const newReview = {
    id: uuidv4(),
    name: user.name,
    avatar: '👤',
    rating: req.body.rating,
    date: new Date().toISOString().split('T')[0],
    comment: req.body.comment
  };

  db.tours[tourIndex].reviews.push(newReview);
  writeDB(db);

  logActivity('REVIEW_ADDED', req.user.id, { tourId: req.params.id, rating: req.body.rating });

  res.status(201).json({ message: 'Review added', review: newReview });
});

// ==================== BOOKING ROUTES ====================

// Create booking
app.post('/api/bookings', authenticateToken, (req, res) => {
  try {
    const db = readDB();
    const bookingData = req.body;

    const newBooking = {
      id: `TB${uuidv4().substring(0, 8).toUpperCase()}`,
      oderId: bookingData.oderId,
      oderId: bookingData.oderId,
      oderId: bookingData.oderId,
      oderId: bookingData.oderId,
      oderId: bookingData.oderId,
      userId: req.user.id,
      oderId: bookingData.oderId,
      oderId: bookingData.oderId,
      oderId: bookingData.oderId,
      tourId: bookingData.tourId,
      tourTitle: bookingData.tourTitle,
      tourImage: bookingData.tourImage,
      tourLocation: bookingData.tourLocation,
      tourDuration: bookingData.tourDuration,
      personalInfo: bookingData.personalInfo,
      travelDetails: bookingData.travelDetails,
      emergencyContact: bookingData.emergencyContact,
      paymentInfo: {
        cardLast4: bookingData.paymentInfo.cardNumber.slice(-4),
        cardHolder: bookingData.paymentInfo.cardHolder
      },
      totalAmount: bookingData.totalAmount,
      status: 'confirmed',
      createdAt: new Date().toISOString()
    };

    db.bookings.push(newBooking);
    writeDB(db);

    logActivity('BOOKING_CREATED', req.user.id, { bookingId: newBooking.id, tourTitle: newBooking.tourTitle, amount: newBooking.totalAmount });

    res.status(201).json({ message: 'Booking successful', booking: newBooking });
  } catch (error) {
    res.status(500).json({ error: 'Booking failed' });
  }
});

// Get user's bookings
app.get('/api/bookings/my', authenticateToken, (req, res) => {
  const db = readDB();
  const userBookings = db.bookings.filter(b => b.userId === req.user.id);
  res.json({ bookings: userBookings });
});

// Get all bookings (admin only)
app.get('/api/bookings', authenticateToken, (req, res) => {
  const db = readDB();
  const user = db.users.find(u => u.id === req.user.id);

  if (user.role !== 'admin') {
    return res.status(403).json({ error: 'Admin access required' });
  }

  res.json({ bookings: db.bookings });
});

// Update booking status (admin only)
app.patch('/api/bookings/:id', authenticateToken, (req, res) => {
  const db = readDB();
  const user = db.users.find(u => u.id === req.user.id);

  if (user.role !== 'admin') {
    return res.status(403).json({ error: 'Admin access required' });
  }

  const bookingIndex = db.bookings.findIndex(b => b.id === req.params.id);
  if (bookingIndex === -1) {
    return res.status(404).json({ error: 'Booking not found' });
  }

  db.bookings[bookingIndex] = { ...db.bookings[bookingIndex], ...req.body };
  writeDB(db);

  logActivity('BOOKING_UPDATED', req.user.id, { bookingId: req.params.id, changes: req.body });

  res.json({ message: 'Booking updated', booking: db.bookings[bookingIndex] });
});

// ==================== USER ROUTES (Admin) ====================

// Get all users (admin only)
app.get('/api/users', authenticateToken, (req, res) => {
  const db = readDB();
  const user = db.users.find(u => u.id === req.user.id);

  if (user.role !== 'admin') {
    return res.status(403).json({ error: 'Admin access required' });
  }

  const usersWithoutPasswords = db.users.map(u => ({
    id: u.id,
    email: u.email,
    name: u.name,
    phone: u.phone,
    role: u.role,
    createdAt: u.createdAt
  }));

  res.json({ users: usersWithoutPasswords });
});

// ==================== CHAT ROUTES ====================

// Save chat message
app.post('/api/chat', authenticateToken, (req, res) => {
  const db = readDB();
  const { message, response } = req.body;

  const chatLog = {
    id: uuidv4(),
    oderId: uuidv4(),
    userId: req.user.id,
    message,
    response,
    timestamp: new Date().toISOString()
  };

  db.chatLogs.push(chatLog);
  writeDB(db);

  res.status(201).json({ message: 'Chat logged', chatLog });
});

// Get chat history
app.get('/api/chat/history', authenticateToken, (req, res) => {
  const db = readDB();
  const userChats = db.chatLogs.filter(c => c.userId === req.user.id);
  res.json({ chats: userChats });
});

// ==================== ACTIVITY LOGS (Admin) ====================

app.get('/api/activity-logs', authenticateToken, (req, res) => {
  const db = readDB();
  const user = db.users.find(u => u.id === req.user.id);

  if (user.role !== 'admin') {
    return res.status(403).json({ error: 'Admin access required' });
  }

  res.json({ logs: db.activityLogs.slice(-100).reverse() });
});

// ==================== STATS (Admin) ====================

app.get('/api/stats', authenticateToken, (req, res) => {
  const db = readDB();
  const user = db.users.find(u => u.id === req.user.id);

  if (user.role !== 'admin') {
    return res.status(403).json({ error: 'Admin access required' });
  }

  const totalBookings = db.bookings.length;
  const totalRevenue = db.bookings.reduce((sum, b) => sum + b.totalAmount, 0);
  const totalUsers = db.users.filter(u => u.role === 'user').length;
  const totalTravelers = db.bookings.reduce((sum, b) => sum + (b.travelDetails?.travelers || 1), 0);

  const bookingsByTour = db.tours.map(tour => ({
    tour: tour.title,
    count: db.bookings.filter(b => b.tourId === tour.id).length
  })).sort((a, b) => b.count - a.count);

  const recentBookings = db.bookings.slice(-5).reverse();

  res.json({
    stats: {
      totalBookings,
      totalRevenue,
      totalUsers,
      totalTravelers,
      bookingsByTour,
      recentBookings
    }
  });
});

// Initialize database and start server
initializeDatabase();

app.listen(PORT, () => {
  console.log(`🚀 TourBot Backend Server running on http://localhost:${PORT}`);
  console.log(`📁 Database file: ${DB_PATH}`);
});
