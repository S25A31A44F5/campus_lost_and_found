export type ItemType = 'lost' | 'found';

export type ItemStatus = 'open' | 'claim_pending' | 'approved' | 'declined' | 'returned' | 'archived';

export type Category = 
  | 'Electronics & Gadgets'
  | 'Campus IDs & Cards'
  | 'Keys & Access Badges'
  | 'Backpacks & Bags'
  | 'Clothing & Outerwear'
  | 'Books & Notebooks'
  | 'Water Bottles & Tumblers'
  | 'Jewelry & Watches'
  | 'Sports & Gear'
  | 'Other Essentials';

export type CampusBuilding = 
  | 'Central Campus Library'
  | 'Student Union & Plaza'
  | 'Engineering & Technology Center'
  | 'Science Complex (Lecture Halls 1-4)'
  | 'Recreation & Athletic Center'
  | 'Fine Arts & Music Hall'
  | 'Business School Building'
  | 'North Residential Quad'
  | 'Campus Dining Commons'
  | 'Transit Center & Main Bus Loop'
  | 'Other Campus Location';

export interface Claim {
  id: string;
  itemId: string;
  claimantName: string;
  claimantEmail: string;
  claimantRole: 'Student' | 'Staff' | 'Faculty' | 'Admin' | 'Visitor';
  secretProof: string; // The private identifying detail entered by claimant
  status: 'pending' | 'approved' | 'declined';
  handoffLocation: string;
  handoffTime?: string;
  handoffPin?: string; // 4-digit verification code
  posterResponseNote?: string;
  createdAt: string;
}

export interface Item {
  id: string;
  type: ItemType;
  title: string;
  category: Category;
  color: string;
  description: string;
  location: CampusBuilding;
  locationDetails?: string;
  date: string; // YYYY-MM-DD
  imageUrl: string;
  status: ItemStatus;
  reporterName: string;
  reporterEmail: string;
  reporterRole: 'Student' | 'Staff' | 'Faculty' | 'Admin' | 'Visitor';
  secretVerificationHint: string; // Shown to prompt claimants or kept for matching
  secretVerificationAnswer?: string; // For creator's reference or private note
  safeHandoffPreference: string;
  claims: Claim[];
  createdAt: string;
  isFlagged?: boolean;
  flagReason?: string;
  isArchived?: boolean;
}

export interface UserPersona {
  id: string;
  name: string;
  email: string;
  role: 'Student' | 'Staff' | 'Faculty' | 'Admin';
  avatar: string;
  badge?: string;
}

export interface NotificationItem {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'claim_received' | 'claim_approved' | 'claim_declined' | 'match_alert' | 'item_returned' | 'admin_alert';
  itemId?: string;
  read: boolean;
  createdAt: string;
}

export interface MatchScoreReason {
  factor: 'category' | 'color' | 'location' | 'date' | 'keyword';
  label: string;
  points: number;
  maxPoints: number;
  matched: boolean;
  explanation: string;
}

export interface ItemMatch {
  item: Item;
  matchedWith: Item;
  score: number;
  reasons: MatchScoreReason[];
}

export interface FilterState {
  searchQuery: string;
  type: 'all' | 'lost' | 'found';
  category: string;
  location: string;
  status: string;
  color: string;
  dateRange: 'all' | 'today' | '3days' | 'week' | 'month';
  sortBy: 'newest' | 'oldest' | 'title';
}

