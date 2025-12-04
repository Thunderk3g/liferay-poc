# Quick Start Guide - Build & Deploy

## 🎯 Direct Answer to Your Question

**Q: When I build changes, will the Liferay changes build inside the Docker container?**

### ✅ **YES - COMPLETELY AUTOMATIC**

```
./gradlew build
    ↓
Gradle builds your modules
    ↓
JAR appears in ./deploy/
    ↓
Docker volume mount shares it
    ↓
Liferay auto-deploy loads it
    ↓
Module is LIVE in container
```

**THAT'S IT. NO EXTRA STEPS NEEDED.**

---

## 30-Second Setup

```powershell
# 1. Start container
docker-compose up -d

# 2. Build modules
cd backend
./gradlew build

# 3. Watch deployment
docker logs -f liferay-portal-ce

# 4. Access
# Open: http://localhost:8080
# Control Panel → Apps → See your module!
```

---

## How It Works (The Magic)

Your `docker-compose.yml` now has these volume mounts:

```yaml
volumes:
  - ./backend/deploy:/mnt/liferay/deploy         # ← KEY LINE
```

**What this means:**
- Folder `./backend/deploy/` on your computer
- Is the **same** as `/mnt/liferay/deploy/` inside container
- Liferay's auto-deploy service watches this folder 24/7
- When it sees a JAR file, it **automatically deploys it**

---

## The One-Page Workflow

| Step | Action | Location | Result |
|------|--------|----------|--------|
| 1 | Write code | `backend/modules/my-module/src/` | Code edited ✓ |
| 2 | Run build | `./gradlew build` | JAR created ✓ |
| 3 | Gradle output | `./deploy/my-module.jar` | File appears ✓ |
| 4 | Docker sees it | `/mnt/liferay/deploy/` | Via volume mount ✓ |
| 5 | Liferay loads | Auto-deploy service | Module activated ✓ |
| 6 | Access it | `http://localhost:8080` | Module is LIVE ✓ |

---

## Files That Changed

### 1. Root `docker-compose.yml`
**Added volume mounts:**
```yaml
- ./backend/deploy:/mnt/liferay/deploy
- ./backend/modules:/workspace/modules
- ./backend/themes:/workspace/themes
- ./backend/gradle.properties:/workspace/gradle.properties
- ./backend/build.gradle:/workspace/build.gradle
```

### 2. `backend/configs/docker/docker-compose.yml`
**Same mounts (relative paths)**
```yaml
- ../deploy:/mnt/liferay/deploy
- ../modules:/workspace/modules
- ../themes:/workspace/themes
```

### 3. New Documentation
- `SETUP_WORKFLOW.md` ← One-page config summary
- `DOCKER_BUILD_AND_DEPLOY.md` ← Detailed guide
- `QUICK_START.md` ← This file

---

## Essential Commands

```powershell
# START container
docker-compose up -d

# BUILD modules (auto-deploys)
cd backend
./gradlew build

# BUILD specific module
./gradlew :modules:my-module:build

# WATCH for changes and rebuild
./gradlew build -t

# MONITOR deployment
docker logs -f liferay-portal-ce

# STOP container
docker-compose down

# CHECK what was deployed
dir ./deploy
```

---

## Example: Your First Module

```powershell
# 1. Navigate to backend
cd C:\Users\diwak\OneDrive\Desktop\liferay-poc\backend

# 2. Create a test module
blade create -t mvc-portlet -p com.example my-app

# 3. Build it
./gradlew build

# 4. Check deploy folder
dir ./deploy
# Should see: com.example.my-app-1.0.0.jar ✓

# 5. Monitor
docker logs -f liferay-portal-ce
# Should see: Bundle installed and activated ✓

# 6. Visit
http://localhost:8080
# Go to: Control Panel → Apps
# Find your module listed ✓
```

---

## Why This Setup is Perfect

✅ **Automatic** - No manual copying needed  
✅ **Real-time** - Changes available immediately  
✅ **No restart** - Modules load without container restart  
✅ **Clean** - Code and build outputs stay organized  
✅ **Scalable** - Same process for 1 module or 100 modules  

---

## Troubleshooting

### Module not appearing?
```powershell
# 1. Check build succeeded
dir ./deploy
# Should see your JAR file

# 2. Check container is running
docker ps | findstr liferay
# Should show container

# 3. Check logs
docker logs liferay-portal-ce | findstr -i "deploy\|bundle"
```

### Build fails?
```powershell
# 1. Check Gradle
./gradlew --version

# 2. Clean and rebuild
./gradlew clean build

# 3. Check Java version
java -version
# Should be Java 8 or higher
```

---

## Architecture at a Glance

```
LOCAL MACHINE                    DOCKER CONTAINER
──────────────────────────────────────────────────

Code Edits
    ↓
./gradlew build
    ↓
./deploy/
my-module.jar ────────────→ /mnt/liferay/deploy/
                             ↓
                        Liferay Auto-Deploy
                             ↓
                        /opt/liferay/osgi/modules/
                             ↓
                        Module is ACTIVE ✓
                             ↓
                        http://localhost:8080
```

---

## Next Steps

1. ✅ **Docker is running** (already done)
2. ✅ **Backend workspace is set up** (already done)
3. ✅ **Volume mounts are configured** (already done)
4. **👉 Next: Create your first module**
   - `blade create -t mvc-portlet -p com.example my-first-app`
5. **👉 Then: Build it**
   - `./gradlew build`
6. **👉 Finally: Test it**
   - `http://localhost:8080` → Control Panel → Apps

---

## Key Takeaway

```
Every time you run: ./gradlew build
Your Liferay modules AUTOMATICALLY build AND deploy 
inside the Docker container.

No extra steps. 
No manual copying.
No container restarts.

Just build and done! 🚀
```

---

## Quick Reference

| Need to do | Command |
|-----------|---------|
| Start server | `docker-compose up -d` |
| Build all modules | `./gradlew build` (from backend/) |
| Build one module | `./gradlew :modules:name:build` |
| Watch & rebuild | `./gradlew build -t` |
| See deployment | `docker logs -f liferay-portal-ce` |
| Stop server | `docker-compose down` |
| Create module | `blade create -t mvc-portlet -p pkg name` |
| Access Liferay | `http://localhost:8080` |

---

**That's everything you need to know!** 

Your setup is complete. Start building your Liferay modules! 🎉
