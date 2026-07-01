import re

file_path = r'e:\sairammicrofinance\src\pages\Home.tsx'

with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

# Find the start of the hero section
start_marker = "      {/* 2. HERO SECTION */}"
end_marker = "      {/* BANKING SOLUTIONS SECTION */}"

start_idx = content.find(start_marker)
end_idx = content.find(end_marker)

if start_idx != -1 and end_idx != -1:
    new_hero = """      {/* 2. HERO SECTION */}
      <section className="w-full">
        <img src="/herobanner.png" alt="Hero Banner" className="w-full h-auto object-cover" fetchPriority="high" />
      </section>

"""
    new_content = content[:start_idx] + new_hero + content[end_idx:]
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(new_content)
    print("Successfully replaced hero section")
else:
    print("Could not find markers")
