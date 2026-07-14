#!/bin/bash
# ===========================================
# Jakselnews VPS Deployment Script
# For Hostinger VPS with Docker
# ===========================================

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE} Jakselnews VPS Deployment Script${NC}"
echo -e "${BLUE}========================================${NC}"

# Check if running as root
if [ "$EUID" -ne 0 ]; then
  echo -e "${RED}Please run as root (sudo)${NC}"
  exit 1
fi

# Get script directory
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"

echo -e "${YELLOW}Project directory: $PROJECT_DIR${NC}"

# ===========================================
# Step 1: Install Docker if not installed
# ===========================================
echo -e "\n${BLUE}[1/6] Checking Docker installation...${NC}"

if ! command -v docker &> /dev/null; then
  echo -e "${YELLOW}Docker not found. Installing...${NC}"
  curl -fsSL https://get.docker.com -o get-docker.sh
  sh get-docker.sh
  rm get-docker.sh
  systemctl start docker
  systemctl enable docker
  echo -e "${GREEN}Docker installed successfully!${NC}"
else
  echo -e "${GREEN}Docker is already installed${NC}"
fi

# Install docker-compose if not installed
if ! command -v docker-compose &> /dev/null; then
  echo -e "${YELLOW}Installing docker-compose...${NC}"
  curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
  chmod +x /usr/local/bin/docker-compose
  echo -e "${GREEN}docker-compose installed${NC}"
fi

# Add current user to docker group
usermod -aG docker $SUDO_USER 2>/dev/null || true

# ===========================================
# Step 2: Install Nginx if not installed
# ===========================================
echo -e "\n${BLUE}[2/6] Checking Nginx installation...${NC}"

if ! command -v nginx &> /dev/null; then
  echo -e "${YELLOW}Installing Nginx...${NC}"
  apt update && apt install -y nginx
  systemctl start nginx
  systemctl enable nginx
  echo -e "${GREEN}Nginx installed successfully!${NC}"
else
  echo -e "${GREEN}Nginx is already installed${NC}"
fi

# ===========================================
# Step 3: Setup Firewall (UFW)
# ===========================================
echo -e "\n${BLUE}[3/6] Setting up firewall...${NC}"

if command -v ufw &> /dev/null; then
  ufw --force enable
  ufw allow ssh
  ufw allow http
  ufw allow https
  echo -e "${GREEN}Firewall configured${NC}"
fi

# ===========================================
# Step 4: Create deployment directory
# ===========================================
echo -e "\n${BLUE}[4/6] Preparing deployment directory...${NC}"

DEPLOY_DIR="/var/www/jakselnews"
mkdir -p $DEPLOY_DIR

# Copy project files (exclude node_modules, .next, .git)
echo -e "${YELLOW}Copying project files...${NC}"
rsync -av --exclude='node_modules' --exclude='.next' --exclude='.git' --exclude='.env*' --exclude='dist' $PROJECT_DIR/ $DEPLOY_DIR/

# ===========================================
# Step 5: Setup Environment
# ===========================================
echo -e "\n${BLUE}[5/6] Setting up environment...${NC}"

# Create production env file if not exists
if [ ! -f "$DEPLOY_DIR/.env.production" ]; then
  echo -e "${YELLOW}Creating .env.production...${NC}"
  cat > $DEPLOY_DIR/.env.production << 'EOF'
# Server Configuration
PORT=5000
NODE_ENV=production

# Supabase Configuration
SUPABASE_URL=https://eqoyvbeusopskzacoowz.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVxb3l2YmV1c29wc2t6YWNvb3d6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE0OTI4NjksImV4cCI6MjA5NzA2ODg2OX0.Dx3Oy6WzMD_vEevmER2qdFonzqWNUlEXbMwT6D4HGlM
SUPABASE_SERVICE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVxb3l2YmV1c29wc2t6YWNvb3d6Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MTQ5Mjg2OSwiZXhwIjoyMDk3MDY4ODY5fQ.1jVvAUIrmrnmVRq8KGhZ2M6j81uFeOARo9sIGBR6c7Q

# JWT Configuration - CHANGE THIS!
JWT_SECRET=CHANGE_THIS_TO_A_VERY_LONG_RANDOM_SECRET_KEY

# WordPress Configuration
WORDPRESS_URL=https://jakselnews.com
WORDPRESS_API_URL=https://jakselnews.com/wp-json/wp/v2

# CORS Configuration
CORS_ORIGIN=https://jakselnews.com,https://www.jakselnews.com
EOF
  echo -e "${YELLOW}Please edit $DEPLOY_DIR/.env.production and set a secure JWT_SECRET!${NC}"
fi

# ===========================================
# Step 6: Build and Start Docker
# ===========================================
echo -e "\n${BLUE}[6/6] Building and starting Docker containers...${NC}"

cd $DEPLOY_DIR

# Build Docker image
echo -e "${YELLOW}Building Docker image...${NC}"
docker build -t jakselnews-api .

# Stop existing containers
docker-compose -f docker-compose.yml down 2>/dev/null || true

# Start containers
echo -e "${YELLOW}Starting containers...${NC}"
docker-compose -f docker-compose.yml up -d

# Wait for container to start
echo -e "${YELLOW}Waiting for API to start...${NC}"
sleep 10

# Check status
if docker ps | grep -q jakselnews-api; then
  echo -e "${GREEN}Container is running!${NC}"
else
  echo -e "${RED}Container failed to start. Check logs with: docker-compose logs${NC}"
fi

# ===========================================
# Setup Nginx Reverse Proxy
# ===========================================
echo -e "\n${BLUE}Setting up Nginx reverse proxy...${NC}"

cat > /etc/nginx/sites-available/jakselnews-api << 'EOF'
server {
    listen 80;
    server_name api.jakselnews.com;

    location / {
        proxy_pass http://127.0.0.1:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
EOF

# Enable site
ln -sf /etc/nginx/sites-available/jakselnews-api /etc/nginx/sites-enabled/

# Test nginx config
nginx -t

# Reload nginx
systemctl reload nginx

# ===========================================
# Final Message
# ===========================================
echo -e "\n${GREEN}========================================${NC}"
echo -e "${GREEN} Deployment Complete!${NC}"
echo -e "${GREEN}========================================${NC}"
echo -e "\n${YELLOW}API URL: http://31.97.106.177:5000/api${NC}"
echo -e "${YELLOW}API Domain: http://api.jakselnews.com (after DNS)${NC}"
echo -e "\n${BLUE}Useful Commands:${NC}"
echo -e "  View logs:    docker-compose -f $DEPLOY_DIR/docker-compose.yml logs -f"
echo -e "  Stop:        docker-compose -f $DEPLOY_DIR/docker-compose.yml down"
echo -e "  Restart:     docker-compose -f $DEPLOY_DIR/docker-compose.yml restart"
echo -e "  Shell into:  docker exec -it jakselnews-api sh"
echo -e "\n${RED}IMPORTANT: Edit $DEPLOY_DIR/.env.production and set JWT_SECRET!${NC}"
