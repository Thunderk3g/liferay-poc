# Docker Build and Deploy Guide

## Quick Start: Building Liferay Modules Inside Docker Container

### Architecture
When you run `./gradlew build` in the workspace, your Liferay modules are automatically built and deployed to the running Docker container through volume mounts.

```
┌─────────────────────────────────────────────────────────────────┐
│ Local Development Machine                                       │
│                                                                 │
│ backend/                                                        │
│ ├── modules/          → Mounted at /workspace/modules          │
│ ├── themes/           → Mounted at /workspace/themes           │
│ ├── deploy/           → Mounted at /mnt/liferay/deploy         │
│ ├── gradle.properties → Mounted at /workspace/gradle.properties│
│ └── build.gradle      → Mounted at /workspace/build.gradle     │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
                           ↓
        Gradle Build Output (JAR/WAR files)
                           ↓
┌─────────────────────────────────────────────────────────────────┐
│ Docker Container (liferay-portal-ce)                            │
│                                                                 │
│ /opt/liferay/osgi/modules/    ← Modules auto-deployed here    │
│ /opt/liferay/osgi/war/        ← WAR files auto-deployed here   │
│ /mnt/liferay/deploy/          ← Hot deployment folder          │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### Step-by-Step Build and Deploy Process

#### 1. Start the Docker Container
```powershell
cd C:\Users\diwak\OneDrive\Desktop\liferay-poc
docker-compose -f backend\configs\docker\docker-compose.yml up -d
```

#### 2. Build Your Liferay Modules Locally
```powershell
cd C:\Users\diwak\OneDrive\Desktop\liferay-poc\backend
./gradlew build
```

**What happens automatically:**
- Gradle compiles your modules in `backend/modules/`
- Compiled JAR files are generated in each module's `build/libs/` directory
- Files are placed in `backend/deploy/` folder (via volume mount)
- Liferay's hot-deploy watches the `/mnt/liferay/deploy` folder
- Modules are automatically deployed to the running container

#### 3. Monitor Deployment
```powershell
# Check container logs to see deployment activity
docker logs -f liferay-portal-ce

# Or access Liferay Admin Panel
# Navigate to: http://localhost:8080
```

### Configuration Details

#### Volume Mounts in docker-compose.yml
```yaml
volumes:
  # These mounts enable automatic deployment of built modules
  - ../modules:/workspace/modules          # Source modules
  - ../themes:/workspace/themes            # Source themes
  - ../../deploy:/mnt/liferay/deploy       # Hot-deploy folder
  - ../gradle.properties:/workspace/gradle.properties
  - ../build.gradle:/workspace/build.gradle
```

#### How It Works

1. **Build Phase**: `./gradlew build` compiles your modules locally
2. **Output**: Built artifacts go to `backend/deploy/` (which is mounted in container)
3. **Auto-Deploy**: Liferay monitors `/mnt/liferay/deploy/` and auto-deploys JAR/WAR files
4. **Deployment**: Modules are loaded into Liferay's OSGi container in real-time

### Common Gradle Build Commands

```powershell
# Build all modules
./gradlew build

# Build specific module
./gradlew :modules:my-module:build

# Build and watch for changes
./gradlew build -t

# Clean build
./gradlew clean build

# Build without tests
./gradlew build -x test

# View dependencies
./gradlew dependencies
```

### Verifying Deployment

After running `./gradlew build`, verify modules are deployed:

```powershell
# Check if files appeared in deploy folder
dir C:\Users\diwak\OneDrive\Desktop\liferay-poc\backend\deploy

# Watch container logs for deployment messages
docker logs -f liferay-portal-ce | findstr /I "install|deploy|activat"
```

### Development Workflow

```
1. Develop your module code in backend/modules/your-module/
2. Run: ./gradlew build
3. Liferay automatically deploys to container
4. Test in http://localhost:8080
5. Make changes and repeat step 2
6. No need to restart container for module changes!
```

### Troubleshooting

#### Modules not deploying?
- Verify container is running: `docker ps | findstr liferay`
- Check volume mounts: `docker inspect liferay-portal-ce | findstr Mounts -A 20`
- Review logs: `docker logs liferay-portal-ce`

#### Permission issues on Windows?
- Ensure Docker Desktop is running
- Check Windows Defender exclusions for your project path
- Restart Docker: `docker-compose restart`

#### Build errors?
- Verify Java version: `./gradlew --version` (should match Portal 7.4 requirements - Java 8+)
- Clear Gradle cache: `./gradlew clean`
- Update dependencies: `./gradlew --refresh-dependencies build`

### Frontend Integration

The React frontend automatically proxies API calls to Liferay:

```
Frontend (http://localhost:5173)
    ↓
Vite Proxy (configured in vite.config.ts)
    ↓
Liferay Backend (http://localhost:8080)
```

API calls to `/api/*` are forwarded to `http://localhost:8080/api/*`

### Performance Tips

1. **Use `./gradlew build -t`** for continuous builds during development
2. **Mount only necessary directories** to reduce Docker sync overhead
3. **Use named volumes** for Liferay data to improve performance
4. **Run Gradle tasks in parallel**: `./gradlew build --parallel`
5. **Exclude build artifacts from Docker**: Configured in `.dockerignore`

### Cleanup

```powershell
# Stop container
docker-compose -f backend\configs\docker\docker-compose.yml down

# Remove volumes (WARNING: deletes data)
docker-compose -f backend\configs\docker\docker-compose.yml down -v

# Remove unused images
docker image prune -a
```

---

## Summary

**When you build (`./gradlew build`), your changes automatically appear in the Liferay Docker container via:**
- Volume mounts that share your local `modules/` directory
- Hot-deploy folder that watches for new JAR/WAR files
- Liferay's OSGi container that loads modules dynamically

**No manual copying or container restart needed!**
