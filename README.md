# 🕌 Surau Al-Ittihad Prayer Times Display

A modern, TV-optimized prayer times display system for Surau Al-Ittihad, Kampung Raja Besut, Terengganu.

## 🌟 Features

- ✅ **Real-time Prayer Times** - Automatic updates from waktusolat.app API
- ✅ **Hijri Date Display** - Shows Islamic calendar date
- ✅ **Countdown Timers** - Shows time until next prayer
- ✅ **Visual Alerts** - Highlights current and upcoming prayers
- ✅ **Iqamah Countdown** - Configurable iqamah times
- ✅ **Image Slideshow** - Customizable slideshow between prayer displays
- ✅ **Admin Panel** - Password-protected image management
- ✅ **Dark Theme** - Optimized for TV displays
- ✅ **Offline Support** - Works without internet (uses localStorage)
- ✅ **Responsive Design** - Works on all screen sizes

## 🚀 Quick Start

### Local Development

```bash
cd frontend
npm install
npm run dev
```

The app will be available at `http://localhost:3000`

### Production Build

```bash
cd frontend
npm run build
```

The production files will be in `frontend/dist/`

## 📦 Deployment to Netlify

### Option 1: Quick Deploy Script

```bash
cd frontend
./deploy.sh
```

### Option 2: Manual Deploy

1. Visit https://app.netlify.com/drop
2. Drag and drop the `frontend/dist` folder
3. Done! Your site is live.

### Option 3: Continuous Deployment

1. Go to https://app.netlify.com/
2. Click "Add new site" → "Import an existing project"
3. Connect your Git repository
4. Netlify will auto-detect settings from `netlify.toml`
5. Click "Deploy site"

📖 **For detailed deployment instructions, see [frontend/DEPLOYMENT.md](frontend/DEPLOYMENT.md)**

## 🔧 Configuration

### Admin Access
- Click the ⚙️ (Settings) icon on the main display
- Click "Urus Imej (Admin)"
- Password: `surau2024`

### Managing Images
1. Access the admin panel
2. Enter image URLs (must be publicly accessible HTTPS URLs)
3. Click "Preview" to verify images
4. Click "Add Image" to add to slideshow
5. Use ↑↓ buttons to reorder
6. Click 🗑️ to remove images

### Prayer Times
- Prayer times are automatically fetched from https://api.waktusolat.app/
- Location: Besut, Terengganu (zone: TRG01)
- Updates daily at midnight

## 🖥️ TV Display Setup

1. Open the deployed URL on your TV browser
2. Press F11 for fullscreen mode
3. Disable browser sleep/screensaver
4. The display will auto-update prayer times
5. Slideshow rotates every 10 seconds

## 📱 Technology Stack

- **Frontend**: React 19 + TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS v4
- **UI Components**: shadcn/ui (Radix UI)
- **Routing**: React Router v7
- **State Management**: React Query
- **Icons**: Lucide React
- **Date Handling**: date-fns

## 📂 Project Structure

```
frontend/
├── src/
│   ├── components/     # Reusable UI components
│   ├── pages/          # Page components (AdminPanel)
│   ├── providers/      # Context providers
│   ├── App.tsx         # Main prayer times display
│   └── main.tsx        # App entry point
├── public/             # Static assets
├── dist/               # Production build (generated)
├── netlify.toml        # Netlify configuration
├── DEPLOYMENT.md       # Detailed deployment guide
└── deploy.sh           # Quick deployment script
```

## 🔐 Security

- Admin panel is password-protected
- Images are stored in localStorage (client-side)
- No sensitive data is transmitted
- All API calls use HTTPS

## 🌐 API Integration

**Prayer Times API**: https://api.waktusolat.app/
- Zone: TRG01 (Besut, Terengganu)
- Updates: Daily
- Fallback: localStorage cache

## 📄 License

This project is created for Surau Al-Ittihad, Kampung Raja Besut, Terengganu.

## 🤝 Support

For issues or questions:
- Check the [DEPLOYMENT.md](frontend/DEPLOYMENT.md) guide
- Review the build logs
- Verify all dependencies are installed

## 🎉 Credits

Built with ❤️ using Evo Builder

---

**Location**: Surau Al-Ittihad, Kampung Raja Besut, Terengganu
**Deployed**: December 2024
