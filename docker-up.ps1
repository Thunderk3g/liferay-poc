# Docker Compose Up Script for Liferay POC
# Starts the Liferay container and all required services

$BackendDir = Join-Path $PSScriptRoot "backend"
$DockerConfigDir = Join-Path $BackendDir "configs" "docker"

if (!(Test-Path $DockerConfigDir)) {
    Write-Host "Error: Docker config directory not found at $DockerConfigDir"
    exit 1
}

Write-Host "Starting Liferay POC services..."
Write-Host "Docker config directory: $DockerConfigDir"

# Navigate to docker config directory and start containers
Set-Location $DockerConfigDir
docker-compose up -d

if ($LASTEXITCODE -eq 0) {
    Write-Host "Liferay POC services started successfully!"
    Write-Host ""
    Write-Host "Access Liferay at: http://localhost:8080"
    Write-Host "Default credentials: test@example.com / test"
    Write-Host ""
    Write-Host "To view logs: docker-compose logs -f"
    Write-Host "To stop services: docker-compose down"
} else {
    Write-Host "Error: Failed to start services"
    exit 1
}
