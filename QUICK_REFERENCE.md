# 🕌 Surau Al-Ittihad Prayer Times - Quick Reference

## 🌐 Live Application
**https://waktusolatsurau.netlify.app**

---

## 📋 Quick Access

### Google Sheets for Images
**Sheet ID:** `1a-9za-kelQxd_Urm1nkPFVhBq5Tl3_GDBTWGBSSHDRI`

**How to Edit:**
1. Open Google Sheets with the Sheet ID above
2. Add image URLs in Column A (one per row)
3. First row is header (will be skipped)
4. Make sure sheet is set to "Anyone with the link can view"
5. Changes appear automatically within 60 seconds

**Example:**
```
| Image URL                                    |
|----------------------------------------------|
| https://example.com/image1.jpg               |
| https://example.com/image2.jpg               |
| https://example.com/image3.jpg               |
```

---

## ⏱️ Prayer Timeline

```
┌─────────────────────────────────────────────────────┐
│  1. Azan Alert (1 minute)                          │
│     └─ 5 beeps, prayer time announcement           │
│                                                     │
│  2. Iqamah Countdown (14 minutes)                  │
│     └─ Countdown timer displayed                   │
│                                                     │
│  3. "Lurus dan Rapatkan Saf" (1 minute)           │
│     └─ Emerald green screen, Malay only           │
│                                                     │
│  4. Blank Screen (9 minutes)                       │
│     └─ Clock only, left panel hidden               │
│                                                     │
│  5. Return to Normal                               │
│     └─ Slideshow resumes (10 seconds per slide)    │
└─────────────────────────────────────────────────────┘

Total: 25 minutes per prayer sequence
```

---

## 🎯 Key Settings

| Setting | Value |
|---------|-------|
| Slideshow Duration | 10 seconds per slide |
| Iqamah Countdown | 14 minutes |
| Straighten Rows Screen | 1 minute |
| Blank Screen | 9 minutes |
| Image Auto-refresh | Every 60 seconds |
| Google Sheet ID | 1a-9za-kelQxd_Urm1nkPFVhBq5Tl3_GDBTWGBSSHDRI |

---

## 🖥️ TV Display Setup

1. **Open URL:** https://waktusolatsurau.netlify.app
2. **Fullscreen:** Press F11
3. **Auto-run:** Set as browser homepage for auto-start
4. **Refresh:** Not needed - updates automatically

---

## 🔧 Troubleshooting

### Images not showing?
- Check if Google Sheet is publicly accessible
- Verify image URLs are valid and accessible
- Wait 60 seconds for auto-refresh

### Prayer times not updating?
- Check internet connection
- Verify waktusolat.app API is accessible
- Refresh the browser page

### Screen stuck on one phase?
- Refresh the browser (F5)
- Check browser console for errors
- Verify system time is correct

---

## 📱 Settings Access

Click ⚙️ button on display to:
- Change Google Sheet ID
- Toggle theme (dark/light)
- View current configuration

---

## 🔄 Update Process

**To deploy new changes:**
```bash
cd /home/user/project/frontend
npm run build
netlify deploy --prod --dir=dist
```

**To save to GitHub:**
```bash
git add .
git commit -m "Your message"
git push origin fresh-reef-69429
```

---

## 📞 Quick Links

- **Live Site:** https://waktusolatsurau.netlify.app
- **Netlify Dashboard:** https://app.netlify.com/projects/waktusolatsurau
- **Build Logs:** https://app.netlify.com/projects/waktusolatsurau/deploys
- **GitHub Branch:** fresh-reef-69429

---

## ✅ Features Checklist

- [x] Real-time prayer times
- [x] Automatic countdowns
- [x] Azan alerts (5 beeps)
- [x] Iqamah countdown (14 min)
- [x] "Lurus dan Rapatkan Saf" screen (1 min)
- [x] Blank screen (9 min)
- [x] Image slideshow (10 sec/slide)
- [x] Google Sheets integration
- [x] Auto-refresh (60 sec)
- [x] Dark theme for TV
- [x] Hijri date display
- [x] Settings dialog

---

**🎉 Everything is working and deployed!**
