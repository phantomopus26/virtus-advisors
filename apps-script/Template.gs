/**
 * ═══════════════════════════════════════════════════════════════
 *  CRE PULSE — EMAIL TEMPLATE ENGINE
 *  Builds institutional-quality HTML email from edition data
 * ═══════════════════════════════════════════════════════════════
 */

function buildEmailHTML_(edition) {
  const B = CONFIG.BRAND;
  const isSunday = edition.type === 'sunday';
  const editionLabel = isSunday ? 'WEEK AHEAD' : 'MID-WEEK PULSE';
  
  let html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta name="color-scheme" content="light">
<title>${edition.subject}</title>
<!--[if mso]>
<style>table,td{font-family:Arial,sans-serif !important;}</style>
<![endif]-->
</head>
<body style="margin:0;padding:0;background-color:${B.lightBg};font-family:${B.fontSans};-webkit-text-size-adjust:100%;">

<!-- Preheader -->
<div style="display:none;max-height:0;overflow:hidden;font-size:1px;line-height:1px;color:${B.lightBg};">
  ${edition.preheader || ''}&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;
</div>

<!-- Outer Container -->
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:${B.lightBg};">
<tr><td align="center" style="padding:20px 10px;">

<!-- Inner Container 640px -->
<table role="presentation" width="640" cellpadding="0" cellspacing="0" style="max-width:640px;width:100%;">

<!-- ═══ HEADER ═══ -->
<tr><td style="background:linear-gradient(135deg, ${B.gradientStart}, ${B.gradientEnd});border-radius:12px 12px 0 0;padding:32px 40px 24px;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
  <tr>
    <td>
      <!-- Logo/Brand -->
      <div style="font-family:${B.font};font-size:13px;letter-spacing:4px;color:${B.gold};font-weight:700;margin-bottom:4px;">VIRTUS ADVISORS</div>
      <div style="font-family:${B.fontSans};font-size:28px;font-weight:800;color:#FFFFFF;letter-spacing:-0.5px;">CRE Pulse</div>
    </td>
    <td align="right" valign="top">
      <div style="font-family:${B.fontSans};font-size:11px;letter-spacing:2px;color:${B.gold};font-weight:600;background:rgba(196,153,60,0.15);padding:6px 14px;border-radius:4px;border:1px solid rgba(196,153,60,0.3);">${editionLabel}</div>
      <div style="font-family:${B.fontSans};font-size:12px;color:rgba(255,255,255,0.6);margin-top:8px;">${edition.date}</div>
    </td>
  </tr>
  </table>
  
  <!-- Nav Bar -->
  <table role="presentation" cellpadding="0" cellspacing="0" style="margin-top:20px;">
  <tr>
    <td style="font-family:${B.fontSans};font-size:10px;letter-spacing:1.5px;color:rgba(255,255,255,0.5);padding-right:20px;">MULTIFAMILY</td>
    <td style="font-family:${B.fontSans};font-size:10px;letter-spacing:1.5px;color:rgba(255,255,255,0.5);padding-right:20px;">OFFICE</td>
    <td style="font-family:${B.fontSans};font-size:10px;letter-spacing:1.5px;color:rgba(255,255,255,0.5);padding-right:20px;">INDUSTRIAL</td>
    <td style="font-family:${B.fontSans};font-size:10px;letter-spacing:1.5px;color:rgba(255,255,255,0.5);padding-right:20px;">CAPITAL MKTS</td>
    <td style="font-family:${B.fontSans};font-size:10px;letter-spacing:1.5px;color:${B.gold};">DFW</td>
  </tr>
  </table>
</td></tr>

<!-- ═══ EDITORIAL TAKE ═══ -->
<tr><td style="background:${B.cardBg};padding:28px 40px;border-bottom:1px solid ${B.borderLight};">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
  <tr>
    <td style="width:4px;background:${B.gold};border-radius:2px;" valign="top">&nbsp;</td>
    <td style="padding-left:16px;">
      <div style="font-family:${B.fontSans};font-size:10px;letter-spacing:2px;color:${B.gold};font-weight:700;margin-bottom:8px;">OUR READ</div>
      <div style="font-family:${B.font};font-size:15px;line-height:1.6;color:${B.textPrimary};font-style:italic;">${edition.editorialTake}</div>
    </td>
  </tr>
  </table>
</td></tr>`;

  // ═══ HERO STORY ═══
  if (edition.hero) {
    html += `
<tr><td style="background:${B.cardBg};padding:28px 40px;border-bottom:1px solid ${B.borderLight};">
  <div style="font-family:${B.fontSans};font-size:10px;letter-spacing:2px;color:${B.gold};font-weight:700;margin-bottom:12px;">TOP STORY</div>
  <a href="${edition.hero.url}" style="text-decoration:none;">
    <div style="font-family:${B.font};font-size:20px;font-weight:700;color:${B.textPrimary};line-height:1.35;margin-bottom:8px;">${edition.hero.title}</div>
  </a>
  <div style="font-family:${B.fontSans};font-size:13px;line-height:1.55;color:${B.textSecondary};margin-bottom:10px;">${edition.hero.aiSummary || edition.hero.description}</div>
  <div style="font-family:${B.fontSans};font-size:11px;color:rgba(107,114,128,0.7);">
    ${edition.hero.source}${edition.hero.isDFW ? ' &nbsp;·&nbsp; <span style="color:' + B.gold + ';font-weight:600;">DFW</span>' : ''}${edition.hero.isTexas && !edition.hero.isDFW ? ' &nbsp;·&nbsp; <span style="color:#E67E22;font-weight:600;">TEXAS</span>' : ''}
  </div>
</td></tr>`;
  }

  // ═══ ASSET CLASS SECTIONS ═══
  for (const section of edition.sections) {
    if (section.stories.length === 0) continue;
    
    html += `
<tr><td style="background:${B.cardBg};padding:24px 40px 8px;border-bottom:1px solid ${B.borderLight};">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
  <tr>
    <td style="width:3px;background:${section.color};border-radius:2px;" valign="top">&nbsp;</td>
    <td style="padding-left:14px;">
      <div style="font-family:${B.fontSans};font-size:11px;letter-spacing:2px;color:${section.color};font-weight:700;margin-bottom:16px;">${section.icon}&nbsp; ${section.title}</div>`;
    
    for (const story of section.stories) {
      const geoTag = story.isDFW 
        ? `<span style="font-size:9px;letter-spacing:1px;color:${B.gold};font-weight:700;background:rgba(196,153,60,0.1);padding:2px 6px;border-radius:3px;margin-left:8px;">DFW</span>`
        : story.isTexas
        ? `<span style="font-size:9px;letter-spacing:1px;color:#E67E22;font-weight:700;background:rgba(230,126,34,0.1);padding:2px 6px;border-radius:3px;margin-left:8px;">TX</span>`
        : '';
      
      html += `
      <div style="margin-bottom:16px;">
        <a href="${story.url}" style="text-decoration:none;">
          <div style="font-family:${B.fontSans};font-size:14px;font-weight:600;color:${B.textPrimary};line-height:1.4;margin-bottom:3px;">${story.title}${geoTag}</div>
        </a>
        <div style="font-family:${B.fontSans};font-size:12px;line-height:1.5;color:${B.textSecondary};margin-bottom:3px;">${story.description}</div>
        <div style="font-family:${B.fontSans};font-size:10px;color:rgba(107,114,128,0.6);">${story.source}</div>
      </div>`;
    }
    
    html += `
    </td>
  </tr>
  </table>
</td></tr>`;
  }

  // ═══ DFW SPOTLIGHT ═══
  if (edition.dfw && edition.dfw.length > 0) {
    html += `
<tr><td style="background:linear-gradient(135deg, ${B.gradientStart}, ${B.gradientEnd});padding:24px 40px;">
  <div style="font-family:${B.fontSans};font-size:11px;letter-spacing:2px;color:${B.gold};font-weight:700;margin-bottom:16px;">📍 DFW SPOTLIGHT</div>`;
    
    for (const story of edition.dfw) {
      html += `
  <div style="margin-bottom:14px;padding-bottom:14px;border-bottom:1px solid rgba(255,255,255,0.08);">
    <a href="${story.url}" style="text-decoration:none;">
      <div style="font-family:${B.fontSans};font-size:13px;font-weight:600;color:#FFFFFF;line-height:1.4;margin-bottom:3px;">${story.title}</div>
    </a>
    <div style="font-family:${B.fontSans};font-size:11px;color:rgba(255,255,255,0.5);">${story.source}</div>
  </div>`;
    }
    
    html += `</td></tr>`;
  }

  // ═══ DEAL TRACKER ═══
  if (edition.deals && edition.deals.length > 0) {
    html += `
<tr><td style="background:${B.cardBg};padding:24px 40px;border-bottom:1px solid ${B.borderLight};">
  <div style="font-family:${B.fontSans};font-size:11px;letter-spacing:2px;color:${B.gold};font-weight:700;margin-bottom:16px;">🤝 DEAL TRACKER</div>
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0">`;
    
    for (const deal of edition.deals) {
      const geoTag = deal.isDFW 
        ? `<span style="color:${B.gold};font-weight:600;"> · DFW</span>`
        : deal.isTexas 
        ? `<span style="color:#E67E22;font-weight:600;"> · TX</span>` 
        : '';
      
      html += `
  <tr>
    <td style="padding:8px 0;border-bottom:1px solid ${B.borderLight};vertical-align:top;">
      <a href="${deal.url}" style="text-decoration:none;">
        <div style="font-family:${B.fontSans};font-size:13px;font-weight:600;color:${B.textPrimary};line-height:1.35;">${deal.title}</div>
      </a>
      <div style="font-family:${B.fontSans};font-size:10px;color:${B.textSecondary};margin-top:2px;">${deal.source}${geoTag}</div>
    </td>
  </tr>`;
    }
    
    html += `
  </table>
</td></tr>`;
  }

  // ═══ QUICK HITS ═══
  if (edition.quickHits && edition.quickHits.length > 0) {
    html += `
<tr><td style="background:${B.cardBg};padding:24px 40px;border-bottom:1px solid ${B.borderLight};">
  <div style="font-family:${B.fontSans};font-size:11px;letter-spacing:2px;color:${B.gold};font-weight:700;margin-bottom:14px;">⚡ QUICK HITS</div>`;
    
    for (const story of edition.quickHits) {
      html += `
  <div style="margin-bottom:10px;padding-left:12px;border-left:2px solid ${B.borderLight};">
    <a href="${story.url}" style="text-decoration:none;font-family:${B.fontSans};font-size:12px;font-weight:600;color:${B.textPrimary};line-height:1.4;">${story.title}</a>
    <span style="font-family:${B.fontSans};font-size:10px;color:${B.textSecondary};"> — ${story.source}</span>
  </div>`;
    }
    
    html += `</td></tr>`;
  }

  // ═══ FOOTER ═══
  html += `
<tr><td style="background:${B.navy};border-radius:0 0 12px 12px;padding:32px 40px;text-align:center;">
  <div style="font-family:${B.font};font-size:12px;letter-spacing:3px;color:${B.gold};font-weight:700;margin-bottom:6px;">VIRTUS ADVISORS</div>
  <div style="font-family:${B.fontSans};font-size:10px;color:rgba(255,255,255,0.35);margin-bottom:16px;">Commercial Real Estate Intelligence · Dallas-Fort Worth</div>
  <div style="width:40px;height:1px;background:${B.gold};margin:0 auto 16px;opacity:0.4;"></div>
  <div style="font-family:${B.fontSans};font-size:10px;color:rgba(255,255,255,0.3);line-height:1.6;">
    CRE Pulse is published every Sunday and Wednesday.<br>
    Curated from ${CONFIG.RSS_FEEDS.length} institutional-grade sources.<br>
    &copy; ${new Date().getFullYear()} Virtus Advisors. All rights reserved.
  </div>
</td></tr>

</table>
</td></tr>
</table>

</body>
</html>`;

  return html;
}
