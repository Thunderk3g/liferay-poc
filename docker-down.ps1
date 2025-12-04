# Docker Compose Down Script for Liferay POC
# Stops and removes the Liferay container and all services

$BackendDir = Join-Path $PSScriptRoot "backend"
$DockerConfigDir = Join-Path $BackendDir "configs" "docker"

if (!(Test-Path $DockerConfigDir)) {
    Write-Host "Error: Docker config directory not found at $DockerConfigDir"
    exit 1
}

Write-Host "Stopping Liferay POC services..."

# Navigate to docker config directory and stop containers
Set-Location $DockerConfigDir
docker-compose down

if ($LASTEXITCODE -eq 0) {
    Write-Host "Liferay POC services stopped successfully!"
} else {
    Write-Host "Error: Failed to stop services"
    exit 1
}
