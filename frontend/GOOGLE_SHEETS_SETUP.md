# Google Sheets Setup for Slideshow Images

This guide explains how to manage slideshow images using Google Sheets instead of the admin panel.

## Benefits of Google Sheets Approach

✅ **Easy to manage** - No need to login to admin panel  
✅ **Collaborative** - Multiple people can edit the sheet  
✅ **Mobile-friendly** - Edit from any device with Google Sheets app  
✅ **Version history** - Google Sheets tracks all changes  
✅ **No database needed** - Images are fetched directly from the sheet  

## Setup Instructions

### 1. Create a Google Sheet

1. Go to [Google Sheets](https://docs.google.com/spreadsheets)
2. Click **+ Blank** to create a new spreadsheet
3. Name it something like "Surau Prayer Times - Images"

### 2. Format the Sheet

The sheet should have a simple format:

| Image URL |
|-----------|
| https://example.com/image1.jpg |
| https://example.com/image2.jpg |
| https://example.com/image3.jpg |

**Important:**
- Put image URLs in **Column A** (first column)
- First row is treated as header and will be skipped
- One URL per row
- URLs must be complete (starting with `http://` or `https://`)

### 3. Make the Sheet Public

1. Click the **Share** button (top right)
2. Click **Change to anyone with the link**
3. Set permission to **Viewer**
4. Click **Done**

### 4. Get the Sheet ID

The Sheet ID is in the URL of your Google Sheet:

```
https://docs.google.com/spreadsheets/d/[SHEET_ID]/edit
                                        ^^^^^^^^^^
```

For example, if your URL is:
```
https://docs.google.com/spreadsheets/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/edit
```

The Sheet ID is: `1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms`

### 5. Configure the Prayer Times App

1. Open the Prayer Times Display
2. Click the **⚙️ Settings** button (top right)
3. Paste the Sheet ID into the **Google Sheet ID** field
4. Click **Save & Reload**

The app will now fetch images from your Google Sheet!

## How It Works

- The app fetches the sheet as CSV format every **60 seconds**
- Images are automatically updated without refreshing the browser
- If the sheet is unavailable, default images are used as fallback
- Invalid URLs are automatically filtered out

## Image URL Sources

You can use images from:

1. **Direct URLs** - Any publicly accessible image URL
2. **Google Drive** - Share the image and use the direct link
3. **Facebook** - Right-click on image → "Copy image address"
4. **Imgur** - Upload and copy the direct link
5. **Cloud storage** - Dropbox, OneDrive (with public links)

### Getting Facebook Image URLs

1. Open the Facebook post with the image
2. Click on the image to open it full size
3. Right-click on the image
4. Select **"Copy image address"** or **"Copy image link"**
5. Paste the URL into your Google Sheet

## Example Sheet

Here's an example of a properly formatted sheet:

| Image URL |
|-----------|
| https://scontent-dub4-1.xx.fbcdn.net/v/t39.30808-6/599128109_122151056030694568_8821770402187334892_n.jpg |
| https://scontent-dub4-1.xx.fbcdn.net/v/t39.30808-6/593522905_122149870832694568_3759298780679005170_n.jpg |
| https://i.imgur.com/example.jpg |
| https://drive.google.com/uc?id=FILE_ID |

## Troubleshooting

### Images not showing?

1. **Check the Sheet ID** - Make sure it's correct
2. **Check sharing settings** - Sheet must be "Anyone with the link can view"
3. **Check URLs** - Make sure they start with `http://` or `https://`
4. **Test URLs** - Open each URL in a browser to verify it works
5. **Check browser console** - Look for error messages

### Images not updating?

- Wait up to 60 seconds for the next refresh
- Or reload the browser page manually

### Want to use default images?

- Clear the Google Sheet ID field in Settings
- Click **Save & Reload**
- The app will use the built-in default images

## Tips

💡 **Organize your images** - Add a second column with descriptions (won't affect the app)  
💡 **Test first** - Create a test sheet before using in production  
💡 **Keep URLs short** - Use URL shorteners if needed  
💡 **Backup** - Keep a copy of your image URLs elsewhere  
💡 **Monitor** - Check occasionally that all images still load  

## Support

If you need help:
1. Check the browser console for errors (F12 → Console tab)
2. Verify the Google Sheet is accessible in an incognito window
3. Test with a simple sheet containing 1-2 images first

---

**Last Updated:** December 2024
