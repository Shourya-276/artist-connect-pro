import artist1 from '@/assets/artist1.jpg';
import artist2 from '@/assets/artist2.jpg';
import artist3 from '@/assets/artist3.jpg';
import artist4 from '@/assets/artist4.jpg';
import artist5 from '@/assets/artist5.jpg';
import artist6 from '@/assets/artist6.jpg';

export const categories = [
  { id: 'singer', name: 'Singers', icon: '🎤', count: 2400 },
  { id: 'dj', name: 'DJs', icon: '🎧', count: 1850 },
  { id: 'band', name: 'Bands', icon: '🎸', count: 980 },
  { id: 'dancer', name: 'Dancers', icon: '💃', count: 1600 },
  { id: 'comedian', name: 'Comedians', icon: '😂', count: 720 },
  { id: 'anchor', name: 'Anchors', icon: '🎙️', count: 540 },
  { id: 'instrumentalist', name: 'Instrumentalists', icon: '🎹', count: 890 },
  { id: 'others', name: 'Others', icon: '🎭', count: 1200 },
];

export const genres = [
  'Bollywood', 'EDM', 'HipHop', 'Punjabi', 'Rock', 'Indie', 'Classical', 'Sufi', 'Retro', 'Techno', 'Others'
];

export const eventTypes = [
  'Corporate', 'Wedding', 'Private Event', 'House Party', 'Cafe & Lounges',
  'Hotels & Villas', 'College Fest', 'Club Night', 'Virtual Event'
];

export const cities = [
  'Mumbai', 'Delhi', 'Bangalore', 'Hyderabad', 'Chennai', 'Kolkata', 'Pune', 'Jaipur', 'Goa', 'Chandigarh'
];

export const languages = [
  'Hindi', 'English', 'Punjabi', 'Tamil', 'Telugu', 'Bengali', 'Marathi', 'Gujarati', 'Kannada', 'Malayalam'
];

export interface Artist {
  id: string;
  name: string;
  category: string;
  genres: string[];
  city: string;
  image: string;
  rating: number;
  reviews: number;
  priceRange: string;
  events: number;
  verified: boolean;
  travelNationwide: boolean;
  bio: string;
  shortlists: number;
  enquiries: number;
  bookings: number;
  views: number;
}

export const mockArtists: Artist[] = [
  {
    id: '1', name: 'Arjun Kapoor', category: 'Singer', genres: ['Bollywood', 'Sufi', 'Indie'],
    city: 'Mumbai', image: artist1, rating: 4.8, reviews: 156, priceRange: '₹50,000 - ₹1,50,000',
    events: 320, verified: true, travelNationwide: true, bio: 'Award-winning Bollywood playback singer.',
    shortlists: 890, enquiries: 450, bookings: 210, views: 15600
  },
  {
    id: '2', name: 'DJ Priya', category: 'DJ', genres: ['EDM', 'Techno', 'HipHop'],
    city: 'Delhi', image: artist2, rating: 4.9, reviews: 203, priceRange: '₹40,000 - ₹1,20,000',
    events: 480, verified: true, travelNationwide: true, bio: 'India\'s top female DJ spinning at major festivals.',
    shortlists: 1200, enquiries: 680, bookings: 350, views: 22000
  },
  {
    id: '3', name: 'The Monsoon Band', category: 'Band', genres: ['Bollywood', 'Rock', 'Punjabi'],
    city: 'Jaipur', image: artist3, rating: 4.7, reviews: 89, priceRange: '₹80,000 - ₹2,50,000',
    events: 190, verified: true, travelNationwide: true, bio: 'High-energy wedding & corporate band.',
    shortlists: 560, enquiries: 290, bookings: 140, views: 9800
  },
  {
    id: '4', name: 'Rahul Deshmukh', category: 'Comedian', genres: ['Others'],
    city: 'Pune', image: artist4, rating: 4.6, reviews: 124, priceRange: '₹30,000 - ₹80,000',
    events: 250, verified: true, travelNationwide: false, bio: 'Stand-up comedian featured on major platforms.',
    shortlists: 780, enquiries: 410, bookings: 180, views: 12000
  },
  {
    id: '5', name: 'Meera Nair', category: 'Dancer', genres: ['Classical', 'Bollywood'],
    city: 'Chennai', image: artist5, rating: 4.9, reviews: 178, priceRange: '₹45,000 - ₹1,00,000',
    events: 290, verified: true, travelNationwide: true, bio: 'Classical & contemporary fusion dance performer.',
    shortlists: 920, enquiries: 520, bookings: 260, views: 18500
  },
  {
    id: '6', name: 'Vikram Singh', category: 'Anchor', genres: ['Others'],
    city: 'Bangalore', image: artist6, rating: 4.7, reviews: 95, priceRange: '₹25,000 - ₹70,000',
    events: 410, verified: true, travelNationwide: true, bio: 'Bilingual emcee for corporate and social events.',
    shortlists: 650, enquiries: 340, bookings: 190, views: 11000
  },
];

export const stats = [
  { label: 'Artists', value: '20,000+' },
  { label: 'Gigs Done', value: '20,000+' },
  { label: 'Cities', value: '50+' },
  { label: 'Happy Clients', value: '15,000+' },
];

export const testimonials = [
  { name: 'Anita Sharma', role: 'Event Manager, TCS', text: 'Found the perfect band for our annual event. Seamless experience!', rating: 5 },
  { name: 'Rohit Mehra', role: 'Wedding Planner', text: 'Best platform for finding quality artists. Highly recommended!', rating: 5 },
  { name: 'Sneha Patel', role: 'College Fest Coordinator', text: 'Booked 5 artists for our fest. Amazing variety and quality.', rating: 4 },
];

export const pricingPlans = [
  {
    name: 'Silver',
    price: '₹25,000',
    period: '/Quarterly',
    features: ['Unlimited Usage', 'Data updated Quarterly', 'Verified Artist', 'Dedicated Support'],
    recommended: false
  },
  {
    name: 'Gold',
    price: '₹50,000',
    period: '/6 Months',
    features: ['Unlimited Usage', 'Data updated Quarterly', 'Verified Artist', 'Priority Matching', 'Featured Profile'],
    recommended: true
  },
  {
    name: 'Platinum',
    price: '₹1,00,000',
    period: '/Yearly',
    features: ['Unlimited Usage', 'Data updated Quarterly', 'Verified Artist', 'Premium Account Manager', 'Custom Contracts', 'API Access'],
    recommended: false
  },
];

// Initialize localStorage with mock data if empty
export function initializeMockData() {
  if (!localStorage.getItem('artists')) {
    localStorage.setItem('artists', JSON.stringify(mockArtists));
  }
  if (!localStorage.getItem('users')) {
    localStorage.setItem('users', JSON.stringify([]));
  }
  if (!localStorage.getItem('clientProfiles')) {
    localStorage.setItem('clientProfiles', JSON.stringify([]));
  }
  if (!localStorage.getItem('subscriptions')) {
    localStorage.setItem('subscriptions', JSON.stringify([]));
  }
  if (!localStorage.getItem('activityLog')) {
    localStorage.setItem('activityLog', JSON.stringify([]));
  }
  if (!localStorage.getItem('weeklyLeaderboard')) {
    localStorage.setItem('weeklyLeaderboard', JSON.stringify(mockArtists.map(a => ({
      artistId: a.id,
      score: a.views * 1 + a.shortlists * 3 + a.enquiries * 5 + a.bookings * 10 + a.reviews * 2,
    })).sort((a, b) => b.score - a.score)));
  }
}
