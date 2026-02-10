
import { TimeOfDay, Activity } from './types';

export const INITIAL_ROUTINE: Record<TimeOfDay, Activity[]> = {
  [TimeOfDay.MORNING]: [
    { id: 'm1', title: 'Morning Prayer', description: 'Starting the day with gratitude.', icon: '🙏', isDone: false },
    { id: 'm2', title: 'Brush Teeth', description: 'Sparkling white smile!', icon: '🪥', isDone: false },
    { id: 'm3', title: 'Get Dressed', description: 'Looking sharp for the day.', icon: '👕', isDone: false },
    { id: 'm4', title: 'Breakfast Time', description: 'Fueling up for adventures.', icon: '🥣', isDone: false },
    { id: 'm5', title: 'School / Learning', description: 'Gaining new superpowers!', icon: '📚', isDone: false },
  ],
  [TimeOfDay.AFTERNOON]: [
    { id: 'a1', title: 'Family Lunch', description: 'Eating healthy with family.', icon: '🥗', isDone: false },
    { id: 'a2', title: 'Quiet Time', description: 'A little rest for the brain.', icon: '💤', isDone: false },
    { id: 'a3', title: 'Homework', description: 'Practicing what we learned.', icon: '✏️', isDone: false },
    { id: 'a4', title: 'Playtime!', description: 'Running, jumping, and fun.', icon: '⚽', isDone: false },
    { id: 'a5', title: 'Snack Time', description: 'A tasty treat.', icon: '🍎', isDone: false },
  ],
  [TimeOfDay.EVENING]: [
    { id: 'e1', title: 'Family Dinner', description: 'Sharing stories from the day.', icon: '🍽️', isDone: false },
    { id: 'e2', title: 'Tidy Up Toys', description: 'Cleaning our play space.', icon: '🧸', isDone: false },
    { id: 'e3', title: 'Bath Time', description: 'Splish splash, getting clean!', icon: '🛁', isDone: false },
    { id: 'e4', title: 'Bedtime Story', description: 'Magical tales before sleep.', icon: '📖', isDone: false },
    { id: 'e5', title: 'Bedtime Prayer', description: 'Resting.', icon: '🌙', isDone: false },
  ]
};
