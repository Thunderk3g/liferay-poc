# Liferay POC Setup and Development Guide

## Project Overview

This is a Liferay Portal 7.4 POC (Proof of Concept) with a React-based frontend application. The project is organized into:

- **Backend**: Liferay Portal workspace with Blade CLI scaffolding (Portal 7.4)
- **Frontend**: React/TypeScript/Vite application
- **Docker**: Containerized deployment using Docker Compose

## Quick Start

### 1. Prerequisites

- Docker and Docker Compose
- Node.js 18+ (for frontend development)
- Java 11+ (for backend development)
- PowerShell 5.1+ (on Windows)

### 2. Start the Backend (Liferay)

```powershell
.\docker-up.ps1
```

This will:
- Start Liferay Portal 7.4 container
- Create persistent volumes for data
- Expose Liferay at http://localhost:8080

Wait for startup to complete (5-10 minutes). Check logs:

```bash
cd backend/configs/docker
docker-compose logs -f liferay
```

### 3. Start the Frontend

In a new terminal:

```bash
cd frontend
npm install
npm run dev
```

Frontend will be available at http://localhost:3000

### 4. Access Applications

- **Liferay Portal**: http://localhost:8080
  - Email: test@example.com
  - Password: test (default, configure as needed)
  
- **Frontend App**: http://localhost:3000
  - Automatically configured to connect to Liferay API
  - See `FRONTEND_INTEGRATION.md` for details

## Project Structure

```
liferay-poc/
├── backend/
│   ├── configs/
│   │   ├── common/              # Common configuration
│   │   ├── dev/                 # Development config
│   │   ├── docker/              # Docker deployment config
│   │   ├── local/               # Local development config
│   │   ├── prod/                # Production config
│   │   └── uat/                 # UAT config
│   ├── modules/                 # Liferay OSGi modules (create here)
│   ├── themes/                  # Liferay themes
│   ├── deploy/                  # Hot-deploy folder for modules/themes
│   ├── gradle/                  # Gradle wrapper
│   ├── gradle.properties         # Gradle workspace config
│   ├── build.gradle              # Root build script
│   ├── settings.gradle           # Gradle settings
│   ├── platform.bndrun           # Liferay bundle configuration
│   ├── Dockerfile.ext            # Liferay Docker extension
│   └── GETTING_STARTED.markdown # Liferay workspace guide
│
├── frontend/
│   ├── src/
│   │   ├── components/          # React components
│   │   ├── hooks/               # Custom React hooks
│   │   ├── services/            # API services
│   │   ├── types/               # TypeScript types
│   │   ├── assets/              # Static assets
│   │   ├── App.tsx              # Main component
│   │   └── main.tsx             # Entry point
│   ├── public/                  # Public assets
│   ├── package.json             # Dependencies
│   ├── vite.config.ts           # Vite configuration
│   ├── tsconfig.json            # TypeScript configuration
│   └── README.md                # Frontend documentation
│
├── deploy/                      # Additional deployment resources
├── files/                       # Files mounted to Liferay container
├── docker-up.ps1                # Start Docker services
├── docker-down.ps1              # Stop Docker services
├── docker-compose.yml           # Root docker-compose reference
├── .env                         # Environment variables
├── .dockerignore                # Docker ignore rules
├── README.md                    # Main project documentation
├── FRONTEND_INTEGRATION.md      # Frontend integration guide
└── SETUP_GUIDE.md              # This file
```

## Development Workflow

### Backend Development (Liferay Modules)

#### Creating a New Module

Using Blade CLI:

```bash
cd backend
# List available templates
..\..\..\AppData\Local\liferay-blade\blade.bat samples --help

# Create a new module (e.g., MVC portlet)
..\..\..\AppData\Local\liferay-blade\blade.bat create -t mvc-portlet -p com.example.poc mymodule
```

#### Building Modules

```bash
cd backend
./gradlew build
```

#### Hot Deploying Modules

1. Build your module as JAR
2. Copy JAR to `backend/deploy/` directory
3. Liferay will automatically deploy it

Check container logs to verify deployment:

```bash
cd backend/configs/docker
docker-compose logs -f liferay | grep -i deploy
```

#### Liferay Workspace Structure

- **modules/**: OSGi modules and portlets
- **themes/**: Custom Liferay themes
- **deploy/**: Hot-deployment directory
- **configs/**: Environment-specific configuration
  - **common/**: Shared across all environments
  - **dev/**, **local/**, **prod/**, **uat/**: Environment-specific configs

### Frontend Development

See `FRONTEND_INTEGRATION.md` for detailed frontend development instructions.

Quick commands:

```bash
cd frontend

# Development server
npm run dev

# Build for production
npm run build

# Run linter
npm run lint

# Preview production build
npm run preview
```

## Docker Management

### View Running Containers

```bash
docker ps
```

### View Container Logs

```bash
cd backend/configs/docker
docker-compose logs -f liferay
```

### Stop and Remove All Services

```powershell
.\docker-down.ps1
```

Or manually:

```bash
cd backend/configs/docker
docker-compose down
```

### Clean Up Volumes (Reset Database)

```bash
cd backend/configs/docker
docker-compose down -v
docker-compose up -d
```

### Access Container Shell

```bash
docker exec -it liferay-portal-ce bash
```

## Configuration Management

### Environment-Specific Configurations

Configuration files are organized by environment:

- **common/**: Shared configuration for all environments
  - `portal-setup-wizard.properties`: Setup wizard configuration
  
- **dev/**: Development environment
  - `portal-ext.properties`: Development-specific settings
  
- **docker/**: Docker container configuration
  - `portal-ext.properties`: Docker-specific settings
  - `.env`: Docker Compose environment variables
  
- **prod/**: Production environment
  - `portal-ext.properties`: Production settings
  - `osgi/configs/`: OSGi configuration files
  
- **uat/**: UAT environment
  - Similar to production but for testing

### Modifying Configuration

1. Edit the appropriate `portal-ext.properties` file
2. Rebuild and restart the container:

```bash
cd backend/configs/docker
docker-compose down
docker-compose up -d
```

## Deployment Guide

### Local Development

```powershell
.\docker-up.ps1
```

### Docker Container Deployment

The project includes Docker support for containerized deployment. Configuration is in `backend/configs/docker/`.

### Adding Custom Configuration

1. Edit `backend/configs/docker/portal-ext.properties`
2. Restart container:

```bash
cd backend/configs/docker
docker-compose restart liferay
```

### Mounting Custom Files

To mount additional files in the container, edit `docker-compose.yml` volumes section:

```yaml
volumes:
  - ./your-directory:/mnt/liferay/your-directory
```

## Gradle Build System

### Build Workspace

```bash
cd backend
./gradlew build
```

### Build Specific Module

```bash
cd backend
./gradlew :modules:mymodule:build
```

### Clean Build

```bash
cd backend
./gradlew clean build
```

### View Gradle Tasks

```bash
cd backend
./gradlew tasks
```

## Troubleshooting

### Liferay Startup Issues

1. Check container logs:
   ```bash
   cd backend/configs/docker
   docker-compose logs liferay
   ```

2. Ensure ports aren't in use:
   ```bash
   netstat -ano | findstr :8080
   ```

3. Reset database:
   ```bash
   cd backend/configs/docker
   docker-compose down -v
   docker-compose up -d
   ```

### Frontend Connection Issues

1. Ensure Liferay is running and accessible:
   ```bash
   curl http://localhost:8080
   ```

2. Check proxy settings in `frontend/vite.config.ts`

3. Verify CORS configuration in `backend/configs/docker/portal-ext.properties`

### Module Deployment Issues

1. Check Gradle build output:
   ```bash
   cd backend
   ./gradlew build --info
   ```

2. Verify module JAR in `deploy/` directory

3. Check Liferay logs for deployment errors

### Docker Issues

1. Verify Docker is running:
   ```bash
   docker ps
   ```

2. Check Docker logs:
   ```bash
   cd backend/configs/docker
   docker-compose logs -f
   ```

3. Restart Docker services:
   ```bash
   cd backend/configs/docker
   docker-compose restart
   ```

## Performance Tuning

### JVM Options

Edit `.env` file in `backend/configs/docker/`:

```env
LIFERAY_JVM_OPTS=-Xmx2g -Xms1g -XX:+UseG1GC
```

### Database Performance

For production, configure external PostgreSQL or MySQL database in `portal-ext.properties`.

### Elasticsearch Integration

Configure Elasticsearch in production configuration at `backend/configs/prod/osgi/configs/`.

## Security Considerations

- [ ] Change default credentials (test@example.com / test)
- [ ] Enable HTTPS for production
- [ ] Configure firewall rules
- [ ] Set up SSL certificates
- [ ] Implement authentication (OAuth2/LDAP)
- [ ] Configure CORS properly
- [ ] Enable security headers
- [ ] Set up WAF (Web Application Firewall)
- [ ] Regular security updates

## Monitoring and Logging

### Access Liferay Logs

```bash
docker exec liferay-portal-ce tail -f /opt/liferay/logs/liferay.log
```

### View Docker Container Logs

```bash
cd backend/configs/docker
docker-compose logs -f liferay
```

### Performance Monitoring

Access Liferay Control Panel → System Settings for monitoring options.

## Additional Resources

- [Liferay Portal 7.4 Documentation](https://learn.liferay.com/7-4/en/installation-and-upgrades)
- [Blade CLI Documentation](https://learn.liferay.com/w/dxp/the-liferay-workspace)
- [Liferay Headless APIs](https://learn.liferay.com/w/dxp/headless-delivery-apis)
- [React Documentation](https://react.dev/)
- [Vite Documentation](https://vitejs.dev/)
- [Docker Documentation](https://docs.docker.com/)

## Support and Contribution

For issues, questions, or contributions:

1. Check existing documentation
2. Review container logs
3. Verify configuration files
4. Test with minimal configuration
5. Document findings for future reference

## Version Information

- **Liferay Portal**: 7.4.3.132-ga132
- **Blade CLI**: 7.0.2
- **Gradle**: 8.5
- **Node.js**: 18+
- **React**: 19.2.0
- **Vite**: 7.2.4
- **Docker**: Latest

## License

See LICENSE file for details.
