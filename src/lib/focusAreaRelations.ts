/**
 * Related focus areas mapping, display ordering, and grid positions.
 * Shared between the index page and individual focus area pages.
 */

export const relatedAreasMap: Record<string, string[]> = {
  'robot-learning-foundational-models': ['robot-perception', 'motion-planning-control', 'robotic-manipulation', 'safe-autonomy'],
  'robot-perception': ['robot-learning-foundational-models', 'autonomous-vehicles', 'robotic-manipulation', 'medical-robotics'],
  'human-robot-interaction': ['autonomous-vehicles', 'rehabilitation-wearables', 'multi-robot-swarms', 'medical-robotics', 'manufacturing-robotics'],
  'autonomous-vehicles': ['robot-perception', 'motion-planning-control', 'safe-autonomy', 'human-robot-interaction'],
  'robotic-manipulation': ['robot-learning-foundational-models', 'robot-perception', 'motion-planning-control', 'manufacturing-robotics', 'medical-robotics', 'design-soft-robotics'],
  'legged-robotics': ['motion-planning-control', 'rehabilitation-wearables', 'design-soft-robotics'],
  'rehabilitation-wearables': ['legged-robotics', 'human-robot-interaction', 'design-soft-robotics', 'medical-robotics', 'motion-planning-control'],
  'manufacturing-robotics': ['multi-robot-swarms', 'motion-planning-control', 'robotic-manipulation', 'human-robot-interaction', 'safe-autonomy'],
  'motion-planning-control': ['autonomous-vehicles', 'legged-robotics', 'robotic-manipulation', 'robot-learning-foundational-models', 'manufacturing-robotics', 'safe-autonomy', 'rehabilitation-wearables'],
  'multi-robot-swarms': ['manufacturing-robotics', 'safe-autonomy', 'human-robot-interaction'],
  'safe-autonomy': ['motion-planning-control', 'autonomous-vehicles', 'multi-robot-swarms', 'robot-learning-foundational-models', 'manufacturing-robotics'],
  'medical-robotics': ['robotic-manipulation', 'robot-perception', 'rehabilitation-wearables', 'human-robot-interaction'],
  'design-soft-robotics': ['rehabilitation-wearables', 'legged-robotics', 'robotic-manipulation'],
};

/**
 * Periodic-table grid positions (desktop, 4 columns).
 * Core areas form the upper-left block, application areas
 * fill in the lower-right with a staircase boundary.
 *
 *  ┌──────┬──────┬──────┬──────┐
 *  │ core │ core │ core │ core │  Row 1
 *  ├──────┼──────┼──────┼──────┤
 *  │ core │ core │ core │ APP  │  Row 2
 *  ├──────┼──────┼──────┼──────┤
 *  │      │ core │ APP  │ APP  │  Row 3
 *  ├──────┼──────┼──────┼──────┤
 *  │      │      │ APP  │ APP  │  Row 4
 *  └──────┴──────┴──────┴──────┘
 */
export const gridPositions: Record<string, { row: number; col: number }> = {
  // Row 1 — AI / perception / manipulation cluster (all core)
  'robot-learning-foundational-models': { row: 1, col: 1 },
  'robot-perception':                   { row: 1, col: 2 },
  'robotic-manipulation':               { row: 1, col: 3 },
  'motion-planning-control':            { row: 1, col: 4 },
  // Row 2 — systems + first application area
  'human-robot-interaction':            { row: 2, col: 1 },
  'multi-robot-swarms':                 { row: 2, col: 2 },
  'safe-autonomy':                      { row: 2, col: 3 },
  'autonomous-vehicles':                { row: 2, col: 4 },
  // Row 3 — 1 core + 2 application
  'design-soft-robotics':               { row: 3, col: 2 },
  'rehabilitation-wearables':           { row: 3, col: 3 },
  'legged-robotics':                    { row: 3, col: 4 },
  // Row 4 — 2 application
  'medical-robotics':                   { row: 4, col: 3 },
  'manufacturing-robotics':             { row: 4, col: 4 },
};

/**
 * Flat display order used for mobile (flows top-to-bottom, left-to-right
 * through the periodic table positions).
 */
export const focusAreaDisplayOrder = [
  // Row 1
  'robot-learning-foundational-models',
  'robot-perception',
  'robotic-manipulation',
  'motion-planning-control',
  // Row 2
  'human-robot-interaction',
  'multi-robot-swarms',
  'safe-autonomy',
  'autonomous-vehicles',
  // Row 3
  'design-soft-robotics',
  'rehabilitation-wearables',
  'legged-robotics',
  // Row 4
  'medical-robotics',
  'manufacturing-robotics',
];
