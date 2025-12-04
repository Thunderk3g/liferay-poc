# 🚀 Liferay POC - Content-Managed Application

A **production-ready, content-managed, Docker-isolated** Liferay application where all content is managed via Liferay CMS and automatically synced to a React frontend.

## ✨ Key Features

✅ **100% Content-Managed** - All pages managed through Liferay CMS  
✅ **Real-Time Frontend Updates** - Zero deployment needed for content changes  
✅ **Docker Isolated** - Everything runs in containers  
✅ **No System Dependencies** - Gradle builds inside Docker  
✅ **Enterprise Ready** - Liferay 7.4 with full module support  
✅ **Single Page Component** - Clean, maintainable React architecture  

## 🎯 Quick Start (5 minutes)

### Start Everything with One Command
```powershell
docker-compose up
```

That's it! This single command starts:
- ✅ **Liferay Backend** at http://localhost:8080
- ✅ **React Frontend** at http://localhost:3000
- ✅ **Gradle Builder** ready for module builds

### Optional: Build Modules (in separate terminal)
```powershell
.\backend-build-docker.ps1
# Builds Gradle inside Docker, no system dependencies
```

## 📊 Architecture

```
Frontend (React)              Backend (Liferay)            Build (Docker)
http://localhost:3000   →    http://localhost:8080   ←   Gradle 8.5
├─ HomePage.tsx               ├─ CMS System                ├─ Modules
├─ Dynamic Tabs               ├─ REST API                  ├─ Themes
└─ Content Display            ├─ Headless Delivery         └─ Auto-Deploy
     ↑                        └─ Plugins                        ↑
     └────────────────────────────────────────────────────────┘
```

## 💻 Create Content (No Code Needed!)

### 1. Open Liferay Admin
```
URL: http://localhost:8080
Email: test@liferay.com
Password: test
```

### 2. Create New Article
Go to: **Content & Data → Web Content → Create**

### 3. Fill Fields
```
Title:       Home
Description: Welcome to our site
content:     This is the home page content
imageUrl:    https://via.placeholder.com/800x400
link:        https://example.com
linkText:    Learn More
```

### 4. Click Publish

### 5. Magic! ✨
Frontend automatically shows:
- New "Home" tab
- All content displayed
- Images, links, everything

**No frontend deployment needed!**

## 📁 Project Structure

```
backend/                           # Liferay Workspace
├── configs/docker/
│   ├── docker-compose.yml        # Updated with gradle-builder
│   ├── .env                      # Environment variables
│   └── README.md
├── modules/                      # Your custom modules
├── deploy/                       # Built modules auto-deploy
└── build.gradle

frontend/                          # React Application
├── src/pages/HomePage.tsx        # Content-managed page (100% CMS-driven)
├── src/App.tsx                   # Simplified router
├── src/services/api.ts           # Liferay API client
└── package.json

Scripts:
├── backend-build-docker.ps1      # Build Gradle in Docker
├── docker-up.ps1                 # Start all services
└── docker-down.ps1               # Stop all services

Documentation:
├── COMPLETE_SETUP.md             # Full setup guide
├── CONTENT_MANAGED_LIFECYCLE.md  # CMS workflow
└── SETUP_GUIDE.md                # Detailed configuration
```

## 🔄 Content Lifecycle

```
1. Create Article in Liferay
   │
   └─→ Publish
       │
       └─→ Available via REST API
           │
           └─→ Frontend fetches content
               │
               └─→ React renders automatically
                   │
                   └─→ User sees content instantly!
```

## 📝 Content Fields

When creating articles, use these field names:

| Field | Display | Example |
|-------|---------|---------|
| `title` | Tab name + heading | "Home" |
| `description` | Subtitle | "Welcome" |
| `content` | Main body | Full content text |
| `imageUrl` | Hero image | "https://...jpg" |
| `link` | Button URL | "https://example.com" |
| `linkText` | Button text | "Learn More" |

## 🛠️ Build Liferay Modules

All builds happen **inside Docker** - no system Gradle needed!

```powershell
# From project root
.\backend-build-docker.ps1

# What happens:
# 1. Docker Gradle container starts
# 2. Builds backend/modules/
# 3. Creates JAR in backend/deploy/
# 4. Liferay auto-deploys from volume mount
# 5. Module loads into OSGi container
```

## 🐳 Docker Commands

```powershell
# Start everything (Liferay + Frontend + Gradle)
docker-compose up

# Start in background
docker-compose up -d

# Stop everything
docker-compose down

# View logs
docker-compose logs -f

# View specific service logs
docker-compose logs -f liferay
docker-compose logs -f frontend

# Restart a service
docker-compose restart liferay

# Access Liferay container
docker exec -it liferay-portal-ce bash

# Reset database
docker-compose down -v
docker-compose up
```

## 🧪 Test the System

### Create Your First Page
1. Open http://localhost:8080
2. Login: test@liferay.com / test
3. Content & Data → Web Content → Create
4. Add title: "Welcome"
5. Add content: "Hello from Liferay CMS!"
6. Click Publish
7. Open http://localhost:3000
8. **See "Welcome" tab with your content!**

### Edit Content Live
1. Go back to Liferay
2. Edit the "Welcome" article
3. Change the content
4. Publish
5. Refresh frontend
6. **See updated content instantly!**

## 🚀 Next Steps

### For Marketers
- Create content in Liferay
- No technical knowledge needed
- Changes appear instantly

### For Developers
- Extend `frontend/src/pages/HomePage.tsx` to handle custom fields
- Create Liferay modules in `backend/modules/`
- Build with `.\backend-build-docker.ps1`

### For DevOps
- Docker images pre-configured
- Gradle runs in container
- Easy to deploy to production
- All configuration in `.env` files

## 📚 Documentation

- **COMPLETE_SETUP.md** - Full system overview and architecture
- **CONTENT_MANAGED_LIFECYCLE.md** - Detailed CMS workflow guide
- **SETUP_GUIDE.md** - Complete configuration reference
- **FRONTEND_INTEGRATION.md** - Frontend development guide
- **BUILD_WORKFLOW_SUMMARY.md** - Build process details

## ⚙️ Configuration

### Liferay Settings
Edit `backend/configs/docker/.env`:
```env
LIFERAY_VERSION=7.4.3.132-ga132
LIFERAY_HOST_PORT=8080
LIFERAY_JVM_OPTS=-Xmx1g -Xms512m
```

### Frontend Settings
Create `frontend/.env.local`:
```env
VITE_API_BASE_URL=http://localhost:8080
VITE_LIFERAY_SITE_ID=20124
```

## 🔒 Security

### Development (Default)
- Email: test@liferay.com
- Password: test
- Basic Authentication

### Production (Before Deployment)
- [ ] Change default credentials
- [ ] Configure OAuth2 authentication
- [ ] Enable HTTPS/SSL
- [ ] Configure firewall rules
- [ ] Set up WAF (Web Application Firewall)
- [ ] Regular security updates

## 🐛 Troubleshooting

### Frontend shows "No content found"
```
Solution:
1. Create content in http://localhost:8080
2. Refresh http://localhost:3000
```

### Cannot connect to Liferay
```
Solution:
1. Check: docker ps
2. Wait 5-10 minutes for startup
3. Check logs: docker logs -f liferay-portal-ce
```

### Port already in use
```
Solution:
Edit backend/configs/docker/.env:
LIFERAY_HOST_PORT=8081

Edit frontend/.env.local:
VITE_API_BASE_URL=http://localhost:8081
```

## 📊 System Requirements

- Docker Desktop (latest)
- 2GB+ RAM allocated to Docker
- 10GB+ free disk space
- Windows 10/11, macOS, or Linux

## 🎓 Learning Path

1. **Start the system** → `.\docker-up.ps1`
2. **Create content** → Go to Liferay admin
3. **See frontend** → http://localhost:3000
4. **Extend it** → Edit HomePage.tsx
5. **Deploy** → Follow COMPLETE_SETUP.md

## ✅ Verification Checklist

- [ ] `.\docker-up.ps1` starts without errors
- [ ] Liferay accessible at http://localhost:8080
- [ ] Frontend accessible at http://localhost:3000
- [ ] Can login to Liferay (test@liferay.com / test)
- [ ] Can create content in Liferay
- [ ] Frontend displays created content automatically
- [ ] `.\backend-build-docker.ps1` works without errors
- [ ] No system Gradle/Java dependencies needed

## 🚀 Ready to Go!

Everything is set up and ready. Just run:

```powershell
docker-compose up
```

Open http://localhost:8080 (Liferay) and http://localhost:3000 (Frontend), then create your first content in Liferay and watch it appear in the frontend instantly!

---

**For detailed setup and architecture information, see [COMPLETE_SETUP.md](COMPLETE_SETUP.md)**

### Corporate Proxy Configuration

If you're behind a corporate proxy (e.g., Zscaler), uncomment and configure these variables in `.env`:

```env
HTTP_PROXY=http://proxy.company.com:8080
HTTPS_PROXY=http://proxy.company.com:8080
NO_PROXY=localhost,127.0.0.1
```

Then uncomment the proxy environment variables in `docker-compose.yml`:

```yaml
environment:
  HTTP_PROXY: ${HTTP_PROXY}
  HTTPS_PROXY: ${HTTPS_PROXY}
  NO_PROXY: ${NO_PROXY}
```

### JVM Memory Configuration

The default configuration allocates 2GB heap memory:

```
-Xms2g -Xmx2g
```

To adjust memory allocation:

1. Edit `.env` file
2. Modify `LIFERAY_JVM_OPTS` variable
3. Restart the container: `docker-compose restart`

**Recommended Settings:**
- Development: `-Xms2g -Xmx2g`
- Production: `-Xms4g -Xmx4g` (requires at least 8GB host RAM)

## Hot-Deploy Modules

### Deploy OSGi Bundles

1. Copy your `.jar` or `.war` files to the `deploy/` folder
2. Liferay will automatically detect and deploy them
3. Monitor deployment in logs: `docker-compose logs -f liferay`

**Example:**
```bash
cp my-module.jar deploy/
```

**Note:** Files will "disappear" from the `deploy/` folder after successful deployment. This is normal behavior - Liferay moves them to the appropriate OSGi folder.

### Deploy Configuration Files

1. Create configuration files (`.config` format)
2. Place them in `files/osgi/configs/`
3. Restart the container: `docker-compose restart`

## Data Persistence

All Liferay data is persisted using Docker volumes:

- `liferay-data`: Core application data (documents, database, search indexes)
- `liferay-osgi-configs`: OSGi configuration files
- `liferay-osgi-marketplace`: Marketplace applications
- `liferay-osgi-modules`: Deployed modules
- `liferay-osgi-war`: WAR file deployments

### Backup Data

```bash
# Stop the container
docker-compose down

# Backup all volumes (example for liferay-data)
docker run --rm -v liferay-data:/data -v C:\backup:/backup alpine tar czf /backup/liferay-data-backup.tar.gz -C /data .

# For all volumes
docker run --rm -v liferay-osgi-configs:/data -v C:\backup:/backup alpine tar czf /backup/liferay-osgi-configs-backup.tar.gz -C /data .
```

### Restore Data

```bash
# Stop and remove containers
docker-compose down

# Remove old volumes (WARNING: This deletes all data!)
docker volume rm liferay-data

# Recreate volume
docker volume create liferay-data

# Restore from backup
docker run --rm -v liferay-data:/data -v C:\backup:/backup alpine tar xzf /backup/liferay-data-backup.tar.gz -C /data
```

## Docker Commands

### Start Liferay
```bash
docker-compose up -d
```

### Stop Liferay
```bash
docker-compose stop
```

### View Logs
```bash
docker-compose logs -f liferay
```

### Restart Liferay
```bash
docker-compose restart
```

### Stop and Remove Container
```bash
docker-compose down
```

### Stop and Remove Everything (Including Volumes)
```bash
docker-compose down -v
```

## Troubleshooting

### 1. Container Won't Start

**Symptom:** Container exits immediately after starting

**Solutions:**
- Check if port 8080 is already in use:
  ```bash
  netstat -ano | findstr :8080
  ```
- Verify Docker has enough memory allocated (minimum 4GB)
- Check logs: `docker-compose logs liferay`

### 2. Out of Memory Errors

**Symptom:** Container crashes with `OutOfMemoryError` in logs

**Solutions:**
- Increase JVM heap size in `.env`:
  ```env
  LIFERAY_JVM_OPTS=-Xms4g -Xmx4g -XX:NewSize=2g -XX:MaxNewSize=2g -XX:MetaspaceSize=1g -XX:MaxMetaspaceSize=1g
  ```
- Increase Docker Desktop memory limit (Settings > Resources > Memory)
- Ensure at least 2x the heap size is available in total RAM

### 3. Slow Startup / Performance Issues

**Symptom:** Liferay takes more than 5 minutes to start or runs slowly

**Solutions:**
- Check CPU allocation in Docker Desktop (minimum 2 CPUs recommended)
- Verify antivirus isn't scanning Docker volumes
- On Windows: Ensure WSL2 backend is enabled (faster than Hyper-V)
- Increase JVM NewSize parameters in `.env`

### 4. Setup Wizard Still Appears

**Symptom:** Setup wizard appears despite configuration

**Solutions:**
- Verify `.env` file exists and is in the correct directory
- Check `docker-compose.yml` properly references environment variables
- Restart with clean state:
  ```bash
  docker-compose down -v
  docker-compose up -d
  ```
- Verify environment variable is set in container:
  ```bash
  docker exec liferay-portal-ce env | grep SETUP
  ```

### 5. Modules Not Deploying

**Symptom:** Files in `deploy/` folder not getting picked up

**Solutions:**
- Verify folder is correctly mounted:
  ```bash
  docker exec liferay-portal-ce ls -la /mnt/liferay/deploy
  ```
- Check module compatibility with Liferay version
- Review logs for deployment errors:
  ```bash
  docker-compose logs -f liferay | findstr /i "deploy"
  ```
- Ensure proper file permissions (especially on Linux/Mac)

### 6. Cannot Access Liferay at localhost:8080

**Symptom:** Browser shows "connection refused" or "cannot connect"

**Solutions:**
- Verify container is running: `docker-compose ps`
- Check container health: `docker-compose ps` (should show "healthy" status)
- Wait for full startup (check logs): `docker-compose logs -f liferay`
- Verify port mapping: `docker port liferay-portal-ce`
- Test with curl: `curl http://localhost:8080`

### 7. Database Errors

**Symptom:** Database connection errors in logs

**Solutions:**
- HSQL is embedded - no external DB needed
- If seeing errors, remove volumes and restart:
  ```bash
  docker-compose down -v
  docker-compose up -d
  ```
- Check disk space: `docker system df`

### 8. Proxy Issues (Corporate Networks)

**Symptom:** Cannot download marketplace apps or connect to external services

**Solutions:**
- Configure proxy settings in `.env` (see Configuration section)
- Uncomment proxy variables in `docker-compose.yml`
- Verify proxy URL format: `http://proxy.company.com:port`
- Test proxy from container:
  ```bash
  docker exec liferay-portal-ce curl -I http://www.liferay.com
  ```
- Add NO_PROXY for local addresses: `localhost,127.0.0.1,.local`

### 9. Volume Permission Issues (Linux/Mac)

**Symptom:** Permission denied errors when accessing volumes

**Solutions:**
- Check volume ownership:
  ```bash
  docker exec liferay-portal-ce ls -la /opt/liferay/data
  ```
- On Linux, ensure proper user permissions:
  ```bash
  sudo chown -R 1000:1000 ./deploy ./files
  ```

### 10. Container Health Check Failing

**Symptom:** Container shows "unhealthy" status

**Solutions:**
- Check if Liferay web server is responding:
  ```bash
  docker exec liferay-portal-ce curl -f http://localhost:8080
  ```
- Increase health check start_period in `docker-compose.yml` if startup is slow
- Review logs for application errors: `docker-compose logs liferay`

## Advanced Configuration

### Custom Portal Properties

Create `files/portal-ext.properties`:

```properties
# Custom portal properties
company.default.locale=en_US
company.default.time.zone=UTC
```

Then restart: `docker-compose restart`

### HTTPS Configuration

To enable HTTPS, you'll need to:

1. Generate SSL certificates
2. Configure Tomcat connector in Liferay
3. Mount certificates into container
4. Update port mappings in `docker-compose.yml`

Refer to [Liferay SSL Configuration Guide](https://learn.liferay.com/w/dxp/self-hosted-installation-and-upgrades/securing-liferay/configuring-ssl) for detailed steps.

## Monitoring and Logs

### View Real-time Logs
```bash
docker-compose logs -f liferay
```

### Export Logs to File
```bash
docker-compose logs liferay > liferay-logs.txt
```

### Check Container Resources
```bash
docker stats liferay-portal-ce
```

### Access Container Shell
```bash
docker exec -it liferay-portal-ce bash
```

## Upgrading Liferay

1. Backup your data (see Data Persistence section)
2. Update `LIFERAY_VERSION` in `.env`
3. Pull new image: `docker-compose pull`
4. Recreate container: `docker-compose up -d`
5. Monitor logs for migration messages

## Security Notes

- Change default admin credentials after first login
- Use secrets management for production (not .env files)
- Keep Liferay version updated with latest security patches
- Configure firewall rules to restrict access to port 8080
- Consider using Docker secrets for sensitive configuration

## Resources

- [Liferay Official Documentation](https://learn.liferay.com/)
- [Liferay Docker Hub](https://hub.docker.com/r/liferay/portal)
- [Liferay Community Forums](https://liferay.dev/forums/)
- [Liferay GitHub Repository](https://github.com/liferay/liferay-portal)

## Support

For issues specific to this Docker setup, please check the Troubleshooting section above.

For Liferay-specific questions, visit [Liferay Community](https://liferay.dev/).

## License

This Docker setup configuration is provided as-is for use with Liferay Portal CE, which is licensed under LGPL.
