#!/bin/bash
# Seed initial content into Liferay for demonstration
# This script creates sample structured content articles

LIFERAY_URL="${LIFERAY_URL:-http://localhost:8080}"
EMAIL="${LIFERAY_EMAIL:-test@liferay.com}"
PASSWORD="${LIFERAY_PASSWORD:-test}"
SITE_ID="${SITE_ID:-20124}"

# Function to create content
create_content() {
    local title="$1"
    local description="$2"
    local content="$3"
    local image_url="$4"
    local link="$5"
    local link_text="$6"

    echo "Creating content: $title..."

    # Create structured content via API
    curl -X POST \
        -u "$EMAIL:$PASSWORD" \
        -H "Content-Type: application/json" \
        -d "{
            \"title\": \"$title\",
            \"description\": \"$description\",
            \"contentFields\": [
                {
                    \"name\": \"content\",
                    \"label\": \"content\",
                    \"value\": \"$content\"
                }
                $([ -n "$image_url" ] && echo ",{\"name\": \"imageUrl\", \"label\": \"imageUrl\", \"value\": \"$image_url\"}")
                $([ -n "$link" ] && echo ",{\"name\": \"link\", \"label\": \"link\", \"value\": \"$link\"}")
                $([ -n "$link_text" ] && echo ",{\"name\": \"linkText\", \"label\": \"linkText\", \"value\": \"$link_text\"}")
            ]
        }" \
        "$LIFERAY_URL/o/headless-delivery/v1.0/sites/$SITE_ID/structured-contents"
}

echo "=========================================="
echo "Liferay Content Seeder"
echo "=========================================="
echo "URL: $LIFERAY_URL"
echo "Site ID: $SITE_ID"
echo ""

# Wait for Liferay to be ready
echo "Waiting for Liferay to be ready..."
for i in {1..30}; do
    if curl -s -u "$EMAIL:$PASSWORD" "$LIFERAY_URL" > /dev/null 2>&1; then
        echo "✓ Liferay is ready!"
        break
    fi
    echo "Attempt $i/30... waiting..."
    sleep 10
done

# Create sample content
echo ""
echo "Creating sample content..."
echo ""

create_content \
    "Home" \
    "Welcome to our content hub" \
    "This is the home page of our Liferay-powered application. All content is managed through the Liferay CMS and automatically synced to the frontend in real-time. No code changes needed!" \
    "https://via.placeholder.com/800x400?text=Home" \
    "https://liferay.com" \
    "Learn More"

sleep 2

create_content \
    "About" \
    "Learn about our organization" \
    "We are building a modern content management platform powered by Liferay Portal. Our approach combines the power of Liferay's enterprise CMS with React-based frontend for optimal user experience." \
    "https://via.placeholder.com/800x400?text=About" \
    "" \
    ""

sleep 2

create_content \
    "Features" \
    "What makes us different" \
    "✓ 100% Content-Managed by Liferay
✓ Real-Time Frontend Updates
✓ Docker-Based Deployment
✓ No External Dependencies
✓ Enterprise-Grade CMS
✓ Headless API Architecture

All pages and content are managed entirely through Liferay, making it easy for non-technical users to update website content." \
    "https://via.placeholder.com/800x400?text=Features" \
    "" \
    ""

sleep 2

create_content \
    "Technology" \
    "Our tech stack" \
    "Frontend: React 19 + TypeScript + Vite + Tailwind CSS
Backend: Liferay Portal 7.4
API: Liferay Headless Delivery REST API
Infrastructure: Docker & Docker Compose
Build: Gradle (inside Docker)

This architecture ensures zero external dependencies and complete control over your content." \
    "https://via.placeholder.com/800x400?text=Technology" \
    "" \
    ""

echo ""
echo "=========================================="
echo "✓ Content seeding complete!"
echo "=========================================="
echo ""
echo "Next steps:"
echo "1. Visit http://localhost:3000 in your browser"
echo "2. You should see the seeded content displayed"
echo "3. To add more content, go to http://localhost:8080"
echo "   (Email: test@liferay.com, Password: test)"
echo ""
echo "The frontend will automatically sync with any new content you create!"
echo ""
