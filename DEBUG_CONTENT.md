# Debug: Content Not Showing

## 🔍 Quick Checks

### 1. Check if Content is Being Created in Right Site

Liferay has multiple sites. Your content needs to be in **Site ID 20124**.

**Check your articles:**
1. Go to http://localhost:8080
2. Login: test@liferay.com / test
3. Click **Content & Data** → **Web Content**
4. Look at each article - what **site** is it in?

**To see the site ID:**
1. Click on an article
2. Look for "Site" dropdown or info in the article details

### 2. If Content is in Wrong Site

**Option A: Use Default Site ID (Recommended)**

Your content might be in the **default site (ID 20124)** but Liferay is returning empty. Try these site IDs:

```
http://localhost:8080/o/headless-delivery/v1.0/sites/20125/structured-contents
http://localhost:8080/o/headless-delivery/v1.0/sites/20126/structured-contents
http://localhost:8080/o/headless-delivery/v1.0/my-sites/sites
```

**Option B: Update Frontend to Use Correct Site**

Edit `frontend/src/pages/HomePage.tsx`:

Find this line:
```typescript
'/o/headless-delivery/v1.0/sites/20124/structured-contents?pageSize=100',
```

And update `20124` to the correct site ID you found.

### 3. Check API Response

**In PowerShell, try:**

```powershell
# Check if Liferay is returning ANY sites
Invoke-WebRequest "http://localhost:8080/o/headless-delivery/v1.0/my-sites/sites" | Select-Object -ExpandProperty Content
```

This will show all available sites and their IDs.

### 4. Check Liferay Logs

```powershell
docker-compose logs liferay | Select-String "error" -Context 2 -Last 20
```

Look for any deployment or API errors.

## ✅ Solution: Create Content in Correct Site

1. Go to Liferay admin: http://localhost:8080
2. Top right, click your **site selector** (usually shows site name)
3. Make sure you're in the **correct site** (should be "Guest" or site 20124)
4. Go to **Content & Data** → **Web Content** → **Create**
5. Create your article
6. **Publish**

## 🚀 After Publishing

1. Hard refresh frontend: http://localhost:3000 (**Ctrl + Shift + R**)
2. Content should appear immediately
3. Check browser console (F12) for errors

## 📋 Common Issues & Fixes

| Issue | Solution |
|-------|----------|
| "No content found" in frontend | Content is in different site - check site ID |
| 401 Unauthorized error | Liferay authentication failed |
| 404 Not Found | API endpoint incorrect - update site ID |
| Blank page | Hard refresh (Ctrl+Shift+R) or check console errors |

## 🔧 If Still Stuck

Run this diagnostic:

```powershell
# 1. Check Liferay is up
curl http://localhost:8080 -UseBasicParsing

# 2. Check sites available
$sites = Invoke-WebRequest "http://localhost:8080/o/headless-delivery/v1.0/my-sites/sites" -UseBasicParsing
$sites.Content

# 3. Check content in each site (replace 20124 with actual site ID)
$content = Invoke-WebRequest "http://localhost:8080/o/headless-delivery/v1.0/sites/20124/structured-contents" -UseBasicParsing
$content.Content
```

Share the output and I'll help you fix it!
