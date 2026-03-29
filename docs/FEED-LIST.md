# CRE Pulse — Feed List

Complete documentation of all 36 RSS sources powering the newsletter.

## Tier 1: National Financial Press (5 feeds)
| # | Source | Type | Geography |
|---|--------|------|-----------|
| 1 | Wall Street Journal - Real Estate | Direct RSS | National |
| 2 | Bloomberg - Real Estate | Google News proxy | National |
| 3 | Financial Times - Property | Google News proxy | National |
| 4 | Forbes - Real Estate | Direct RSS | National |
| 5 | Reuters - Real Estate | Google News proxy | National |

## Tier 2: CRE Trade Publications (10 feeds)
| # | Source | Type | Geography |
|---|--------|------|-----------|
| 6 | GlobeSt | Direct RSS | National |
| 7 | Commercial Observer | Direct RSS | National |
| 8 | The Real Deal | Direct RSS | National |
| 9 | Bisnow - National | Direct RSS | National |
| 10 | CoStar News | Google News proxy | National |
| 11 | Connect CRE | Direct RSS | National |
| 12 | Multi-Housing News | Direct RSS | National |
| 13 | National Real Estate Investor | Direct RSS | National |
| 14 | Commercial Property Executive | Direct RSS | National |
| 15 | Mortgage Bankers Association | Google News proxy | National |

## Tier 2B: Sector-Specific (5 feeds)
| # | Source | Query Focus | Geography |
|---|--------|-------------|-----------|
| 16 | Industrial CRE News | warehouse, logistics, distribution | National |
| 17 | Office Market News | office lease, vacancy | National |
| 18 | Multifamily Market News | apartment, rent growth | National |
| 19 | CMBS & CRE Debt News | CMBS, commercial mortgage | National |
| 20 | Cap Rate & Valuation | cap rate, valuation | National |

## Tier 3: Texas & DFW Local (12 feeds)
| # | Source | Type | Geography |
|---|--------|------|-----------|
| 21 | Dallas Business Journal | Direct Atom | DFW |
| 22 | D Magazine - CRE | Google News proxy | DFW |
| 23 | Bisnow - Dallas-Fort Worth | Google News proxy | DFW |
| 24 | DFW CRE Deals | Google News query | DFW |
| 25 | DFW Multifamily | Google News query | DFW |
| 26 | DFW Office Market | Google News query | DFW |
| 27 | DFW Industrial & Logistics | Google News query | DFW |
| 28 | North Texas Development | Google News query | DFW |
| 29 | Houston CRE | Google News query | Texas |
| 30 | Austin CRE | Google News query | Texas |
| 31 | San Antonio CRE | Google News query | Texas |
| 32 | Texas CRE General | Google News query | Texas |

## Tier 3B: Institutional & Research (4 feeds)
| # | Source | Type | Geography |
|---|--------|------|-----------|
| 33 | CBRE Research | Google News proxy | National |
| 34 | JLL Research | Google News proxy | National |
| 35 | Cushman & Wakefield | Google News proxy | National |
| 36 | Federal Reserve CRE | Google News query | National |

---

## Adding New Feeds

Add to the `CONFIG.RSS_FEEDS` array in `Config.gs`:

```javascript
{
  name: 'Your Source Name',
  url: 'https://example.com/rss-feed-url',
  category: 'cre-trade',   // national | cre-trade | local | research
  geography: 'national'     // national | texas | dfw
}
```

### Finding RSS feeds
- Check the source website for an RSS icon or `/feed/` URL
- If no direct RSS: use Google News proxy: `https://news.google.com/rss/search?q=YOUR+QUERY&hl=en-US&gl=US&ceid=US:en`
