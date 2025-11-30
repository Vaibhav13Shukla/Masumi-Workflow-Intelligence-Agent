import { Pattern, AgentStatus } from './types';

export const MOCK_PATTERNS: Pattern[] = [
  {
    id: 'p1',
    name: 'Weekly Report Scraper',
    description: 'Login to Analytics Dashboard > Navigate to Reports > Set Date Range > Export CSV > Email to Team',
    frequency: 12,
    confidence: 0.96,
    timeSaved: 45,
    actions: Array(5).fill({ id: 'a1', type: 'click', target: 'button.export', timestamp: Date.now() }),
    status: AgentStatus.DETECTED
  },
  {
    id: 'p2',
    name: 'Competitor Price Monitor',
    description: 'Visit Competitor A > Scrape Product Price > Visit Competitor B > Scrape Price > Update Google Sheet',
    frequency: 28,
    confidence: 0.89,
    timeSaved: 120,
    actions: Array(8).fill({ id: 'a2', type: 'scrape', target: 'div.price', timestamp: Date.now() }),
    status: AgentStatus.DETECTED
  },
  {
    id: 'p3',
    name: 'Invoice Processor',
    description: 'Open Email Attachment > Extract PDF Data > Match PO Number > Upload to SAP > Archive Email',
    frequency: 45,
    confidence: 0.92,
    timeSaved: 180,
    actions: Array(6).fill({ id: 'a3', type: 'input', target: 'input.po-number', timestamp: Date.now() }),
    status: AgentStatus.DETECTED
  }
];

export const DEMO_WALLET_ADDRESS = "addr_test1qz2fxv2amyj58hcpq39r9...84t37";