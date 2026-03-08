import { FullAnalysis } from '@/types/jobAnalysis';

const HISTORY_KEY = 'job-decoder-history';
const MAX_HISTORY = 10;

export interface HistoryEntry {
  id: string;
  companyName: string;
  positionName: string;
  createdAt: string;
  analysis: FullAnalysis;
  resumeKeywords: string[];
}

export function getHistory(): HistoryEntry[] {
  try {
    const raw = localStorage.getItem(HISTORY_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveToHistory(analysis: FullAnalysis, resumeKeywords: string[]): void {
  const history = getHistory();
  const entry: HistoryEntry = {
    id: crypto.randomUUID(),
    companyName: analysis.jobPosting.companyName,
    positionName: analysis.jobPosting.positionName,
    createdAt: new Date().toISOString(),
    analysis,
    resumeKeywords,
  };
  const updated = [entry, ...history.filter(h => 
    !(h.companyName === entry.companyName && h.positionName === entry.positionName)
  )].slice(0, MAX_HISTORY);
  localStorage.setItem(HISTORY_KEY, JSON.stringify(updated));
}

export function removeFromHistory(id: string): void {
  const history = getHistory().filter(h => h.id !== id);
  localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
}
