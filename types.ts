
export enum TimeOfDay {
  MORNING = 'MORNING',
  AFTERNOON = 'AFTERNOON',
  EVENING = 'EVENING'
}

export interface Activity {
  id: string;
  title: string;
  description: string;
  icon: string;
  isDone: boolean;
}

export interface ChildRewards {
  boy: number;
  girl: number;
}

export interface RoutineSection {
  type: TimeOfDay;
  activities: Activity[];
  starsEarned: ChildRewards;
}

export const APPRECIATION_WORDS = [
  "You're a Rockstar! 🌟",
  "Super Helpful! 🦸‍♂️",
  "Amazing Effort! ✨",
  "Proud of You! ❤️",
  "Absolute Champion! 🏆"
];
