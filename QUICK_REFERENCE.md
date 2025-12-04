# Quick Reference Card

## 🚀 Start Everything (3 Steps)

```powershell
# Step 1: Start Liferay (Terminal 1)
.\docker-up.ps1

# Step 2: Start Frontend (Terminal 2)
cd frontend
npm install
npm run dev

# Step 3: Build Backend (Terminal 3 - if needed)
.\backend-build-docker.ps1
```

## 📍 URLs

| Service | URL | Login |
|---------|-----|-------|
| Liferay CMS | http://localhost:8080 | test@liferay.com / test |
| Frontend App | http://localhost:3000 | (No auth needed) |
| API | http://localhost:8080/o/headless-delivery | (Basic Auth) |

## 🎯 Create Content (In Liferay)

1. Go to **http://localhost:8080**
2. **Content & Data → Web Content → Create**
3. Fill these fields:
   - `title` - Page name
   - `description` - Short description
   - `content` - Main content
   - `imageUrl` - Image URL (optional)
   - `link` - Button URL (optional)
   - `linkText` - Button text (optional)
4. **Publish**
5. Frontend auto-updates! ✓

## 🐳 Docker Commands

```powershell
# Start all services
.\docker-up.ps1

# Stop all services
.\docker-down.ps1

# View logs
docker logs -f liferay-portal-ce

# Restart Liferay
docker restart liferay-portal-ce

# Reset database
cd backend/configs/docker
docker-compose down -v
docker-compose up -d
```

## 🛠️ Frontend Commands

```bash
cd frontend

# Start dev server
npm run dev

# Build for production
npm run build

# Lint code
npm run lint

# Preview build
npm run preview
```

## 🔨 Backend Commands

```powershell
# Build inside Docker (recommended)
.\backend-build-docker.ps1

# Or manually:
cd backend/configs/docker
docker-compose run --rm gradle-builder gradle clean build

# View specific module
cd backend/modules/my-module
..\..\..\gradlew build
```

## 📝 Content Field Reference

| Field Name | What It Is | Example |
|------------|-----------|---------|
| `title` | Page tab name + heading | "Home" |
| `description` | Subtitle shown under title | "Welcome to our site" |
| `content` | Main body text | Full article content |
| `imageUrl` | Hero image URL | "https://example.com/img.jpg" |
| `link` | Button/CTA link URL | "https://shop.example.com" |
| `linkText` | Button/CTA text | "Shop Now" |

## 🧪 Test Checklist

- [ ] `.\docker-up.ps1` starts without errors
- [ ] Can access http://localhost:8080
- [ ] Can login with test@liferay.com / test
- [ ] Can create content in Liferay
- [ ] Can access http://localhost:3000
- [ ] Frontend shows Liferay content
- [ ] Content appears in new tab
- [ ] `.\backend-build-docker.ps1` works

## 🚨 Common Issues & Fixes

| Problem | Solution |
|---------|----------|
| Port 8080 in use | Change `LIFERAY_HOST_PORT` in `.env` |
| Liferay won't start | Wait 5-10 min, check: `docker logs liferay-portal-ce` |
| Frontend won't connect | Ensure Liferay is running, check: `docker ps` |
| Content not showing | Create article in Liferay, refresh frontend |
| Build fails | Check: `docker-compose logs gradle-builder` |
| Out of memory | Allocate more RAM to Docker |

## 📚 Key Files

```
Homepage (Content-Managed):
  frontend/src/pages/HomePage.tsx

App Router:
  frontend/src/App.tsx

Docker Config:
  backend/configs/docker/docker-compose.yml

Build Script:
  backend-build-docker.ps1

Documentation:
  COMPLETE_SETUP.md
  CONTENT_MANAGED_LIFECYCLE.md
```

## 🔑 Important Credentials

```
Liferay Admin:
  Email: test@liferay.com
  Password: test
  
API Authentication:
  Type: Basic Auth
  Username: test@liferay.com
  Password: test
```

## 🌐 API Endpoints

```
Get All Content:
  GET /o/headless-delivery/v1.0/sites/20124/structured-contents
  
Get Single Content:
  GET /o/headless-delivery/v1.0/structured-contents/{contentId}

Create Content:
  POST /o/headless-delivery/v1.0/sites/20124/structured-contents

Update Content:
  PUT /o/headless-delivery/v1.0/structured-contents/{contentId}

Delete Content:
  DELETE /o/headless-delivery/v1.0/structured-contents/{contentId}
```

## ⚡ Performance Tips

- **Frontend**: Content cached on first load, no extra requests
- **Liferay**: Use Elasticsearch for large datasets
- **Docker**: Allocate 2GB+ RAM
- **Images**: Optimize image files before uploading
- **Build**: Gradle cache in Docker volume (persistent)

## 🔄 Workflow Examples

### Marketing Team Adding Page
```
1. Open Liferay at http://localhost:8080
2. Create new "Products" article
3. Add content
4. Publish
5. Frontend shows "Products" tab instantly!
```

### Developer Extending Frontend
```
1. Edit frontend/src/pages/HomePage.tsx
2. Add new field extraction
3. Save file
4. Frontend hot-reloads automatically
```

### Building a Module
```
1. Create backend/modules/my-module/
2. Run .\backend-build-docker.ps1
3. Gradle builds in Docker
4. JAR auto-deploys to Liferay
5. Module available immediately!
```

## 📊 System Status

Check if everything is running:

```bash
# Check Docker containers
docker ps

# Check Liferay startup
docker logs -f liferay-portal-ce | grep "Server started"

# Check frontend build
npm run build (in frontend/)

# Check API connectivity
curl -u test@liferay.com:test http://localhost:8080/o/headless-delivery/v1.0/sites/20124/structured-contents
```

## 🎯 Next: What's Possible

✓ Create unlimited pages via CMS  
✓ Custom fields for structured content  
✓ Multi-language content  
✓ Scheduled publishing  
✓ Content versioning  
✓ Workflow approvals  
✓ Custom modules  
✓ API integrations  
✓ Mobile apps via same API  

---

**Everything is ready to use. Start with `.\docker-up.ps1`! 🚀**
