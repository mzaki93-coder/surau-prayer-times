# 🚀 Netlify Deployment Guide for Surau Al-Ittihad Prayer Times

## ✅ Prerequisites Completed

- ✅ Build configuration set up (`netlify.toml`)
- ✅ Routing redirects configured (`public/_redirects`)
- ✅ Production build tested successfully
- ✅ Changes committed to git repository

## 📋 Deployment Options

### Option 1: Deploy via Netlify CLI (Recommended for Quick Deploy)

1. **Login to Netlify**
   ```bash
   cd /home/user/project/frontend
   netlify login
   ```
   This will open a browser window to authenticate.

2. **Deploy the site**
   ```bash
   netlify deploy --prod
   ```
   - When prompted for "Publish directory", enter: `dist`
   - The CLI will build and deploy your site

### Option 2: Deploy via Netlify Dashboard (Recommended for Continuous Deployment)

1. **Go to Netlify Dashboard**
   - Visit: https://app.netlify.com/
   - Sign in with your account

2. **Import from Git**
   - Click "Add new site" → "Import an existing project"
   - Choose your Git provider (GitHub, GitLab, Azure DevOps, etc.)
   - Authorize Netlify to access your repository
   - Select your repository: `demo-zaki-awangkechik-187`
   - Select branch: `fresh-reef-69429`

3. **Configure Build Settings**
   Netlify will auto-detect the settings from `netlify.toml`, but verify:
   - **Base directory**: `frontend`
   - **Build command**: `npm run build`
   - **Publish directory**: `frontend/dist`
   - **Node version**: `20`

4. **Deploy**
   - Click "Deploy site"
   - Netlify will build and deploy your site
   - You'll get a URL like: `https://random-name-123456.netlify.app`

5. **Custom Domain (Optional)**
   - Go to "Domain settings"
   - Add your custom domain
   - Follow DNS configuration instructions

### Option 3: Manual Deploy (Drag & Drop)

1. **Build the project locally**
   ```bash
   cd /home/user/project/frontend
   npm run build
   ```

2. **Go to Netlify Dashboard**
   - Visit: https://app.netlify.com/drop
   - Drag and drop the `frontend/dist` folder
   - Your site will be deployed instantly!

## 🔧 Configuration Details

### netlify.toml
```toml
[build]
  base = "frontend"
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

[build.environment]
  NODE_VERSION = "20"
```

### Routing
The `_redirects` file ensures that React Router works correctly:
```
/*    /index.html   200
```

## 🎯 Post-Deployment

### Verify Deployment
1. Visit your Netlify URL
2. Test the main prayer times display
3. Test the admin panel at `/admin`
4. Verify routing works (refresh on `/admin` should not 404)

### Configure for TV Display
1. Open the deployed URL on your TV browser
2. Set to fullscreen mode (F11 on most browsers)
3. Disable browser sleep/screensaver
4. The app will auto-refresh prayer times

### Admin Access
- Click the ⚙️ Settings icon
- Click "Urus Imej (Admin)"
- Password: `surau2024`
- Manage slideshow images

## 🔄 Continuous Deployment

If you used Option 2 (Git integration):
- Every push to the `fresh-reef-69429` branch will auto-deploy
- You can see build logs in Netlify dashboard
- Failed builds won't affect the live site

## 📱 Features Deployed

✅ Prayer times display (Subuh, Syuruk, Zohor, Asar, Maghrib, Isyak)
✅ Hijri date display
✅ Automatic prayer time updates
✅ Countdown timers
✅ Visual alerts at prayer time
✅ Iqamah countdown
✅ Image slideshow management
✅ Admin panel with password protection
✅ Dark theme optimized for TV
✅ Responsive design
✅ Offline-capable (localStorage)

## 🆘 Troubleshooting

### Build Fails
- Check Node version is 20 or higher
- Verify all dependencies are in `package.json`
- Check build logs in Netlify dashboard

### Routing Issues (404 on refresh)
- Verify `_redirects` file is in `public/` folder
- Check `netlify.toml` has the redirect rule

### Images Not Loading
- Images are stored in localStorage
- Add images via Admin panel after deployment
- Use publicly accessible image URLs (HTTPS)

### API Issues
- Prayer times API: https://api.waktusolat.app/
- Check browser console for API errors
- Verify internet connection on TV

## 📞 Support

For issues or questions:
- Check Netlify docs: https://docs.netlify.com/
- Check build logs in Netlify dashboard
- Verify all files are committed to git

## 🎉 Success!

Once deployed, your prayer times display will be accessible 24/7 from anywhere!
Share the URL with your surau community.

---

**Deployed by**: Evo Builder
**Date**: December 2024
**App**: Surau Al-Ittihad Prayer Times Display
