import { CampusBuilding, Category, UserPersona } from '../types';

export const CATEGORIES: Category[] = [
  'Electronics & Gadgets',
  'Campus IDs & Cards',
  'Keys & Access Badges',
  'Backpacks & Bags',
  'Clothing & Outerwear',
  'Books & Notebooks',
  'Water Bottles & Tumblers',
  'Jewelry & Watches',
  'Sports & Gear',
  'Other Essentials'
];

export const CAMPUS_BUILDINGS: CampusBuilding[] = [
  'Central Campus Library',
  'Student Union & Plaza',
  'Engineering & Technology Center',
  'Science Complex (Lecture Halls 1-4)',
  'Recreation & Athletic Center',
  'Fine Arts & Music Hall',
  'Business School Building',
  'North Residential Quad',
  'Campus Dining Commons',
  'Transit Center & Main Bus Loop',
  'Other Campus Location'
];

export const SAFE_HANDOFF_SPOTS = [
  {
    id: 'library-desk',
    name: 'Central Library — Circulation & Service Desk (1st Floor)',
    hours: 'Mon–Sun: 8:00 AM – 11:00 PM',
    description: 'Staffed by campus librarians. Monitored security camera zone. Secure temporary storage locker available.',
    recommendedFor: 'Electronics, wallets, books, and valuables'
  },
  {
    id: 'student-union-desk',
    name: 'Student Union — Main Info & Welcome Desk (Lobby)',
    hours: 'Mon–Fri: 7:30 AM – 9:00 PM, Sat: 10:00 AM – 6:00 PM',
    description: 'High traffic central hub. Campus staff verify student IDs and oversee handoffs.',
    recommendedFor: 'Backpacks, jackets, hydroflasks, keys'
  },
  {
    id: 'campus-safety-hq',
    name: 'Campus Public Safety & Police HQ (Building 12)',
    hours: '24/7 Always Open',
    description: 'High security facility. Ideal for high-value tech, credit cards, legal documents, or after-hours exchanges.',
    recommendedFor: 'Laptops, jewelry, driver licenses, high-value tech'
  },
  {
    id: 'tech-hub-bar',
    name: 'Campus Tech Hub & IT Help Bar (Eng Hall Ground Floor)',
    hours: 'Mon–Fri: 8:30 AM – 6:00 PM',
    description: 'Equipped with device chargers and verification tools to verify serial numbers/ownership on tech items.',
    recommendedFor: 'MacBooks, iPads, phones, graphing calculators'
  }
];

export const COMMON_COLORS = [
  'Black',
  'Silver / Gray',
  'Space Gray',
  'Midnight Blue',
  'Navy Blue',
  'White',
  'Red / Crimson',
  'Forest Green',
  'Gold / Rose Gold',
  'Yellow / Mustard',
  'Purple / Lavender',
  'Brown / Tan',
  'Multicolor / Pattern'
];

export const PRESET_PHOTOS = [
  {
    label: 'AirPods Pro with White Case',
    category: 'Electronics & Gadgets',
    url: 'https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?auto=format&fit=crop&w=600&q=80'
  },
  {
    label: 'MacBook Air Space Gray',
    category: 'Electronics & Gadgets',
    url: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=600&q=80'
  },
  {
    label: 'Campus Lanyard & Dorm Keys',
    category: 'Keys & Access Badges',
    url: 'https://images.unsplash.com/photo-1582139329536-e7284fece509?auto=format&fit=crop&w=600&q=80'
  },
  {
    label: 'Blue Hydro Flask Water Bottle',
    category: 'Water Bottles & Tumblers',
    url: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&w=600&q=80'
  },
  {
    label: 'Black Fjallraven Kånken Backpack',
    category: 'Backpacks & Bags',
    url: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=600&q=80'
  },
  {
    label: 'TI-84 Plus CE Graphing Calculator',
    category: 'Electronics & Gadgets',
    url: 'https://images.unsplash.com/photo-1594980596870-8aa52a78d8cd?auto=format&fit=crop&w=600&q=80'
  },
  {
    label: 'Denim / North Face Winter Jacket',
    category: 'Clothing & Outerwear',
    url: 'https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=600&q=80'
  },
  {
    label: 'Student ID & Transit Card Holder',
    category: 'Campus IDs & Cards',
    url: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?auto=format&fit=crop&w=600&q=80'
  },
  {
    label: 'Tortoise Shell Prescription Glasses',
    category: 'Clothing & Outerwear',
    url: 'https://images.unsplash.com/photo-1574258495973-f010dfbb5371?auto=format&fit=crop&w=600&q=80'
  }
];

export const DEMO_PERSONAS: UserPersona[] = [
  {
    id: 'user_alex',
    name: 'Alex Rivera',
    email: 'alex.rivera@campus.edu',
    role: 'Student',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
    badge: 'Undergrad (CS)'
  },
  {
    id: 'user_jordan',
    name: 'Jordan Lee',
    email: 'j.lee@campus.edu',
    role: 'Student',
    avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=150&q=80',
    badge: 'Student Assistant'
  },
  {
    id: 'user_marcus',
    name: 'Prof. Marcus Vance',
    email: 'm.vance@campus.edu',
    role: 'Faculty',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
    badge: 'Faculty (Biology)'
  },
  {
    id: 'user_admin',
    name: 'Officer Davis',
    email: 'safety-admin@campus.edu',
    role: 'Admin',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&q=80',
    badge: 'Campus Safety Officer'
  }
];

