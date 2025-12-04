# Build Liferay Modules Inside Docker Container
# No external dependencies needed - everything happens in Docker

param(
    [string]$Task = "build",
    [switch]$Clean = $false
)

$BackendDir = Join-Path $PSScriptRoot "backend"
$DockerConfigDir = Join-Path $BackendDir "configs" "docker"

if (!(Test-Path $DockerConfigDir)) {
    Write-Host "Error: Docker config directory not found at $DockerConfigDir"
    exit 1
}

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Building Liferay Modules Inside Docker" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Determine gradle command
$GradleCmd = if ($Clean) { "clean build" } else { $Task }

Write-Host "Build Command: ./gradlew $GradleCmd" -ForegroundColor Yellow
Write-Host "Location: Inside docker container" -ForegroundColor Yellow
Write-Host ""

# Change to docker config directory
Set-Location $DockerConfigDir

# Run gradle inside docker using docker-compose exec
Write-Host "Starting Docker build service..." -ForegroundColor Green

# First ensure services are running
Write-Host "Checking if Docker services are running..."
docker-compose ps gradle-builder > $null 2>&1

if ($LASTEXITCODE -ne 0) {
    Write-Host "Starting Docker services..." -ForegroundColor Yellow
    docker-compose up -d gradle-builder liferay
    
    # Wait for services to be ready
    Write-Host "Waiting for services to be ready (30 seconds)..." -ForegroundColor Yellow
    Start-Sleep -Seconds 30
}

# Run gradle build inside Docker
Write-Host "Running Gradle build inside Docker container..." -ForegroundColor Green
Write-Host ""

docker-compose run --rm gradle-builder gradle $GradleCmd

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "========================================" -ForegroundColor Green
    Write-Host "✓ Build completed successfully!" -ForegroundColor Green
    Write-Host "========================================" -ForegroundColor Green
    Write-Host ""
    Write-Host "Built artifacts are ready for deployment:" -ForegroundColor Yellow
    Write-Host "  Location: ./backend/deploy/" -ForegroundColor White
    Write-Host ""
    Write-Host "Modules will auto-deploy to Liferay within minutes." -ForegroundColor Cyan
    Write-Host "Check status: docker logs -f liferay-portal-ce" -ForegroundColor Yellow
} else {
    Write-Host ""
    Write-Host "========================================" -ForegroundColor Red
    Write-Host "✗ Build failed!" -ForegroundColor Red
    Write-Host "========================================" -ForegroundColor Red
    Write-Host ""
    Write-Host "Check logs for details:" -ForegroundColor Yellow
    Write-Host "  docker-compose logs gradle-builder" -ForegroundColor White
    exit 1
}
