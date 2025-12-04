# Docker Deployment Configuration

This directory contains the Docker configuration for the Liferay POC deployment.

## Directory Structure

```
backend/
├── configs/
│   ├── docker/              # Docker deployment configuration
│   │   ├── docker-compose.yml
│   │   ├── .dockerignore
│   │   ├── .env
│   │   └── portal-ext.properties
│   ├── common/              # Common configuration
│   ├── dev/                 # Development configuration
│   ├── local/               # Local development configuration
│   ├── prod/                # Production configuration
│   └── uat/                 # UAT configuration
├── modules/                 # Liferay modules
├── themes/                  # Liferay themes
├── deploy/                  # Module deployment folder (hot-deploy)
├── files/                   # Additional files to be mounted
├── docker-compose.yml       # Root docker-compose reference (symlink recommended)
└── ...
```

## Usage

### Starting Services

From the project root directory:

```powershell
.\docker-up.ps1
```

Or manually from `backend/configs/docker`:

```bash
cd backend/configs/docker
docker-compose up -d
```

### Stopping Services

From the project root directory:

```powershell
.\docker-down.ps1
```

Or manually from `backend/configs/docker`:

```bash
cd backend/configs/docker
docker-compose down
```

### Viewing Logs

```bash
cd backend/configs/docker
docker-compose logs -f liferay
```

## Environment Variables

The `.env` file contains the following configuration:

- `LIFERAY_VERSION`: The Liferay Portal image version (default: 7.4.3.132-ga132)
- `LIFERAY_CONTAINER_NAME`: Container name (default: liferay-portal-ce)
- `LIFERAY_HOST_PORT`: Host port mapping (default: 8080)
- `LIFERAY_JVM_OPTS`: JVM options for Liferay

## Volumes

The docker-compose configuration creates the following volumes:

- `liferay-data`: Persists Liferay data and embedded HSQL database
- `liferay-osgi-configs`: OSGi configuration persistence
- `liferay-osgi-marketplace`: OSGi marketplace data
- `liferay-osgi-modules`: OSGi modules
- `liferay-osgi-war`: OSGi WAR files

## Hot Deployment

The `../../deploy` directory is mounted to `/mnt/liferay/deploy` in the container. Any `.jar` or `.war` files placed in this directory will be automatically deployed to Liferay.

## Configuration Files

### portal-ext.properties

The `portal-ext.properties` file in this directory contains Liferay-specific configuration. It's mounted at startup to customize the Liferay Portal instance.

Common configurations:
- Database settings
- LDAP/SSO configuration
- Portal properties
- Search engine configuration (Elasticsearch)

## Integration with Frontend

The frontend application is located in the root `frontend/` directory. It can be integrated with the Liferay deployment by:

1. Building the frontend assets
2. Deploying them as a Liferay theme or portlet
3. Configuring the frontend to connect to the Liferay API

See the main README for frontend integration details.

## Production Considerations

For production deployment:

1. Use production configuration from `configs/prod/`
2. Configure external database instead of embedded HSQL
3. Set up SSL/TLS with proper certificates
4. Configure security groups and network policies
5. Use production-grade search engine (Elasticsearch/OpenSearch)
6. Set up backup and recovery procedures
7. Configure proper logging and monitoring

## Troubleshooting

### Container fails to start

Check the logs:
```bash
docker-compose logs liferay
```

### Port already in use

Change the port in `.env`:
```
LIFERAY_HOST_PORT=8081
```

### Database issues

The default configuration uses embedded HSQL. For a fresh start, remove the volumes:
```bash
docker-compose down -v
docker-compose up -d
```

### Permission issues

Ensure the `deploy` and `files` directories are readable by the container.
