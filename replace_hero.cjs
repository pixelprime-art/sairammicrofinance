const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src', 'pages', 'Home.tsx');
let content = fs.readFileSync(filePath, 'utf8');

const startMarker = "      {/* 2. HERO SECTION */}";
const endMarker = "      {/* BANKING SOLUTIONS SECTION */}";

const startIdx = content.indexOf(startMarker);
const endIdx = content.indexOf(endMarker);

if (startIdx !== -1 && endIdx !== -1) {
    const newHero = `      {/* 2. HERO SECTION */}
      <section className="w-full">
        <img src="/herobanner.png" alt="Hero Banner" className="w-full h-auto object-cover" fetchPriority="high" />
      </section>

`;
    const newContent = content.substring(0, startIdx) + newHero + content.substring(endIdx);
    fs.writeFileSync(filePath, newContent, 'utf8');
    console.log("Successfully replaced hero section");
} else {
    console.log("Could not find markers");
}
