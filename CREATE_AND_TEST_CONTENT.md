# Create & Test Content - Step by Step Guide

## 🎯 Step 1: Verify Services Running

Make sure all services are running:

```powershell
docker-compose ps
```

You should see:
- ✅ `liferay-portal-ce` - Running on port 8080
- ✅ `liferay-frontend` - Running on port 3000
- ✅ `liferay-gradle-builder` - Running

## 📝 Step 2: Create Content in Liferay

### Login to Liferay Admin

1. Open browser: http://localhost:8080
2. Login with credentials:
   - **Email:** test@liferay.com
   - **Password:** test

### Create Structured Content Article

1. Click **Content & Data** in left sidebar
2. Click **Web Content** 
3. Click **Create** button → **Web Content Article**

### Fill in the Article

**Title:**
```
Welcome to My App
```

**Description:**
```
This is our first content-managed article
```

**Content:**
```html
<p>This content is managed entirely through Liferay CMS and appears instantly on the frontend!</p>
<p>No code deployment needed - just create, publish, and it shows up.</p>
```

**Select Structure** (if prompted):
- Choose "Basic Web Content" or default structure

### Additional Fields (Optional)

If your structured content has these fields, fill them:
- **imageUrl:** `https://via.placeholder.com/800x400?text=Welcome`
- **link:** `https://example.com`
- **linkText:** `Learn More`

## 🚀 Step 3: Publish the Article

1. Click **Publish** button (top right)
2. Wait for success message
3. Article is now live in Liferay

## ✅ Step 4: Verify in Frontend

### Check Frontend

1. Open: http://localhost:3000
2. Look for your article content
3. You should see:
   - New tab with title: "Welcome to My App"
   - Content displayed below
   - All formatted correctly

### If Content Doesn't Appear

**Solution 1: Refresh the page**
```
Press: Ctrl + Shift + R (hard refresh)
```

**Solution 2: Check browser console**
- Press: F12 (Developer Tools)
- Go to **Console** tab
- Look for any error messages
- Check the **Network** tab to see if API is being called

**Solution 3: Check Liferay logs**
```powershell
docker-compose logs -f liferay | Select-String -Pattern "error|content" -Context 2
```

**Solution 4: Verify API endpoint**
```
Open: http://localhost:8080/o/headless-delivery/v1.0/sites/20124/structured-contents
You should see your articles in JSON format
```

## 📊 Step 5: Test Real-Time Updates

### Edit the Article in Liferay

1. Go back to Liferay admin
2. Find your "Welcome to My App" article
3. Click it to edit
4. Change the **Description** to:
   ```
   Updated description - see it update instantly!
   ```
5. Click **Publish**

### Refresh Frontend

1. Go back to http://localhost:3000
2. Refresh the page (F5)
3. See the updated description immediately!

**No frontend code changes needed!** ✨

## 🎨 Step 6: Create Multiple Articles

Repeat **Step 2-4** with different content:

### Article 2: Features
```
Title: Our Features
Description: What makes us special
Content: List your key features here
```

### Article 3: Pricing
```
Title: Pricing Plans
Description: Flexible pricing for everyone
Content: Your pricing tiers
```

Each new article automatically creates a new tab in the frontend!

## 🔍 Troubleshooting

### Content not showing?

1. **Check Liferay is running:**
   ```powershell
   curl http://localhost:8080
   ```

2. **Check Frontend is running:**
   ```powershell
   curl http://localhost:3000
   ```

3. **Check API response:**
   ```powershell
   $response = Invoke-WebRequest -Uri "http://localhost:8080/o/headless-delivery/v1.0/sites/20124/structured-contents"
   $response.Content | ConvertFrom-Json | ConvertTo-Json
   ```

4. **Check article is published:**
   - Go to Liferay admin
   - Content & Data → Web Content
   - Look for your article with "Published" status

### Frontend shows "No content found"?

1. Create at least one article in Liferay
2. Make sure it's **Published** (not Draft)
3. Hard refresh frontend: **Ctrl + Shift + R**
4. Check console (F12) for errors

## 📋 Content Field Reference

When creating articles, use these field names in your structured content:

| Field Name | Display | Example |
|-----------|---------|---------|
| `title` | Tab label + heading | "Welcome to My App" |
| `description` | Subtitle/summary | "Quick overview" |
| `content` | Main content body | Full HTML/text content |
| `imageUrl` | Featured image | "https://example.com/image.jpg" |
| `link` | Button URL | "https://example.com" |
| `linkText` | Button text | "Learn More" |

## 🎓 Next Steps

1. ✅ Create your first article
2. ✅ Verify it appears in frontend
3. ✅ Edit the article and see instant updates
4. ✅ Create multiple articles (creates multiple tabs)
5. ✅ Customize the HomePage.tsx to style content differently

## 💡 Tips

- **Images:** Use full HTTPS URLs (not localhost)
- **Content Formatting:** Use HTML tags for rich formatting
- **Links:** Articles appear automatically as tabs, but you can add buttons with custom links
- **Multiple Sites:** All content from site ID `20124` appears in frontend
- **Auto-Refresh:** Frontend auto-loads new content every page load

---

**You're now running a fully content-managed application!** 🎉

Content managers can create/edit articles without touching code, and it automatically appears on the frontend.
