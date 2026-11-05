import { Item, ItemMatch, MatchScoreReason } from '../types';

export function calculateMatchScore(item1: Item, item2: Item): { score: number; reasons: MatchScoreReason[] } {
  // If items are of the same type (both lost or both found), don't match them directly for returns
  // Unless specifically comparing catalog items
  const reasons: MatchScoreReason[] = [];
  let totalScore = 0;

  // 1. Category Factor (Max 35 points)
  const categoryMatched = item1.category.toLowerCase().trim() === item2.category.toLowerCase().trim();
  const categoryPoints = categoryMatched ? 35 : 0;
  totalScore += categoryPoints;
  reasons.push({
    factor: 'category',
    label: 'Category Match',
    points: categoryPoints,
    maxPoints: 35,
    matched: categoryMatched,
    explanation: categoryMatched
      ? `Both are categorized as "${item1.category}" (+35 pts)`
      : `Different categories (${item1.category} vs ${item2.category})`
  });

  // 2. Color Factor (Max 20 points)
  const color1 = item1.color.toLowerCase();
  const color2 = item2.color.toLowerCase();
  const exactColor = color1 === color2;
  const partialColor = !exactColor && (color1.includes(color2) || color2.includes(color1) || 
    (color1.includes('black') && color2.includes('dark')) ||
    (color1.includes('blue') && color2.includes('navy')) ||
    (color1.includes('gray') && color2.includes('silver')));
  
  const colorPoints = exactColor ? 20 : partialColor ? 12 : 0;
  totalScore += colorPoints;
  reasons.push({
    factor: 'color',
    label: 'Color Similarity',
    points: colorPoints,
    maxPoints: 20,
    matched: exactColor || partialColor,
    explanation: exactColor
      ? `Identical color match: "${item1.color}" (+20 pts)`
      : partialColor
      ? `Closely related color shades: "${item1.color}" & "${item2.color}" (+12 pts)`
      : `Colors differ ("${item1.color}" vs "${item2.color}")`
  });

  // 3. Location Factor (Max 20 points)
  const loc1 = item1.location.toLowerCase();
  const loc2 = item2.location.toLowerCase();
  const exactLoc = loc1 === loc2;
  const locPoints = exactLoc ? 20 : 0;
  totalScore += locPoints;
  reasons.push({
    factor: 'location',
    label: 'Campus Location',
    points: locPoints,
    maxPoints: 20,
    matched: exactLoc,
    explanation: exactLoc
      ? `Both reported at the same venue: "${item1.location}" (+20 pts)`
      : `Reported at different buildings (${item1.location} vs ${item2.location})`
  });

  // 4. Date Proximity Factor (Max 15 points)
  const d1 = new Date(item1.date).getTime();
  const d2 = new Date(item2.date).getTime();
  const diffDays = Math.abs(Math.round((d1 - d2) / (1000 * 60 * 60 * 24)));
  
  let datePoints = 0;
  let dateExplanation = '';
  if (diffDays === 0) {
    datePoints = 15;
    dateExplanation = 'Reported on the exact same date! (+15 pts)';
  } else if (diffDays <= 2) {
    datePoints = 12;
    dateExplanation = `Reported within ${diffDays} day(s) of each other (+12 pts)`;
  } else if (diffDays <= 5) {
    datePoints = 8;
    dateExplanation = `Reported within ${diffDays} days (+8 pts)`;
  } else if (diffDays <= 10) {
    datePoints = 4;
    dateExplanation = `Reported within ${diffDays} days (+4 pts)`;
  } else {
    dateExplanation = `Reported ${diffDays} days apart (0 pts)`;
  }
  totalScore += datePoints;
  reasons.push({
    factor: 'date',
    label: 'Date Proximity',
    points: datePoints,
    maxPoints: 15,
    matched: datePoints > 0,
    explanation: dateExplanation
  });

  // 5. Keyword Overlap (Max 10 points)
  const stopWords = new Set(['the', 'and', 'with', 'for', 'left', 'found', 'lost', 'near', 'from', 'this', 'that', 'case', 'room', 'area', 'floor']);
  const extractWords = (text: string) => 
    text.toLowerCase()
      .replace(/[^a-z0-9\s]/g, '')
      .split(/\s+/)
      .filter(w => w.length > 2 && !stopWords.has(w));

  const words1 = new Set([...extractWords(item1.title), ...extractWords(item1.description)]);
  const words2 = extractWords(item2.title).concat(extractWords(item2.description));
  const commonWords = Array.from(new Set(words2.filter(w => words1.has(w))));

  let keywordPoints = 0;
  if (commonWords.length >= 3) {
    keywordPoints = 10;
  } else if (commonWords.length === 2) {
    keywordPoints = 7;
  } else if (commonWords.length === 1) {
    keywordPoints = 4;
  }
  totalScore += keywordPoints;

  reasons.push({
    factor: 'keyword',
    label: 'Keyword Overlap',
    points: keywordPoints,
    maxPoints: 10,
    matched: keywordPoints > 0,
    explanation: commonWords.length > 0
      ? `Shared descriptive keywords: ${commonWords.slice(0, 3).map(w => `"${w}"`).join(', ')} (+${keywordPoints} pts)`
      : 'No distinctive shared keywords found'
  });

  return {
    score: Math.min(100, Math.max(0, totalScore)),
    reasons
  };
}

export function findMatchesForItem(targetItem: Item, allItems: Item[], minScore: number = 35): ItemMatch[] {
  const matches: ItemMatch[] = [];

  for (const item of allItems) {
    if (item.id === targetItem.id) continue;
    // Opposite types: match lost against found, found against lost
    if (item.type === targetItem.type) continue;
    if (item.status === 'returned' || item.status === 'archived') continue;

    const { score, reasons } = calculateMatchScore(targetItem, item);
    if (score >= minScore) {
      matches.push({
        item: targetItem,
        matchedWith: item,
        score,
        reasons
      });
    }
  }

  return matches.sort((a, b) => b.score - a.score);
}

export function getAllPotentialMatches(allItems: Item[], minScore: number = 40): { lostItem: Item; foundItem: Item; score: number; reasons: MatchScoreReason[] }[] {
  const results: { lostItem: Item; foundItem: Item; score: number; reasons: MatchScoreReason[] }[] = [];
  const lostItems = allItems.filter(i => i.type === 'lost' && i.status !== 'returned' && i.status !== 'archived');
  const foundItems = allItems.filter(i => i.type === 'found' && i.status !== 'returned' && i.status !== 'archived');

  for (const lost of lostItems) {
    for (const found of foundItems) {
      const { score, reasons } = calculateMatchScore(lost, found);
      if (score >= minScore) {
        results.push({
          lostItem: lost,
          foundItem: found,
          score,
          reasons
        });
      }
    }
  }

  return results.sort((a, b) => b.score - a.score);
}

