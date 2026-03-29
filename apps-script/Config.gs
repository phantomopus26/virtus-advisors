/**
 * ═══════════════════════════════════════════════════════════════
 *  CRE PULSE — CONFIGURATION
 *  All settings, RSS feeds, and constants in one place
 * ═══════════════════════════════════════════════════════════════
 */

const CONFIG = {
  
  // ── Delivery ──
  RECIPIENT_EMAIL: 'vamorosana@smu.edu',
  TIMEZONE: 'America/Chicago',
  
  // ── Claude API (optional — leave as-is to use RSS-only mode) ──
  CLAUDE_API_KEY: PropertiesService.getScriptProperties().getProperty('CLAUDE_API_KEY') || 'YOUR_API_KEY_HERE',
  
  // ── Archive ──
  ARCHIVE_FOLDER_NAME: 'CRE Pulse Archive',
  
  // ── Feed Settings ──
  LOOKBACK_DAYS: 4, // Sunday grabs Thurs-Sun, Wednesday grabs Sun-Wed
  
  // ── Branding ──
  BRAND: {
    navy: '#0C1829',
    gold: '#C4993C',
    lightBg: '#F8F6F1',
    cardBg: '#FFFFFF',
    textPrimary: '#1A1A2E',
    textSecondary: '#6B7280',
    borderLight: '#E5E2DA',
    gradientStart: '#0C1829',
    gradientEnd: '#1A2A4A',
    font: "'Georgia', 'Times New Roman', serif",
    fontSans: "'Helvetica Neue', Arial, sans-serif"
  },
  
  // ═══════════════════════════════════════════════════════════════
  //  RSS FEEDS — 36 sources across 3 tiers
  // ═══════════════════════════════════════════════════════════════
  
  RSS_FEEDS: [
    
    // ── TIER 1: National Financial Press ─────────────────────────
    {
      name: 'Wall Street Journal - Real Estate',
      url: 'https://news.google.com/rss/search?q=commercial+real+estate+site:wsj.com&hl=en-US&gl=US&ceid=US:en',
      category: 'national',
      geography: 'national'
    },
    {
      name: 'Bloomberg - Real Estate',
      url: 'https://news.google.com/rss/search?q=commercial+real+estate+site:bloomberg.com&hl=en-US&gl=US&ceid=US:en',
      category: 'national',
      geography: 'national'
    },
    {
      name: 'Financial Times - Property',
      url: 'https://news.google.com/rss/search?q=commercial+real+estate+site:ft.com&hl=en-US&gl=US&ceid=US:en',
      category: 'national',
      geography: 'national'
    },
    {
      name: 'Forbes - Real Estate',
      url: 'https://www.forbes.com/real-estate/feed/',
      category: 'national',
      geography: 'national'
    },
    {
      name: 'Reuters - Real Estate',
      url: 'https://news.google.com/rss/search?q=commercial+real+estate+site:reuters.com&hl=en-US&gl=US&ceid=US:en',
      category: 'national',
      geography: 'national'
    },
    
    // ── TIER 2: CRE Trade Publications ──────────────────────────
    {
      name: 'GlobeSt',
      url: 'https://www.globest.com/feed/',
      category: 'cre-trade',
      geography: 'national'
    },
    {
      name: 'Commercial Observer',
      url: 'https://commercialobserver.com/feed/',
      category: 'cre-trade',
      geography: 'national'
    },
    {
      name: 'The Real Deal',
      url: 'https://therealdeal.com/feed/',
      category: 'cre-trade',
      geography: 'national'
    },
    {
      name: 'Bisnow - National',
      url: 'https://www.bisnow.com/feed',
      category: 'cre-trade',
      geography: 'national'
    },
    {
      name: 'CoStar News',
      url: 'https://news.google.com/rss/search?q=site:costar.com+commercial+real+estate&hl=en-US&gl=US&ceid=US:en',
      category: 'cre-trade',
      geography: 'national'
    },
    {
      name: 'Connect CRE',
      url: 'https://www.connectcre.com/feed/',
      category: 'cre-trade',
      geography: 'national'
    },
    {
      name: 'Multi-Housing News',
      url: 'https://www.multihousingnews.com/feed/',
      category: 'cre-trade',
      geography: 'national'
    },
    {
      name: 'National Real Estate Investor',
      url: 'https://www.nreionline.com/rss',
      category: 'cre-trade',
      geography: 'national'
    },
    {
      name: 'Commercial Property Executive',
      url: 'https://www.commercialsearch.com/news/feed/',
      category: 'cre-trade',
      geography: 'national'
    },
    {
      name: 'Mortgage Bankers Association',
      url: 'https://news.google.com/rss/search?q=site:mba.org+commercial+mortgage&hl=en-US&gl=US&ceid=US:en',
      category: 'cre-trade',
      geography: 'national'
    },
    
    // ── TIER 2B: Sector-Specific ────────────────────────────────
    {
      name: 'Industrial CRE News',
      url: 'https://news.google.com/rss/search?q=industrial+warehouse+logistics+real+estate&hl=en-US&gl=US&ceid=US:en',
      category: 'cre-trade',
      geography: 'national'
    },
    {
      name: 'Office Market News',
      url: 'https://news.google.com/rss/search?q=office+market+lease+vacancy+real+estate&hl=en-US&gl=US&ceid=US:en',
      category: 'cre-trade',
      geography: 'national'
    },
    {
      name: 'Multifamily Market News',
      url: 'https://news.google.com/rss/search?q=multifamily+apartment+rent+growth+real+estate&hl=en-US&gl=US&ceid=US:en',
      category: 'cre-trade',
      geography: 'national'
    },
    {
      name: 'CMBS & CRE Debt News',
      url: 'https://news.google.com/rss/search?q=CMBS+commercial+mortgage+debt+real+estate&hl=en-US&gl=US&ceid=US:en',
      category: 'cre-trade',
      geography: 'national'
    },
    {
      name: 'Cap Rate & CRE Valuation',
      url: 'https://news.google.com/rss/search?q=cap+rate+commercial+real+estate+valuation&hl=en-US&gl=US&ceid=US:en',
      category: 'cre-trade',
      geography: 'national'
    },
    
    // ── TIER 3: Texas & DFW Local ───────────────────────────────
    {
      name: 'Dallas Business Journal',
      url: 'https://www.bizjournals.com/dallas/feed/headline/atom',
      category: 'local',
      geography: 'dfw'
    },
    {
      name: 'D Magazine - Commercial Real Estate',
      url: 'https://news.google.com/rss/search?q=site:dmagazine.com+commercial+real+estate+Dallas&hl=en-US&gl=US&ceid=US:en',
      category: 'local',
      geography: 'dfw'
    },
    {
      name: 'Bisnow - Dallas-Fort Worth',
      url: 'https://news.google.com/rss/search?q=site:bisnow.com+Dallas+Fort+Worth+real+estate&hl=en-US&gl=US&ceid=US:en',
      category: 'local',
      geography: 'dfw'
    },
    {
      name: 'DFW CRE Deals',
      url: 'https://news.google.com/rss/search?q=Dallas+Fort+Worth+commercial+real+estate+deal&hl=en-US&gl=US&ceid=US:en',
      category: 'local',
      geography: 'dfw'
    },
    {
      name: 'DFW Multifamily',
      url: 'https://news.google.com/rss/search?q=Dallas+apartment+multifamily+development&hl=en-US&gl=US&ceid=US:en',
      category: 'local',
      geography: 'dfw'
    },
    {
      name: 'DFW Office Market',
      url: 'https://news.google.com/rss/search?q=Dallas+office+market+lease+tenant&hl=en-US&gl=US&ceid=US:en',
      category: 'local',
      geography: 'dfw'
    },
    {
      name: 'DFW Industrial & Logistics',
      url: 'https://news.google.com/rss/search?q=Dallas+Fort+Worth+industrial+warehouse+logistics&hl=en-US&gl=US&ceid=US:en',
      category: 'local',
      geography: 'dfw'
    },
    {
      name: 'North Texas Development',
      url: 'https://news.google.com/rss/search?q=Frisco+Plano+McKinney+Allen+Prosper+development+commercial&hl=en-US&gl=US&ceid=US:en',
      category: 'local',
      geography: 'dfw'
    },
    {
      name: 'Houston CRE',
      url: 'https://news.google.com/rss/search?q=Houston+commercial+real+estate&hl=en-US&gl=US&ceid=US:en',
      category: 'local',
      geography: 'texas'
    },
    {
      name: 'Austin CRE',
      url: 'https://news.google.com/rss/search?q=Austin+commercial+real+estate&hl=en-US&gl=US&ceid=US:en',
      category: 'local',
      geography: 'texas'
    },
    {
      name: 'San Antonio CRE',
      url: 'https://news.google.com/rss/search?q=San+Antonio+commercial+real+estate&hl=en-US&gl=US&ceid=US:en',
      category: 'local',
      geography: 'texas'
    },
    {
      name: 'Texas CRE General',
      url: 'https://news.google.com/rss/search?q=Texas+commercial+real+estate+development&hl=en-US&gl=US&ceid=US:en',
      category: 'local',
      geography: 'texas'
    },
    
    // ── TIER 3B: Institutional & Research ───────────────────────
    {
      name: 'CBRE Research',
      url: 'https://news.google.com/rss/search?q=site:cbre.com+commercial+real+estate+report&hl=en-US&gl=US&ceid=US:en',
      category: 'research',
      geography: 'national'
    },
    {
      name: 'JLL Research',
      url: 'https://news.google.com/rss/search?q=site:jll.com+commercial+real+estate+market&hl=en-US&gl=US&ceid=US:en',
      category: 'research',
      geography: 'national'
    },
    {
      name: 'Cushman & Wakefield',
      url: 'https://news.google.com/rss/search?q=site:cushmanwakefield.com+commercial+real+estate&hl=en-US&gl=US&ceid=US:en',
      category: 'research',
      geography: 'national'
    },
    {
      name: 'Federal Reserve CRE',
      url: 'https://news.google.com/rss/search?q=Federal+Reserve+commercial+real+estate+lending&hl=en-US&gl=US&ceid=US:en',
      category: 'research',
      geography: 'national'
    }
  ]
};
