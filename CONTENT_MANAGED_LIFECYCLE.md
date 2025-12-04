# Liferay Content-Managed Lifecycle Guide

## Complete Architecture: Frontend Powered by Liferay CMS

Your application is now **100% content-managed by Liferay**. Here's how it works:

---

## How It Works: Complete Lifecycle

```
┌─────────────────────────────────────────────────────────────┐
│                   LIFERAY CONTENT MANAGEMENT                │
│              (http://localhost:8080/admin)                  │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  1. Create Structured Content (Pages/Articles)             │
│     - Title, Description, Content, Images, Links           │
│     - Custom fields as needed                              │
│                                                             │
│  2. Publish Content                                        │
│     - Available immediately via Headless API               │
│                                                             │
│  3. Automatic Frontend Sync                                │
│     - React app fetches via REST API                       │
│     - Real-time updates without rebuilding                 │
│     - No code changes needed                               │
│                                                             │
└─────────────────────────────────────────────────────────────┘
                            ↓
            (Liferay Headless Delivery API)
                            ↓
┌─────────────────────────────────────────────────────────────┐
│               REACT FRONTEND APPLICATION                    │
│            (http://localhost:3000)                          │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  - Dynamic page tabs (created from content titles)          │
│  - Dynamic content display (from Liferay fields)            │
│  - Hero images (imageUrl field)                             │
│  - CTAs and links (from content fields)                     │
│  - Real-time updates (refresh = latest content)             │
│                                                             │
│  ✓ No hardcoded pages                                      │
│  ✓ No frontend deployment needed for content changes        │
│  ✓ 100% CMS-driven                                         │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## Step 1: Create Content in Liferay

### Access Liferay Admin Panel
```
URL: http://localhost:8080
Username: test@liferay.com
Password: test
```

### Navigate to Content Management
```
Menu → Content & Data → Web Content → Content
```

### Create New Article
1. Click "+ Create"
2. Select "Structured Content" or "Web Content Article"
3. Fill in the following fields:

#### Required Fields:
- **title** - Page title (will appear as tab)
- **description** - Short description
- **content** - Main body content

#### Optional Fields:
- **imageUrl** - URL to hero image
- **link** - External link URL
- **linkText** - Button text for the link

#### Example Content:

**Article 1: Home Page**
```
Title: Home
Description: Welcome to our content hub
Content: This is the home page content managed entirely by Liferay CMS. 
         Create as much content as you need!
imageUrl: https://example.com/home-image.jpg
link: https://example.com
linkText: Learn More
```

**Article 2: About**
```
Title: About
Description: Learn about our organization
Content: We are a company dedicated to modern web technologies...
```

**Article 3: Contact**
```
Title: Contact
Description: Get in touch with us
Content: Email: contact@example.com
         Phone: +1-555-0000
```

---

## Step 2: Frontend Auto-Sync

### How the Frontend Works:

1. **Page Load**: React app loads `HomePage.tsx`
2. **API Call**: Automatically fetches all content from Liferay
3. **Dynamic Tabs**: Creates tabs from each content item's title
4. **Content Display**: Displays selected content with all fields
5. **Real-Time**: Changes in Liferay show up immediately

### No Deployment Needed!

Just:
1. Create content in Liferay
2. Refresh the browser
3. See your content live!

---

## Step 3: Content Field Mapping

The frontend automatically extracts and displays these fields:

| Liferay Field | Frontend Display |
|---------------|-----------------|
| `title` | Tab names, Page heading |
| `description` | Under page title |
| `content` | Main content area |
| `imageUrl` | Hero image display |
| `link` | CTA button href |
| `linkText` | CTA button text |
| `dateCreated` | Metadata section |
| `dateModified` | Metadata section |
| Custom fields | Fields section |

---

## Step 4: Create More Pages - No Code Needed!

Simply create new structured content articles in Liferay:

```
1. Features → Features and benefits...
2. Blog → Latest news and updates...
3. Documentation → API docs and guides...
4. Pricing → Plans and pricing info...
5. FAQ → Frequently asked questions...
```

Each one **automatically appears** as a tab in the frontend!

---

## Running the Complete System

### Terminal 1: Start Liferay Backend
```powershell
.\docker-up.ps1
# or
cd backend/configs/docker
docker-compose up -d
```

### Terminal 2: Start Frontend
```bash
cd frontend
npm install
npm run dev
```

### Terminal 3: Build Liferay Modules (if needed)
```powershell
.\backend-build-docker.ps1
# or
cd backend/configs/docker
docker-compose run --rm gradle-builder gradle build
```

---

## Rebuilding Gradle Inside Docker

No need to have Gradle on your machine! Everything builds inside Docker:

```powershell
# From project root
.\backend-build-docker.ps1

# Or manually
cd backend/configs/docker
docker-compose run --rm gradle-builder gradle clean build
```

**What happens:**
1. Docker starts Gradle container
2. Builds all modules inside container
3. JARs placed in `backend/deploy/`
4. Liferay auto-deploys from Docker volume mount
5. No system dependencies needed!

---

## Real-World Workflow

```
Day 1: Setup
  $ .\docker-up.ps1                      # Start Liferay
  $ cd frontend && npm run dev           # Start React
  ✓ System ready!

Day 2-N: Content Management
  
  Marketing Team:
    1. Open http://localhost:8080
    2. Create "New Product" article
    3. Add title, description, images
    4. Publish
    5. Frontend updates automatically! ✓
  
  Developer Team:
    1. Need to add new field?
    2. Update HomePage.tsx to extract it
    3. No Liferay changes needed
    4. Still fully CMS-driven
  
  Deployment:
    1. Build Gradle: ./backend-build-docker.ps1
    2. Deploy JAR to Liferay
    3. Frontend reflects changes via API
    4. Everything in Docker, no external deps!
```

---

## Advanced: Custom Structured Content Types

Create a custom content type in Liferay for better structure:

1. Go to Liferay Admin → Content & Data → Web Content
2. Click "Structures"
3. Create new structure
4. Add custom fields:
   - Hero Image (Document field)
   - Author (Text field)
   - Tags (Selection field)
   - SEO Keywords (Text field)

The frontend will automatically pick up custom fields and display them!

---

## Environment Setup

### Frontend Environment Variables
Create `frontend/.env.local`:
```env
VITE_API_BASE_URL=http://localhost:8080
VITE_LIFERAY_SITE_ID=20124
```

### Backend Environment Variables
Create `backend/configs/docker/.env`:
```env
LIFERAY_VERSION=7.4.3.132-ga132
LIFERAY_CONTAINER_NAME=liferay-portal-ce
LIFERAY_HOST_PORT=8080
LIFERAY_JVM_OPTS=-Xmx1g -Xms512m
GRADLE_CONTAINER_NAME=liferay-gradle-builder
```

---

## Troubleshooting

### Issue: Frontend shows "No content found"

**Solution 1: Create content in Liferay**
```
1. Go to http://localhost:8080
2. Create a structured content article
3. Refresh frontend
```

**Solution 2: Check Liferay is running**
```powershell
docker ps | findstr liferay
```

### Issue: "Cannot connect to Liferay"

**Check containers are running:**
```bash
docker-compose ps
```

**Wait for startup (can take 5-10 minutes)**

**View logs:**
```bash
docker logs -f liferay-portal-ce
```

### Issue: Module build fails in Docker

**Check build logs:**
```bash
cd backend/configs/docker
docker-compose run --rm gradle-builder gradle build --stacktrace
```

---

## API Endpoints Used

Frontend uses these Liferay APIs:

```
GET /o/headless-delivery/v1.0/sites/20124/structured-contents
  ↓
Returns all content items with:
  - id, title, description
  - contentFields array with custom fields
  - dateCreated, dateModified
  - friendlyUrlPath
```

---

## Security Notes

- Default credentials: `test@liferay.com` / `test`
- Basic Auth is used (for development only)
- For production: implement OAuth2
- CORS is handled by Vite proxy
- All data flows through Liferay's REST APIs

---

## Performance Tips

### Frontend Performance
- Content is fetched once on page load
- No re-renders on tab switches (client-side)
- Images should be optimized in Liferay

### Liferay Performance  
- Use image optimization
- Configure Elasticsearch for large content volumes
- Set up caching headers

### Docker Performance
- Allocate sufficient RAM to Docker (2GB+)
- Use WSL 2 backend on Windows
- Monitor container logs for memory issues

---

## What's Next?

1. **Create first article in Liferay**
   - Go to http://localhost:8080
   - Create "Welcome" content
   - See it appear in frontend

2. **Customize for your needs**
   - Add custom fields to HomePage.tsx
   - Create structured content types
   - Build landing pages with content

3. **Deploy to production**
   - Configure external database
   - Set up SSL/TLS
   - Use environment-specific configs
   - Deploy Docker containers

---

## Summary

✅ **100% Content-Managed**: All pages from Liferay  
✅ **Real-Time Updates**: No frontend deployment needed  
✅ **Docker Isolated**: Everything in containers  
✅ **No System Dependencies**: Build Gradle in Docker  
✅ **Frontend Auto-Sync**: Changes instant in UI  
✅ **Scalable**: Easy to add pages, fields, content  

Your Liferay-powered, content-managed application is ready! 🚀
