import React, { createContext, useContext, useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Item, NotificationItem, UserPersona, Claim } from '../types';
import { INITIAL_ITEMS, INITIAL_NOTIFICATIONS } from '../data/sampleData';
import { DEMO_PERSONAS } from '../data/constants';
import { findMatchesForItem } from '../utils/matching';

interface Toast {
  id: string;
  type: 'success' | 'error' | 'info';
  message: string;
  duration?: number;
}

interface AppContextType {
  items: Item[];
  notifications: NotificationItem[];
  currentUser: UserPersona;
  toasts: Toast[];
  setCurrentUser: (user: UserPersona) => void;
  addItem: (itemData: Omit<Item, 'id' | 'createdAt' | 'claims' | 'status'>) => Item;
  updateItem: (id: string, updates: Partial<Item>) => void;
  submitClaim: (itemId: string, proof: string, preferredDesk: string) => Claim;
  approveClaim: (itemId: string, claimId: string, note?: string) => void;
  declineClaim: (itemId: string, claimId: string, note?: string) => void;
  markReturned: (itemId: string, verificationPin?: string) => void;
  deleteItem: (itemId: string) => void;
  archiveItem: (itemId: string) => void;
  flagItem: (itemId: string, reason: string) => void;
  unflagItem: (itemId: string) => void;
  markNotificationAsRead: (id: string) => void;
  markAllNotificationsAsRead: () => void;
  addToast: (message: string, type?: 'success' | 'error' | 'info') => void;
  removeToast: (id: string) => void;
  resetToSampleData: () => void;
}

const STORAGE_KEYS = {
  ITEMS: 'found_on_campus_items_v2',
  NOTIFICATIONS: 'found_on_campus_notifs_v2',
  CURRENT_USER_ID: 'found_on_campus_user_v2'
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<Item[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.ITEMS);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Failed to load items from storage:', e);
    }
    return INITIAL_ITEMS;
  });

  const [notifications, setNotifications] = useState<NotificationItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Failed to load notifications from storage:', e);
    }
    return INITIAL_NOTIFICATIONS;
  });

  const [currentUser, setCurrentUser] = useState<UserPersona>(() => {
    try {
      const savedId = localStorage.getItem(STORAGE_KEYS.CURRENT_USER_ID);
      const found = DEMO_PERSONAS.find((p: UserPersona) => p.id === savedId);
      if (found) return found;
    } catch (e) {
      console.error('Failed to load user:', e);
    }
    return DEMO_PERSONAS[0]; // Alex Rivera (Student)
  });

  const [toasts, setToasts] = useState<Toast[]>([]);

  // Persist items
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.ITEMS, JSON.stringify(items));
    } catch (e) {
      console.error('Failed to persist items:', e);
    }
  }, [items]);

  // Persist notifications
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(notifications));
    } catch (e) {
      console.error('Failed to persist notifications:', e);
    }
  }, [notifications]);

  // Persist current user
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER_ID, currentUser.id);
    } catch (e) {
      console.error('Failed to persist user:', e);
    }
  }, [currentUser]);

  const addToast = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      removeToast(id);
    }, 4500);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  const addItem = (itemData: Omit<Item, 'id' | 'createdAt' | 'claims' | 'status'>): Item => {
    const newItem: Item = {
      ...itemData,
      id: `item-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      status: 'open',
      claims: [],
      createdAt: new Date().toISOString()
    };

    const updatedItems = [newItem, ...items];
    setItems(updatedItems);
    addToast(
      `Your ${newItem.type === 'lost' ? 'Lost Item' : 'Found Item'} report was published!`,
      'success'
    );

    // Auto-check for matches
    const matches = findMatchesForItem(newItem, updatedItems, 50);
    if (matches.length > 0) {
      const topMatch = matches[0];
      const newNotif: NotificationItem = {
        id: `notif-${Date.now()}`,
        userId: currentUser.id,
        title: `Possible Match Found! (${topMatch.score}%) 🎯`,
        message: `Your report for "${newItem.title}" has a high matching score with "${topMatch.matchedWith.title}". Check your matches!`,
        type: 'match_alert',
        itemId: newItem.id,
        read: false,
        createdAt: new Date().toISOString()
      };
      setNotifications(prev => [newNotif, ...prev]);
      addToast(`We discovered a ${topMatch.score}% match for your item!`, 'info');
    }

    return newItem;
  };

  const updateItem = (id: string, updates: Partial<Item>) => {
    setItems(prev => prev.map(item => item.id === id ? { ...item, ...updates } : item));
    addToast('Item details updated', 'info');
  };

  const submitClaim = (itemId: string, proof: string, preferredDesk: string): Claim => {
    const randomPin = Math.floor(1000 + Math.random() * 9000).toString();
    const newClaim: Claim = {
      id: `claim-${Date.now()}`,
      itemId,
      claimantName: currentUser.name,
      claimantEmail: currentUser.email,
      claimantRole: currentUser.role,
      secretProof: proof,
      status: 'pending',
      handoffLocation: preferredDesk,
      handoffPin: randomPin,
      createdAt: new Date().toISOString()
    };

    setItems(prev => prev.map(item => {
      if (item.id === itemId) {
        return {
          ...item,
          status: 'claim_pending',
          claims: [...item.claims, newClaim]
        };
      }
      return item;
    }));

    // Notify the item poster
    const targetItem = items.find(i => i.id === itemId);
    if (targetItem) {
      const posterNotif: NotificationItem = {
        id: `notif-${Date.now()}`,
        userId: targetItem.reporterEmail, // match by email/id
        title: 'New Private Claim Received! 📬',
        message: `${currentUser.name} submitted a private claim for "${targetItem.title}". Review their proof detail in your dashboard.`,
        type: 'claim_received',
        itemId: targetItem.id,
        read: false,
        createdAt: new Date().toISOString()
      };
      setNotifications(prev => [posterNotif, ...prev]);
    }

    addToast('Private claim submitted! The poster has been notified to verify your proof.', 'success');
    return newClaim;
  };

  const approveClaim = (itemId: string, claimId: string, note?: string) => {
    let claimantEmail = '';
    let itemTitle = '';
    let handoffLoc = '';
    let pin = '';

    setItems(prev => prev.map(item => {
      if (item.id === itemId) {
        itemTitle = item.title;
        handoffLoc = item.safeHandoffPreference;
        const updatedClaims = item.claims.map(c => {
          if (c.id === claimId) {
            claimantEmail = c.claimantEmail;
            pin = c.handoffPin || '1234';
            return {
              ...c,
              status: 'approved' as const,
              posterResponseNote: note || 'Proof verified! Let’s meet at the designated campus desk.'
            };
          }
          // auto decline other pending claims once one is approved
          if (c.status === 'pending') {
            return { ...c, status: 'declined' as const, posterResponseNote: 'Another claimant was verified.' };
          }
          return c;
        });

        return {
          ...item,
          status: 'approved' as const,
          claims: updatedClaims
        };
      }
      return item;
    }));

    // Trigger celebration confetti
    try {
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.7 }
      });
    } catch {
      // ignore
    }

    // Send notification to claimant
    const approvedNotif: NotificationItem = {
      id: `notif-${Date.now()}`,
      userId: claimantEmail,
      title: 'Claim Approved! 🎉 Ready for Handoff',
      message: `Your claim for "${itemTitle}" was approved! Meet at ${handoffLoc}. Verification PIN: ${pin}`,
      type: 'claim_approved',
      itemId,
      read: false,
      createdAt: new Date().toISOString()
    };
    setNotifications(prev => [approvedNotif, ...prev]);

    addToast('Claim approved! Safe handoff instructions and verification PIN are active.', 'success');
  };

  const declineClaim = (itemId: string, claimId: string, note?: string) => {
    let claimantEmail = '';
    let itemTitle = '';

    setItems(prev => prev.map(item => {
      if (item.id === itemId) {
        itemTitle = item.title;
        const updatedClaims = item.claims.map(c => {
          if (c.id === claimId) {
            claimantEmail = c.claimantEmail;
            return {
              ...c,
              status: 'declined' as const,
              posterResponseNote: note || 'The identifying details provided did not match the item.'
            };
          }
          return c;
        });

        const hasPending = updatedClaims.some(c => c.status === 'pending' || c.status === 'approved');

        return {
          ...item,
          status: hasPending ? item.status : 'open',
          claims: updatedClaims
        };
      }
      return item;
    }));

    // Notify claimant
    const declineNotif: NotificationItem = {
      id: `notif-${Date.now()}`,
      userId: claimantEmail,
      title: 'Claim Not Verified',
      message: `The poster reviewed your claim for "${itemTitle}" and could not verify the details.`,
      type: 'claim_declined',
      itemId,
      read: false,
      createdAt: new Date().toISOString()
    };
    setNotifications(prev => [declineNotif, ...prev]);

    addToast('Claim declined. Item listing is reopened for others.', 'info');
  };

  const markReturned = (itemId: string) => {
    setItems(prev => prev.map(item => {
      if (item.id === itemId) {
        return {
          ...item,
          status: 'returned' as const
        };
      }
      return item;
    }));

    try {
      confetti({
        particleCount: 120,
        spread: 90,
        origin: { y: 0.6 }
      });
    } catch {
      // ignore
    }

    addToast('Success! Item marked as RETURNED to rightful owner. Another campus win! 🎉', 'success');
  };

  const deleteItem = (itemId: string) => {
    setItems(prev => prev.filter(item => item.id !== itemId));
    addToast('Item removed from campus board', 'info');
  };

  const archiveItem = (itemId: string) => {
    setItems(prev => prev.map(item => {
      if (item.id === itemId) {
        return {
          ...item,
          status: 'archived' as const,
          isArchived: true
        };
      }
      return item;
    }));
    addToast('Item has been archived', 'info');
  };

  const flagItem = (itemId: string, reason: string) => {
    setItems(prev => prev.map(item => {
      if (item.id === itemId) {
        return {
          ...item,
          isFlagged: true,
          flagReason: reason
        };
      }
      return item;
    }));
    addToast('Post flagged for admin moderation review', 'info');
  };

  const unflagItem = (itemId: string) => {
    setItems(prev => prev.map(item => {
      if (item.id === itemId) {
        return {
          ...item,
          isFlagged: false,
          flagReason: undefined
        };
      }
      return item;
    }));
    addToast('Post cleared by moderator', 'success');
  };

  const markNotificationAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const markAllNotificationsAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    addToast('All notifications marked as read', 'info');
  };

  const resetToSampleData = () => {
    localStorage.removeItem(STORAGE_KEYS.ITEMS);
    localStorage.removeItem(STORAGE_KEYS.NOTIFICATIONS);
    localStorage.removeItem(STORAGE_KEYS.CURRENT_USER_ID);
    setItems(INITIAL_ITEMS);
    setNotifications(INITIAL_NOTIFICATIONS);
    setCurrentUser(DEMO_PERSONAS[0]);
    addToast('Sample data reloaded! Ready for clean demo walkthrough.', 'success');
  };

  return (
    <AppContext.Provider
      value={{
        items,
        notifications,
        currentUser,
        toasts,
        setCurrentUser,
        addItem,
        updateItem,
        submitClaim,
        approveClaim,
        declineClaim,
        markReturned,
        deleteItem,
        archiveItem,
        flagItem,
        unflagItem,
        markNotificationAsRead,
        markAllNotificationsAsRead,
        addToast,
        removeToast,
        resetToSampleData
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

