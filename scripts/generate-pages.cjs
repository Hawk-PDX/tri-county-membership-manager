#!/usr/bin/env node

/**
 * Script to generate all stub pages for the Tri-County Gun Club website
 * Run with: node scripts/generate-pages.js
 */

const fs = require('fs');
const path = require('path');

const baseDir = path.join(__dirname, '..', 'src', 'app');

// Page template generator
const generatePageContent = (title, subtitle) => `import DynamicPage from '@/components/DynamicPage';

export default function ${title.replace(/[^a-zA-Z0-9]/g, '')}Page() {
  return (
    <DynamicPage
      title="${title}"
      subtitle="${subtitle || ''}"
    />
  );
}
`;

// Page definitions
const pages = {
  // Activities pages
  'activities/2-gun-defense': { title: '2 Gun Defense', subtitle: 'Dynamic defensive shooting discipline' },
  'activities/22-rimfire-benchrest': { title: '22 Rimfire Benchrest 100-200 yard', subtitle: 'Precision rimfire competition' },
  'activities/600-yard-prone-bench': { title: '600-Yard Prone/Bench', subtitle: 'Long-range precision shooting' },
  'activities/black-powder-cartridge': { title: 'Black Powder Cartridge', subtitle: 'Traditional shooting sports' },
  'activities/cowboy-action-shooting': { title: 'Cowboy Action Shooting', subtitle: 'Old West style competition' },
  'activities/everyday-carry': { title: 'Everyday Carry (EDC)', subtitle: 'Practical defensive skills' },
  'activities/idpa': { title: 'IDPA', subtitle: 'International Defensive Pistol Association' },
  'activities/junior-air-pistol-rifle': { title: 'Junior Air Pistol/Air Rifle', subtitle: 'Youth shooting programs' },
  'activities/junior-smallbore': { title: 'Junior Smallbore', subtitle: 'Youth rifle competition' },
  'activities/multi-gun': { title: 'Multi-Gun', subtitle: 'Combined rifle, pistol, and shotgun competition' },
  'activities/muzzle-loader': { title: 'Muzzle Loader', subtitle: 'Traditional black powder shooting' },
  'activities/police-pistol-combat': { title: 'Police Pistol Combat', subtitle: 'Law enforcement style competition' },
  'activities/practical-rifle': { title: 'Practical Rifle', subtitle: 'Tactical rifle competition' },
  'activities/precision-pistol': { title: 'Precision Pistol', subtitle: 'Formerly Conventional Pistol' },
  'activities/rimfire-sporter': { title: 'Rimfire Sporter', subtitle: 'Casual rimfire competition' },
  'activities/senior-smallbore': { title: 'Senior Smallbore', subtitle: 'Senior rifle competition' },
  'activities/skeet': { title: 'Skeet', subtitle: 'Shotgun clay target sport' },
  'activities/speed-steel': { title: 'Speed Steel', subtitle: 'Fast-paced steel target shooting' },
  'activities/sporter-highpower': { title: 'Sporter Highpower', subtitle: 'Service rifle competition' },
  'activities/sporting-clays': { title: 'Sporting Clays', subtitle: 'Simulated field shooting' },
  'activities/sunday-clays': { title: 'Sunday Clays', subtitle: 'Casual Sunday shotgun shooting' },
  'activities/tactical': { title: 'Tactical', subtitle: 'Tactical shooting competition' },
  'activities/trap': { title: 'Trap', subtitle: 'Traditional shotgun sport' },
  'activities/uspsa': { title: 'USPSA', subtitle: 'United States Practical Shooting Association' },
  'activities/vintage-military': { title: 'Vintage Military Rifle/Pistol', subtitle: 'Historical firearms competition' },

  // Facilities pages
  'facilities/action-range': { title: 'Action Range', subtitle: 'Multi-bay dynamic shooting facility' },
  'facilities/archery-ranges': { title: 'Archery Ranges', subtitle: 'Indoor and outdoor archery facilities' },
  'facilities/black-powder-silhouette-rimfire': { title: 'Black Powder / Silhouette / Rimfire Range', subtitle: 'Traditional shooting ranges' },
  'facilities/conventional-pistol-range': { title: 'Conventional Pistol Range', subtitle: 'Standard pistol competition facility' },
  'facilities/general-purpose-range': { title: 'General Purpose Range', subtitle: 'Versatile multi-use range' },
  'facilities/indoor-range': { title: 'Indoor Range', subtitle: 'Climate-controlled shooting facility' },
  'facilities/shotgun-fields': { title: 'Shotgun Fields', subtitle: 'Trap, skeet, and sporting clays' },
  'facilities/short-distance-pistol-range': { title: 'Short Distance Pistol Range', subtitle: 'Tactical pistol training facility' },
  'facilities/200-300-yard-range': { title: '200 – 300 Yard Range', subtitle: 'Mid-range rifle facility' },
  'facilities/600-yard-range': { title: '600 Yard Range', subtitle: 'Long-range precision facility' },

  // Training pages
  'training/online-registration': { title: 'Online Course Registration', subtitle: 'Register for training courses' },
  'training/certification/action-range-process': { title: 'Action Range Certification Process', subtitle: 'Requirements and procedures' },
  'training/certification/action-range': { title: 'Action Range Certification', subtitle: 'Become certified for action range use' },
  'training/certification/practical-rifle-orientation': { title: 'Practical Rifle Orientation', subtitle: 'Introduction to practical rifle' },
  'training/pistol/action-shooting-fundamentals': { title: 'Action Shooting Fundamentals', subtitle: 'Basic action shooting skills' },
  'training/pistol/concealed-carry': { title: 'Concealed Carry - Multi-State', subtitle: 'Multi-state CCW certification' },
  'training/rifle': { title: 'Rifle Training', subtitle: 'Comprehensive rifle instruction' },
  'training/shotgun-fundamentals': { title: 'Shotgun Key & Fundamentals', subtitle: 'Basic shotgun skills' },
  'training/oregon-hunters-education': { title: 'Oregon Hunters Education', subtitle: 'State-approved hunter safety' },
  'training/youth-series-rifle': { title: 'Youth Series Training: Introduction to Rifle', subtitle: 'Youth rifle instruction' },

  // About pages
  'about/tour': { title: 'TCGC Tour', subtitle: 'Explore our facilities' },
  'about/join': { title: 'How to Join the Club', subtitle: 'Membership application process' },
  'about/hours-directions': { title: 'Hours and Directions', subtitle: 'Visit us' },
  'about/membership': { title: 'Membership', subtitle: 'Benefits and membership options' },
  'about/member-support': { title: 'Member Support', subtitle: 'Resources and assistance' },
  'about/safety-rules': { title: 'Safety and Range Rules', subtitle: 'Essential safety guidelines' },
  'about/proshop': { title: 'Proshop/FFL', subtitle: 'On-site pro shop and FFL services' },
  'about/contact': { title: 'Contact Us', subtitle: 'Get in touch' },

  // Members pages
  'members/portal': { title: 'Member Portal', subtitle: 'Access your member dashboard' },
  'members/meetings': { title: 'Meetings', subtitle: 'Club meeting information' },
  'members/newsletter': { title: 'Newsletter', subtitle: 'Member newsletters and updates' },
  'members/officials': { title: 'Officials', subtitle: 'Club leadership' },
  'members/documents': { title: 'Official Documents', subtitle: 'Club bylaws and documents' },
  'members/policies': { title: 'Policies and Procedures', subtitle: 'Club governance' },
  'members/guest-waiver': { title: 'Guest Waiver Release Form', subtitle: 'Download waiver form' },
  'members/ffl-transfer': { title: 'FFL Firearm Transfer Form', subtitle: 'Firearm transfer documentation' },
};

// Create pages
let created = 0;
let skipped = 0;

Object.entries(pages).forEach(([pagePath, { title, subtitle }]) => {
  const fullPath = path.join(baseDir, pagePath);
  const pageFile = path.join(fullPath, 'page.js');

  // Create directory if it doesn't exist
  if (!fs.existsSync(fullPath)) {
    fs.mkdirSync(fullPath, { recursive: true });
  }

  // Create page file if it doesn't exist
  if (!fs.existsSync(pageFile)) {
    fs.writeFileSync(pageFile, generatePageContent(title, subtitle));
    console.log(`✅ Created: ${pagePath}/page.js`);
    created++;
  } else {
    console.log(`⏭️  Skipped: ${pagePath}/page.js (already exists)`);
    skipped++;
  }
});

console.log(`\n✨ Done! Created ${created} pages, skipped ${skipped} existing pages.`);
