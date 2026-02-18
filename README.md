# CloudPeek 🌤️

> **AI-powered cloud identification app for kids!**  
> Point your phone at the sky → find out what cloud it is → collect them all!

![Next.js](https://img.shields.io/badge/Next.js-14-black?logo=next.js)
![Tailwind](https://img.shields.io/badge/Tailwind-3-38bdf8?logo=tailwindcss)
![OpenAI](https://img.shields.io/badge/OpenAI-gpt--4o--mini-412991?logo=openai)

---

## ✨ Features

### 🔍 Identify
- Take a photo or upload from gallery (works on mobile camera!)
- AI (gpt-4o-mini vision) identifies the cloud type
- Kid-friendly name, description, fun facts, mood, and rarity

### ☁️ Cloud Collection (Pokédex-style)
- 12 cloud types to discover: Cumulus, Cumulonimbus, Cirrus, and more
- Cards flip from dark silhouette → full colour on first discovery
- Progress bar: **"7/12 clouds found!"**
- All stored in `localStorage` — no login needed

### 🏅 Badges
| Badge | Requirement |
|-------|-------------|
| 🌟 First Cloud! | Spot your very first cloud |
| ⛈️ Storm Chaser | Find a Cumulonimbus |
| 🤩 Head in the Clouds | Discover 5 different types |
| 👑 Cloud Master | Collect all 12 types! |
| 💎 Rare Hunter | Find your first rare cloud |
| 🔥 Three-Day Spotter | 3-day streak |
| 🌈 Week of Clouds | 7-day streak |

### 🔥 Streak & Score
- Daily streak counter (days in a row you've spotted a cloud)
- Rarity points: Common = 1pt · Uncommon = 3pt · Rare = 5pt
- Running score shown on home screen

### 🎉 Celebrations
- **Confetti burst** on every new cloud type discovery
- Extra confetti for rare finds
- Score pop animation (+N pts ⭐)
- Badge unlock toast notifications

---

## 🎨 Design
- Sky blue gradient background (#87CEEB → #E0F0FF)
- Floating animated background clouds (CSS keyframes)
- Spinning sun in corner
- **Nunito** font — round and friendly
- Bouncy entrance animations on all result cards
- Fully mobile-first — designed for phones

---

## 🚀 Deploy to Vercel (for Chad)

### Step 1 — Import the repo
1. Go to [vercel.com/new](https://vercel.com/new)
2. Click **"Import Git Repository"**
3. Choose `Chiadigital-redirect/cloudpeek`
4. Framework preset will auto-detect as **Next.js** ✅

### Step 2 — Add Environment Variable
In the Vercel project settings → **Environment Variables**:

| Key | Value |
|-----|-------|
| `OPENAI_API_KEY` | `sk-proj-G8a7x8-p1WxAs...` *(your full key)* |

> ⚠️ The `.env.local` file is gitignored — you must add the key manually in Vercel.

### Step 3 — Deploy
Click **Deploy** — it'll be live in ~2 minutes! 🎉

### Optional extras
- **Custom domain**: Add in Vercel Project → Domains
- **Analytics**: Enable Vercel Analytics (free tier) for usage data
- **PWA**: Add a `public/manifest.json` to make it installable on phone home screens

---

## 🛠️ Local Development

```bash
git clone https://github.com/Chiadigital-redirect/cloudpeek
cd cloudpeek
npm install

# Create env file
echo "OPENAI_API_KEY=sk-proj-your-key-here" > .env.local

npm run dev
# → http://localhost:3000
```

---

## 📁 File Structure

```
app/
  page.tsx              Main page — 3-tab UI (Peek / Collection / Badges)
  layout.tsx            Root layout (Nunito font, viewport meta)
  globals.css           Tailwind + custom CSS animations
  api/
    identify/
      route.ts          POST /api/identify — OpenAI Vision API

components/
  CloudCamera.tsx       Camera / gallery / drag-drop upload
  CloudResult.tsx       AI result display + confetti trigger
  CloudCollection.tsx   Pokédex flip-card grid
  BadgesPanel.tsx       Badge showcase with lock/unlock state
  StatsBar.tsx          Score · X/12 clouds · day streak
  AnimatedClouds.tsx    Floating background clouds + sun
  LoadingCloud.tsx      Bobbing cloud loading animation
  useConfetti.ts        canvas-confetti hook

lib/
  gameState.ts          localStorage game state (score, badges, streak, collection)
```

---

## ☁️ Cloud Types Reference

| Type | Rarity | Points |
|------|--------|--------|
| Cumulus | Common | 1 |
| Stratus | Common | 1 |
| Stratocumulus | Common | 1 |
| Fog / Mist | Common | 1 |
| Contrails | Common | 1 |
| Altocumulus | Uncommon | 3 |
| Altostratus | Uncommon | 3 |
| Cirrus | Uncommon | 3 |
| Nimbostratus | Uncommon | 3 |
| Cumulonimbus | **Rare** | 5 |
| Cirrocumulus | **Rare** | 5 |
| Cirrostratus | **Rare** | 5 |

---

Built with ☁️ and ❤️ by CloudPeek
