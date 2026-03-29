# Virtus Advisors — CRE Pulse

**Automated Commercial Real Estate Newsletter Bot**

Zero-input CRE intelligence delivered to your inbox every **Sunday** (Week Ahead) and **Wednesday** (Mid-Week Pulse). Pulls from 36 institutional-grade sources, categorizes by asset class and geography, and delivers a branded HTML newsletter — all without lifting a finger.

---

## What It Does

| | Sunday — Week Ahead | Wednesday — Mid-Week Pulse |
|---|---|---|
| **Scope** | Full brief, 5 stories per sector | Quick pulse, 3 stories per sector |
| **Sections** | Multifamily · Office · Industrial · Capital Markets | Same, tighter |
| **Local** | DFW Spotlight (5 stories) + Texas | DFW Spotlight (3 stories) |
| **Extras** | Deal Tracker · Quick Hits · Editorial Take | Deal Tracker · Quick Hits |
| **Delivery** | 7:00 AM CT | 7:00 AM CT |

### Source Coverage (36 feeds)
- **Tier 1 — National Press**: WSJ, Bloomberg, Financial Times, Forbes, Reuters
- **Tier 2 — CRE Trade**: GlobeSt, Commercial Observer, The Real Deal, Bisnow, CoStar, Connect CRE, Multi-Housing News, NREI, CPE, MBA
- **Tier 2B — Sector-Specific**: Industrial, Office, Multifamily, CMBS/Debt, Cap Rates (via Google News)
- **Tier 3 — DFW/Texas Local**: Dallas Business Journal, D Magazine, Bisnow DFW, DFW deals/multifamily/office/industrial, North Texas development, Houston, Austin, San Antonio
- **Tier 3B — Research**: CBRE, JLL, Cushman & Wakefield, Federal Reserve CRE

### Smart Categorization
Every story gets scored on: asset class keywords, deal detection, DFW/Texas geography, source quality tier, and recency. DFW stories get a 20-point boost. The highest-scored story becomes the hero.

---

## Setup (One-Time — ~15 minutes)

### Step 1: Create the Apps Script project

1. Go to [script.google.com](https://script.google.com)
2. Click **"New project"**
3. Name it: `CRE Pulse Bot`

### Step 2: Add the code files

The project needs **3 files**. By default you'll see `Code.gs` already open.

**File 1 — Code.gs**
1. Delete any existing code in `Code.gs`
2. Open `apps-script/Code.gs` from this repo
3. Copy the entire contents and paste into the editor

**File 2 — Config.gs**
1. Click the **"+"** button next to "Files" in the left sidebar
2. Select **"Script"**
3. Name it: `Config` (it will become `Config.gs`)
4. Open `apps-script/Config.gs` from this repo
5. Copy and paste the entire contents

**File 3 — Template.gs**
1. Click **"+"** → **"Script"** again
2. Name it: `Template`
3. Open `apps-script/Template.gs` from this repo
4. Copy and paste the entire contents

### Step 3: Configure your settings

In `Config.gs`, verify these settings:

```javascript
RECIPIENT_EMAIL: 'vamorosana@smu.edu',    // your email
TIMEZONE: 'America/Chicago',               // CT
ARCHIVE_FOLDER_NAME: 'CRE Pulse Archive',  // Drive folder name
```

### Step 4: (Optional) Add Claude API key

If you have an Anthropic API key and want AI-generated editorial summaries:

1. In the Apps Script editor, click **⚙️ Project Settings** (gear icon, left sidebar)
2. Scroll to **Script Properties**
3. Click **"Add script property"**
4. Property: `CLAUDE_API_KEY` → Value: your API key
5. Click **Save**

**Without an API key, the bot works perfectly** — it uses RSS descriptions and rotating editorial takes instead of AI summaries.

### Step 5: Set up the triggers

1. In the editor, select the function dropdown at the top → choose `setupTriggers`
2. Click **▶️ Run**
3. Google will ask for permissions — click **"Review Permissions"**
4. Choose your Google account
5. Click **"Advanced"** → **"Go to CRE Pulse Bot (unsafe)"** → **"Allow"**

This creates two time-based triggers:
- **Sunday 7:00 AM CT** → `sendSundayEdition`
- **Wednesday 7:00 AM CT** → `sendWednesdayEdition`

### Step 6: Test it

1. Select `testSendPreview` from the function dropdown
2. Click **▶️ Run**
3. Check your inbox for the preview newsletter

---

## How It Works

```
┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│  Time Trigger │────▶│  Fetch 36    │────▶│  Categorize  │
│  Sun/Wed 7AM  │     │  RSS Feeds   │     │  & Score     │
└──────────────┘     └──────────────┘     └──────────────┘
                                                  │
                     ┌──────────────┐     ┌───────▼──────┐
                     │  Gmail Send  │◀────│  Build HTML   │
                     │  + Archive   │     │  Newsletter   │
                     └──────────────┘     └──────────────┘
```

1. **Fetch**: Hits all 36 RSS feeds, deduplicates by URL
2. **Score**: Tags each story with asset class, geography, deal flag, and relevance score
3. **Categorize**: Distributes into Multifamily, Office, Industrial, Capital Markets, DFW, Deals, Quick Hits
4. **Summarize**: (If API key present) Sends hero story + top stories to Claude for editorial summaries
5. **Assemble**: Builds branded HTML email with all sections
6. **Deliver**: Sends via Gmail to configured email
7. **Archive**: Saves HTML copy to Google Drive folder

---

## File Structure

```
virtus-advisors/
├── apps-script/
│   ├── Code.gs          # Main bot: fetch, categorize, send
│   ├── Config.gs         # Settings, RSS feeds, branding
│   └── Template.gs       # HTML email template builder
├── website/
│   ├── index.html        # Landing page (GitHub Pages)
│   └── heatmap.html      # DFW submarket heatmap
├── docs/
│   └── FEED-LIST.md      # Complete feed documentation
└── README.md
```

---

## Modifying the Feeds

All RSS feeds are in `Config.gs` under `CONFIG.RSS_FEEDS`. Each feed has:

```javascript
{
  name: 'Source Name',           // Display name in newsletter
  url: 'https://...',           // RSS/Atom feed URL
  category: 'cre-trade',        // national | cre-trade | local | research
  geography: 'dfw'              // national | texas | dfw
}
```

To add a new feed, just add a new object to the array. To remove one, delete it or comment it out.

---

## Troubleshooting

| Issue | Fix |
|---|---|
| No email received | Run `testSendPreview` manually and check the Execution Log (View → Executions) |
| "Authorization required" | Re-run `setupTriggers` and re-approve permissions |
| Feed errors in logs | Normal — some feeds may be temporarily down. The bot continues with available feeds |
| "Exceeded maximum execution time" | Reduce `LOOKBACK_DAYS` in Config.gs or remove slow feeds |
| Gmail sending limit | Google free accounts: 100 emails/day. Not an issue for 1 recipient |

---

## Roadmap

- [x] Automated RSS aggregation (36 feeds)
- [x] Smart categorization by asset class + geography
- [x] Branded HTML email template
- [x] Google Drive archiving
- [x] Claude API editorial summaries (optional)
- [ ] Beehiiv migration for subscriber management
- [ ] Branded PDF export per edition
- [ ] DFW submarket heatmap integration
- [ ] Interactive cap rate charts
- [ ] Custom domain (virtusadvisors.com)
- [ ] Personalized market alerts
- [ ] Weekly performance dashboard

---

## License

Proprietary — Virtus Advisors. All rights reserved.
