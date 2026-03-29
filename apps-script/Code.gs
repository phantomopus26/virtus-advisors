/**
 * ═══════════════════════════════════════════════════════════════
 *  VIRTUS ADVISORS — CRE PULSE
 *  Automated Commercial Real Estate Newsletter Bot
 *  
 *  Runs: Sunday (Week Ahead) & Wednesday (Mid-Week Pulse)
 *  Delivery: Gmail → vamorosana@smu.edu
 *  Sources: 36 RSS feeds across CRE verticals
 *  AI: Claude API for editorial summaries (optional fallback)
 * ═══════════════════════════════════════════════════════════════
 */

// ── MAIN ENTRY POINTS ──────────────────────────────────────────

/**
 * Sunday edition: comprehensive week-ahead brief
 * Triggered by time-based trigger at 7:00 AM CT every Sunday
 */
function sendSundayEdition() {
  try {
    Logger.log('🟢 Starting Sunday Week Ahead edition...');
    const stories = fetchAllFeeds_();
    const categorized = categorizeStories_(stories);
    const edition = assembleSundayEdition_(categorized);
    sendNewsletter_(edition, 'sunday');
    archiveToDrive_(edition, 'sunday');
    Logger.log('✅ Sunday edition sent successfully.');
  } catch (e) {
    Logger.log('❌ Sunday edition failed: ' + e.message);
    sendErrorAlert_(e, 'Sunday');
  }
}

/**
 * Wednesday edition: mid-week pulse update
 * Triggered by time-based trigger at 7:00 AM CT every Wednesday
 */
function sendWednesdayEdition() {
  try {
    Logger.log('🟢 Starting Wednesday Mid-Week Pulse...');
    const stories = fetchAllFeeds_();
    const categorized = categorizeStories_(stories);
    const edition = assembleWednesdayEdition_(categorized);
    sendNewsletter_(edition, 'wednesday');
    archiveToDrive_(edition, 'wednesday');
    Logger.log('✅ Wednesday edition sent successfully.');
  } catch (e) {
    Logger.log('❌ Wednesday edition failed: ' + e.message);
    sendErrorAlert_(e, 'Wednesday');
  }
}

/**
 * Manual test: preview in your inbox without archiving
 */
function testSendPreview() {
  const stories = fetchAllFeeds_();
  const categorized = categorizeStories_(stories);
  const edition = assembleSundayEdition_(categorized);
  sendNewsletter_(edition, 'preview');
  Logger.log('📧 Preview sent to ' + CONFIG.RECIPIENT_EMAIL);
}


// ── RSS FEED ENGINE ─────────────────────────────────────────────

/**
 * Fetch and parse all configured RSS feeds
 * Returns flat array of story objects, deduped by URL
 */
function fetchAllFeeds_() {
  const allStories = [];
  const seenUrls = new Set();
  
  for (const feed of CONFIG.RSS_FEEDS) {
    try {
      const xml = UrlFetchApp.fetch(feed.url, {
        muteHttpExceptions: true,
        followRedirects: true,
        headers: { 'User-Agent': 'VirtusAdvisors-CREPulse/1.0' }
      });
      
      if (xml.getResponseCode() !== 200) {
        Logger.log('⚠️ Feed returned ' + xml.getResponseCode() + ': ' + feed.name);
        continue;
      }
      
      const doc = XmlService.parse(xml.getContentText());
      const root = doc.getRootElement();
      const stories = parseRssFeed_(root, feed);
      
      for (const story of stories) {
        if (!seenUrls.has(story.url)) {
          seenUrls.add(story.url);
          allStories.push(story);
        }
      }
      
      Logger.log('✓ ' + feed.name + ': ' + stories.length + ' stories');
      Utilities.sleep(300); // rate-limit courtesy
      
    } catch (e) {
      Logger.log('⚠️ Feed error [' + feed.name + ']: ' + e.message);
    }
  }
  
  Logger.log('📊 Total unique stories: ' + allStories.length);
  return allStories;
}

/**
 * Parse RSS/Atom XML into story objects
 */
function parseRssFeed_(root, feedConfig) {
  const stories = [];
  const ns = root.getNamespace();
  let items = [];
  
  // Handle RSS 2.0
  const channel = root.getChild('channel');
  if (channel) {
    items = channel.getChildren('item');
  }
  
  // Handle Atom
  if (items.length === 0) {
    const atomNs = XmlService.getNamespace('http://www.w3.org/2005/Atom');
    items = root.getChildren('entry', atomNs);
    if (items.length === 0) {
      items = root.getChildren('entry');
    }
  }
  
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - CONFIG.LOOKBACK_DAYS);
  
  for (const item of items) {
    try {
      const story = extractStoryData_(item, feedConfig, ns);
      if (story && story.date >= cutoffDate) {
        stories.push(story);
      }
    } catch (e) {
      // Skip malformed items silently
    }
  }
  
  return stories;
}

/**
 * Extract structured data from a single RSS item
 */
function extractStoryData_(item, feedConfig, ns) {
  const atomNs = XmlService.getNamespace('http://www.w3.org/2005/Atom');
  
  // Title
  let title = getChildText_(item, 'title', ns) || getChildText_(item, 'title', atomNs) || '';
  title = title.replace(/<[^>]*>/g, '').trim();
  if (!title) return null;
  
  // Link
  let url = getChildText_(item, 'link', ns) || '';
  if (!url) {
    const linkEl = item.getChild('link', atomNs) || item.getChild('link');
    if (linkEl) {
      url = linkEl.getAttribute('href') ? linkEl.getAttribute('href').getValue() : linkEl.getText();
    }
  }
  url = url.trim();
  
  // Description / snippet
  let description = getChildText_(item, 'description', ns) 
    || getChildText_(item, 'summary', atomNs) 
    || getChildText_(item, 'content', atomNs) 
    || '';
  description = description.replace(/<[^>]*>/g, '').trim();
  if (description.length > 280) {
    description = description.substring(0, 277) + '...';
  }
  
  // Date
  let dateStr = getChildText_(item, 'pubDate', ns) 
    || getChildText_(item, 'published', atomNs)
    || getChildText_(item, 'updated', atomNs)
    || '';
  let date;
  try {
    date = new Date(dateStr);
    if (isNaN(date.getTime())) date = new Date();
  } catch (e) {
    date = new Date();
  }
  
  return {
    title: title,
    url: url,
    description: description,
    date: date,
    source: feedConfig.name,
    sourceCategory: feedConfig.category,
    geography: feedConfig.geography || 'national',
    assetClass: null // assigned during categorization
  };
}

function getChildText_(element, childName, namespace) {
  let child;
  if (namespace) {
    child = element.getChild(childName, namespace);
  }
  if (!child) {
    child = element.getChild(childName);
  }
  return child ? child.getText() : '';
}


// ── STORY CATEGORIZATION ENGINE ─────────────────────────────────

/**
 * Categorize stories into asset classes and rank by relevance
 */
function categorizeStories_(stories) {
  const categorized = {
    hero: null,
    multifamily: [],
    office: [],
    industrial: [],
    capitalMarkets: [],
    deals: [],
    dfw: [],
    texas: [],
    quickHits: []
  };
  
  // Score and tag each story
  const scored = stories.map(story => {
    const tags = tagStory_(story);
    story.assetClass = tags.assetClass;
    story.relevanceScore = tags.score;
    story.isDeal = tags.isDeal;
    story.isDFW = tags.isDFW;
    story.isTexas = tags.isTexas;
    return story;
  });
  
  // Sort by relevance score descending
  scored.sort((a, b) => b.relevanceScore - a.relevanceScore);
  
  // Assign hero story (highest score)
  if (scored.length > 0) {
    categorized.hero = scored[0];
  }
  
  // Distribute into buckets
  for (let i = 1; i < scored.length; i++) {
    const s = scored[i];
    
    if (s.isDFW) categorized.dfw.push(s);
    else if (s.isTexas) categorized.texas.push(s);
    
    if (s.isDeal) {
      categorized.deals.push(s);
    } else if (s.assetClass === 'multifamily') {
      categorized.multifamily.push(s);
    } else if (s.assetClass === 'office') {
      categorized.office.push(s);
    } else if (s.assetClass === 'industrial') {
      categorized.industrial.push(s);
    } else if (s.assetClass === 'capitalMarkets') {
      categorized.capitalMarkets.push(s);
    } else {
      categorized.quickHits.push(s);
    }
  }
  
  // Cap each category
  const CAP = 5;
  categorized.multifamily = categorized.multifamily.slice(0, CAP);
  categorized.office = categorized.office.slice(0, CAP);
  categorized.industrial = categorized.industrial.slice(0, CAP);
  categorized.capitalMarkets = categorized.capitalMarkets.slice(0, CAP);
  categorized.deals = categorized.deals.slice(0, 6);
  categorized.dfw = categorized.dfw.slice(0, 5);
  categorized.texas = categorized.texas.slice(0, 4);
  categorized.quickHits = categorized.quickHits.slice(0, 6);
  
  return categorized;
}

/**
 * Tag a story with asset class, geography, and relevance score
 */
function tagStory_(story) {
  const text = (story.title + ' ' + story.description).toLowerCase();
  let score = 0;
  let assetClass = 'general';
  let isDeal = false;
  let isDFW = false;
  let isTexas = false;
  
  // ── Asset Class Detection ──
  const MF_KEYWORDS = ['multifamily', 'apartment', 'renter', 'rental', 'rent growth', 
    'lease-up', 'affordable housing', 'workforce housing', 'garden-style', 
    'mid-rise', 'high-rise residential', 'class a apartment', 'class b apartment',
    'occupancy rate', 'unit mix', 'concession'];
  const OF_KEYWORDS = ['office', 'coworking', 'co-working', 'sublease', 'trophy office',
    'class a office', 'return to office', 'remote work', 'hybrid work', 
    'office vacancy', 'office tenant', 'office lease', 'office tower',
    'headquarters', 'campus office'];
  const IND_KEYWORDS = ['industrial', 'warehouse', 'logistics', 'distribution', 
    'cold storage', 'last mile', 'last-mile', 'fulfillment', 'e-commerce',
    'manufacturing', 'flex space', 'industrial park', 'spec industrial',
    'big-box', 'shallow bay'];
  const CM_KEYWORDS = ['capital markets', 'cmbs', 'clo', 'debt fund', 'bridge loan',
    'interest rate', 'fed rate', 'treasury yield', 'cap rate', 'spread',
    'refinancing', 'loan maturity', 'debt maturity', 'credit facility',
    'agency lending', 'fannie mae', 'freddie mac', 'hud', 'life company',
    'mezzanine', 'preferred equity', 'rate cut', 'basis points',
    'yield curve', 'commercial mortgage'];
  
  const mfScore = countKeywordHits_(text, MF_KEYWORDS);
  const ofScore = countKeywordHits_(text, OF_KEYWORDS);
  const indScore = countKeywordHits_(text, IND_KEYWORDS);
  const cmScore = countKeywordHits_(text, CM_KEYWORDS);
  
  const maxScore = Math.max(mfScore, ofScore, indScore, cmScore);
  if (maxScore >= 1) {
    if (mfScore === maxScore) assetClass = 'multifamily';
    else if (ofScore === maxScore) assetClass = 'office';
    else if (indScore === maxScore) assetClass = 'industrial';
    else assetClass = 'capitalMarkets';
    score += maxScore * 10;
  }
  
  // ── Deal Detection ──
  const DEAL_KEYWORDS = ['acquisition', 'acquired', 'sold', 'sale', 'purchase',
    'joint venture', 'jv', 'recapitalization', 'disposition', 'portfolio sale',
    'closed on', 'million deal', 'billion deal', 'traded for', 'changed hands'];
  if (countKeywordHits_(text, DEAL_KEYWORDS) >= 1) {
    isDeal = true;
    score += 8;
  }
  
  // ── Geography Detection ──
  const DFW_KEYWORDS = ['dallas', 'fort worth', 'dfw', 'plano', 'frisco', 
    'arlington', 'irving', 'mckinney', 'allen', 'prosper', 'celina',
    'richardson', 'garland', 'mesquite', 'denton', 'lewisville',
    'carrollton', 'grapevine', 'southlake', 'uptown dallas', 'deep ellum',
    'las colinas', 'legacy west', 'cypress waters', 'alliance'];
  const TX_KEYWORDS = ['texas', 'houston', 'austin', 'san antonio', 
    'sun belt', 'sunbelt', 'lone star'];
  
  if (story.geography === 'dfw' || countKeywordHits_(text, DFW_KEYWORDS) >= 1) {
    isDFW = true;
    isTexas = true;
    score += 20; // DFW stories get heavy boost
  } else if (story.geography === 'texas' || countKeywordHits_(text, TX_KEYWORDS) >= 1) {
    isTexas = true;
    score += 12;
  }
  
  // ── Source Quality Bonus ──
  const TIER1 = ['wsj', 'wall street journal', 'financial times', 'bloomberg'];
  const TIER2 = ['costar', 'bisnow', 'the real deal', 'commercial observer', 'globest'];
  const LOCAL = ['dallas business journal', 'd magazine'];
  
  const srcLower = story.source.toLowerCase();
  if (TIER1.some(s => srcLower.includes(s))) score += 6;
  else if (TIER2.some(s => srcLower.includes(s))) score += 4;
  else if (LOCAL.some(s => srcLower.includes(s))) score += 8; // local gets premium
  
  // ── Recency Bonus ──
  const hoursOld = (Date.now() - story.date.getTime()) / (1000 * 60 * 60);
  if (hoursOld < 12) score += 10;
  else if (hoursOld < 24) score += 7;
  else if (hoursOld < 48) score += 4;
  
  return { assetClass, score, isDeal, isDFW, isTexas };
}

function countKeywordHits_(text, keywords) {
  let count = 0;
  for (const kw of keywords) {
    if (text.includes(kw)) count++;
  }
  return count;
}


// ── AI SUMMARY ENGINE (OPTIONAL) ────────────────────────────────

/**
 * Generate editorial summary via Claude API
 * Falls back to RSS description if API unavailable
 */
function generateAISummary_(story) {
  if (!CONFIG.CLAUDE_API_KEY || CONFIG.CLAUDE_API_KEY === 'YOUR_API_KEY_HERE') {
    return story.description; // graceful fallback
  }
  
  try {
    const payload = {
      model: 'claude-sonnet-4-20250514',
      max_tokens: 200,
      system: `You are a senior CRE analyst at Virtus Advisors writing a newsletter brief. 
Write a 2-sentence summary: first sentence captures the key fact, second sentence gives the "so what" for CRE professionals. 
Tone: authoritative, data-driven, institutional. No fluff.`,
      messages: [{
        role: 'user',
        content: `Summarize this CRE story for our newsletter:\n\nTitle: ${story.title}\nSource: ${story.source}\nExcerpt: ${story.description}`
      }]
    };
    
    const response = UrlFetchApp.fetch('https://api.anthropic.com/v1/messages', {
      method: 'post',
      contentType: 'application/json',
      headers: {
        'x-api-key': CONFIG.CLAUDE_API_KEY,
        'anthropic-version': '2023-06-01'
      },
      payload: JSON.stringify(payload),
      muteHttpExceptions: true
    });
    
    if (response.getResponseCode() === 200) {
      const data = JSON.parse(response.getContentText());
      return data.content[0].text;
    }
  } catch (e) {
    Logger.log('AI summary fallback for: ' + story.title);
  }
  
  return story.description;
}

/**
 * Generate the editorial "Our Read" take via Claude
 * Falls back to a generic market observation
 */
function generateEditorialTake_(categorized) {
  if (!CONFIG.CLAUDE_API_KEY || CONFIG.CLAUDE_API_KEY === 'YOUR_API_KEY_HERE') {
    return getDefaultEditorialTake_();
  }
  
  try {
    const topStories = [];
    if (categorized.hero) topStories.push(categorized.hero.title);
    categorized.multifamily.slice(0, 2).forEach(s => topStories.push(s.title));
    categorized.office.slice(0, 2).forEach(s => topStories.push(s.title));
    categorized.capitalMarkets.slice(0, 2).forEach(s => topStories.push(s.title));
    categorized.dfw.slice(0, 2).forEach(s => topStories.push(s.title));
    
    const payload = {
      model: 'claude-sonnet-4-20250514',
      max_tokens: 250,
      system: `You are the editorial voice of Virtus Advisors, a DFW-focused CRE intelligence firm.
Write a 3-sentence "Our Read" editorial take synthesizing the week's top themes.
Tone: opinionated, data-aware, institutional. Use phrases like "Our read:" or "The signal:".
Focus on what matters for DFW CRE professionals and capital allocators.`,
      messages: [{
        role: 'user',
        content: `This week's top CRE headlines:\n\n${topStories.map((t, i) => (i + 1) + '. ' + t).join('\n')}\n\nWrite the editorial take.`
      }]
    };
    
    const response = UrlFetchApp.fetch('https://api.anthropic.com/v1/messages', {
      method: 'post',
      contentType: 'application/json',
      headers: {
        'x-api-key': CONFIG.CLAUDE_API_KEY,
        'anthropic-version': '2023-06-01'
      },
      payload: JSON.stringify(payload),
      muteHttpExceptions: true
    });
    
    if (response.getResponseCode() === 200) {
      const data = JSON.parse(response.getContentText());
      return data.content[0].text;
    }
  } catch (e) {
    Logger.log('Editorial take fallback: ' + e.message);
  }
  
  return getDefaultEditorialTake_();
}

function getDefaultEditorialTake_() {
  const takes = [
    "Our read: Capital is rotating, not retreating. Watch where the smart money repositions this quarter — DFW remains a magnet for institutional allocation despite national headwinds.",
    "The signal: Debt markets are thawing, but selectively. Sponsors with strong DFW basis and clean cap stacks are getting term sheets while others wait. Execution speed matters.",
    "Our read: The bid-ask spread is narrowing in Sun Belt markets. DFW deal velocity should accelerate into the back half — the question is which asset class leads the recovery.",
    "The signal: Multifamily fundamentals are stabilizing faster than the headlines suggest. DFW absorption numbers tell a different story than national vacancy data — follow the local signal.",
    "Our read: Industrial demand remains structurally supported, but the era of spec-and-pray is over. Tenant-driven deals in DFW's Alliance and South Dallas corridors are the new playbook."
  ];
  const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0)) / (1000 * 60 * 60 * 24));
  return takes[dayOfYear % takes.length];
}


// ── EDITION ASSEMBLY ────────────────────────────────────────────

/**
 * Assemble the full Sunday "Week Ahead" edition
 */
function assembleSundayEdition_(categorized) {
  const today = new Date();
  const dateStr = Utilities.formatDate(today, CONFIG.TIMEZONE, 'MMMM d, yyyy');
  const editorialTake = generateEditorialTake_(categorized);
  
  // Generate AI summaries for hero and top stories if available
  if (categorized.hero) {
    categorized.hero.aiSummary = generateAISummary_(categorized.hero);
  }
  
  return {
    type: 'sunday',
    subject: 'CRE Pulse — Week Ahead | ' + dateStr,
    preheader: categorized.hero ? categorized.hero.title : 'Your weekly CRE intelligence brief',
    date: dateStr,
    editorialTake: editorialTake,
    hero: categorized.hero,
    sections: [
      { title: 'MULTIFAMILY', icon: '🏢', color: '#4A90D9', stories: categorized.multifamily },
      { title: 'OFFICE', icon: '🏛️', color: '#7B68EE', stories: categorized.office },
      { title: 'INDUSTRIAL & LOGISTICS', icon: '🏭', color: '#E67E22', stories: categorized.industrial },
      { title: 'CAPITAL MARKETS & DEBT', icon: '💰', color: '#27AE60', stories: categorized.capitalMarkets }
    ],
    deals: categorized.deals,
    dfw: categorized.dfw,
    texas: categorized.texas,
    quickHits: categorized.quickHits,
    html: null // populated by template
  };
}

/**
 * Assemble the shorter Wednesday "Mid-Week Pulse" edition
 */
function assembleWednesdayEdition_(categorized) {
  const today = new Date();
  const dateStr = Utilities.formatDate(today, CONFIG.TIMEZONE, 'MMMM d, yyyy');
  
  // Wednesday is tighter — fewer stories per section
  categorized.multifamily = categorized.multifamily.slice(0, 3);
  categorized.office = categorized.office.slice(0, 3);
  categorized.industrial = categorized.industrial.slice(0, 3);
  categorized.capitalMarkets = categorized.capitalMarkets.slice(0, 3);
  categorized.deals = categorized.deals.slice(0, 4);
  categorized.dfw = categorized.dfw.slice(0, 3);
  
  return {
    type: 'wednesday',
    subject: 'CRE Pulse — Mid-Week Pulse | ' + dateStr,
    preheader: categorized.hero ? categorized.hero.title : 'Mid-week CRE market update',
    date: dateStr,
    editorialTake: generateEditorialTake_(categorized),
    hero: categorized.hero,
    sections: [
      { title: 'MULTIFAMILY', icon: '🏢', color: '#4A90D9', stories: categorized.multifamily },
      { title: 'OFFICE', icon: '🏛️', color: '#7B68EE', stories: categorized.office },
      { title: 'INDUSTRIAL & LOGISTICS', icon: '🏭', color: '#E67E22', stories: categorized.industrial },
      { title: 'CAPITAL MARKETS & DEBT', icon: '💰', color: '#27AE60', stories: categorized.capitalMarkets }
    ],
    deals: categorized.deals,
    dfw: categorized.dfw,
    texas: categorized.texas || [],
    quickHits: categorized.quickHits.slice(0, 4),
    html: null
  };
}


// ── EMAIL DELIVERY ──────────────────────────────────────────────

/**
 * Send the assembled newsletter via Gmail
 */
function sendNewsletter_(edition, mode) {
  const html = buildEmailHTML_(edition);
  edition.html = html;
  
  const options = {
    htmlBody: html,
    name: 'Virtus Advisors | CRE Pulse',
    noReply: false
  };
  
  GmailApp.sendEmail(
    CONFIG.RECIPIENT_EMAIL,
    edition.subject,
    'View this email in an HTML-capable client.', // plaintext fallback
    options
  );
  
  Logger.log('📧 Newsletter sent: ' + edition.subject);
}


// ── GOOGLE DRIVE ARCHIVE ────────────────────────────────────────

/**
 * Save a branded PDF copy of each edition to Drive
 */
function archiveToDrive_(edition, type) {
  try {
    const folder = getOrCreateFolder_(CONFIG.ARCHIVE_FOLDER_NAME);
    const today = new Date();
    const dateSlug = Utilities.formatDate(today, CONFIG.TIMEZONE, 'yyyy-MM-dd');
    const fileName = 'CRE-Pulse_' + type + '_' + dateSlug + '.html';
    
    const file = folder.createFile(fileName, edition.html, 'text/html');
    Logger.log('📁 Archived to Drive: ' + fileName);
  } catch (e) {
    Logger.log('⚠️ Archive failed: ' + e.message);
  }
}

function getOrCreateFolder_(folderName) {
  const folders = DriveApp.getFoldersByName(folderName);
  if (folders.hasNext()) {
    return folders.next();
  }
  return DriveApp.createFolder(folderName);
}


// ── ERROR HANDLING ──────────────────────────────────────────────

function sendErrorAlert_(error, editionType) {
  try {
    GmailApp.sendEmail(
      CONFIG.RECIPIENT_EMAIL,
      '⚠️ CRE Pulse ' + editionType + ' Edition Failed',
      'The ' + editionType + ' edition failed to generate.\n\n' +
      'Error: ' + error.message + '\n' +
      'Stack: ' + error.stack + '\n\n' +
      'Check the Apps Script logs for details.'
    );
  } catch (e) {
    Logger.log('Could not send error alert: ' + e.message);
  }
}


// ── SETUP & TRIGGERS ────────────────────────────────────────────

/**
 * Run once to configure the automated triggers.
 * Sets: Sunday 7AM CT and Wednesday 7AM CT
 */
function setupTriggers() {
  // Clear existing triggers
  const existing = ScriptApp.getProjectTriggers();
  for (const trigger of existing) {
    ScriptApp.deleteTrigger(trigger);
  }
  
  // Sunday at 7 AM CT
  ScriptApp.newTrigger('sendSundayEdition')
    .timeBased()
    .onWeekDay(ScriptApp.WeekDay.SUNDAY)
    .atHour(7)
    .nearMinute(0)
    .inTimezone(CONFIG.TIMEZONE)
    .create();
  
  // Wednesday at 7 AM CT
  ScriptApp.newTrigger('sendWednesdayEdition')
    .timeBased()
    .onWeekDay(ScriptApp.WeekDay.WEDNESDAY)
    .atHour(7)
    .nearMinute(0)
    .inTimezone(CONFIG.TIMEZONE)
    .create();
  
  Logger.log('✅ Triggers configured: Sunday 7AM CT + Wednesday 7AM CT');
}

/**
 * View current triggers
 */
function listTriggers() {
  const triggers = ScriptApp.getProjectTriggers();
  if (triggers.length === 0) {
    Logger.log('No triggers configured. Run setupTriggers() first.');
    return;
  }
  for (const t of triggers) {
    Logger.log('Trigger: ' + t.getHandlerFunction() + ' | Type: ' + t.getEventType());
  }
}
