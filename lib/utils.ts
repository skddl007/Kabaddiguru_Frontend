import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Trims player name by removing team and season suffixes
 * Example: "Pawan Sherawat_RIN_TT17" -> "Pawan Sherawat"
 */
export function trimPlayerName(playerName: string): string {
  if (!playerName) return '';
  
  // Remove suffixes like _RIN_TT17, _TEAM_CODE, etc.
  // Look for underscore followed by uppercase letters and numbers
  const trimmedName = playerName.replace(/_[A-Z0-9_]+$/, '');
  
  return trimmedName.trim();
}
