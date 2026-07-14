#!/bin/bash
# ===========================================
# JAKSELNEWS FULL DEPLOYMENT SCRIPT
# Run this ON YOUR VPS after copying files
# ===========================================

set -e

# Configuration
VPS_IP="31.97.106.177"
PROJECT_DIR="/var/www/jakselnews"
DOMAIN="jakselnews.com"
API_DOMAIN="api.jakselnews.com"

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m'

echo -e "${CYAN}╔════════════════════════════════════════════════════════╗${NC}"
echo -e "${CYAN}║                                                        ║${NC}"
echo -e "${CYAN}║      🚀 JAKSELNEWS FULL DEPLOYMENT SCRIPT 🚀         ║${NC}"
echo -e "${CYAN}║                                                        ║${NC}"
echo -e "${CYAN}╚════════════════════════════════════════════════════════╝${NC}"

# ===========================================
# CHECK: Running as root?
# ===========================================
if [ "$EUID" -ne 0 ]; then
  echo -e "${RED}❌ Please run as root: sudo bash deploy-full.sh${NC}"
  exit 1
fi

echo -e "\n${BLUE}[1/8] Checking system...${NC}"
echo "   OS: $(uname -s)"
echo "   User: $(whoami)"
echo "   Date: $(date)"

# ===========================================
# UPDATE SYSTEM
# ===========================================
echo -e "\n${BLUE}[2/8] Updating system packages...${NC}"
apt update -qq
apt upgrade -y -qq

# ===========================================
# INSTALL DOCKER
# ===========================================
echo -e "\n${BLUE}[3/8] Installing Docker...${NC}"

if ! command -v docker &> /dev/null; then
  echo "   Installing Docker..."
  curl -fsSL https://get.docker.com -o /tmp/get-docker.sh
  sh /tmp/get-docker.sh
  rm /tmp/get-docker.sh

  # Enable Docker
  systemctl start docker
  systemctl enable docker

  # Add docker group
  groupadd -f docker
  usermod -aG docker root

  echo -e "   ${GREEN}✓ Docker installed${NC}"
else
  echo -e "   ${GREEN}✓ Docker already installed${NC}"
fi

# ===========================================
# INSTALL DEPENDENCIES
# ===========================================
echo -e "\n${BLUE}[4/8] Installing additional dependencies...${NC}"
apt install -y -qq curl wget git ufw nginx certbot python3-certbot-nginx rsync

# ===========================================
# SETUP PROJECT DIRECTORY
# ===========================================
echo -e "\n${BLUE}[5/8] Setting up project directory...${NC}"

mkdir -p $PROJECT_DIR
mkdir -p $PROJECT_DIR/nginx/ssl

# Check if project files exist
if [ ! -f "$PROJECT_DIR/package.json" ]; then
  echo -e "   ${YELLOW}⚠️  Project files not found in $PROJECT_DIR${NC}"
  echo -e "   ${YELLOW}   Please copy files first, or this deployment will fail!${NC}"
  echo ""
  echo -e "   To copy files from your local machine:${NC}"
  echo -e "   ${CYAN}   rsync -avz --exclude='node_modules' \\${NC}"
  echo -e "   ${CYAN}     ~/Documents/Jakselnews.com/jakselnews-app/ \\${NC}"
  echo -e "   ${CYAN}     root@$VPS_IP:$PROJECT_DIR/${NC}"
  echo ""
  read -p "Continue anyway? (y/n) " -n 1 -r
  echo
  if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    exit 1
  fi
fi

# ===========================================
# CREATE ENVIRONMENT FILE
# ===========================================
echo -e "\n${BLUE}[6/8] Creating environment configuration...${NC}"

cat > $PROJECT_DIR/.env.production << 'EOF'
# ===========================================
# JAKSELNEWS PRODUCTION ENVIRONMENT
# ===========================================

# Server Configuration
NODE_ENV=production
PORT=5000

# Supabase Configuration
SUPABASE_URL=https://eqoyvbeusopskzacoowz.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVxb3l2YmV1c29wc2t6YWNvb3d6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE0OTI4NjksImV4cCI6MjA5NzA2ODg2OX0.Dx3Oy6WzMD_vEevmER2qdFonzqWNUlEXbMwT6D4HGlM
SUPABASE_SERVICE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVxb3l2YmV1c29wc2t6YWNvb3d6Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MTQ5Mjg2OSwiZXhwIjoyMDk3MDY4ODY5fQ.1jVvAUIrmrnmVRq8KGhZ2M6j81uFeOARo9sIGBR6c7Q

# JWT Configuration - CRITICAL: CHANGE THIS!
JWT_SECRET=jakselnews_production_secret_key_$(openssl rand -hex 32)

# WordPress Configuration
WORDPRESS_URL=https://jakselnews.com
WORDPRESS_API_URL=https://jakselnews.com/wp-json/wp/v2

# CORS Configuration
CORS_ORIGIN=https://jakselnews.com,https://www.jakselnews.com

# Rate Limiting
RATE_LIMIT_PUBLIC_WINDOW_MS=60000
RATE_LIMIT_PUBLIC_MAX=100
RATE_LIMIT_AUTH_WINDOW_MS=900000
RATE_LIMIT_AUTH_MAX=5
RATE_LIMIT_REPORTS_WINDOW_MS=60000
RATE_LIMIT_REPORTS_MAX=10

# Logging
LOG_LEVEL=info
EOF

echo -e "   ${GREEN}✓ Environment file created${NC}"
echo -e "   ${YELLOW}   JWT_SECRET has been auto-generated${NC}"

# ===========================================
# BUILD AND START DOCKER
# ===========================================
echo -e "\n${BLUE}[7/8] Building and starting Docker containers...${NC}"

cd $PROJECT_DIR

# Build Docker image
echo "   Building Docker image (this may take a few minutes)..."
docker build -t jakselnews-api:latest . 2>&1 | tail -5

# Stop old containers if running
docker stop jakselnews-api 2>/dev/null || true
docker rm jakselnews-api 2>/dev/null || true

# Run container
echo "   Starting container..."
docker run -d \
  --name jakselnews-api \
  --restart unless-stopped \
  --env-file $PROJECT_DIR/.env.production \
  -p 5000:5000 \
  -v ${PROJECT_DIR}:/app \
  jakselnews-api:latest

# Wait for startup
echo "   Waiting for API to start..."
sleep 5

# Check status
if docker ps | grep -q jakselnews-api; then
  echo -e "   ${GREEN}✓ Container is running!${NC}"
else
  echo -e "   ${RED}❌ Container failed to start${NC}"
  echo "   Check logs with: docker logs jakselnews-api"
fi

# ===========================================
# SETUP NGINX
# ===========================================
echo -e "\n${BLUE}[8/8] Setting up Nginx reverse proxy...${NC}"

# Create Nginx config
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

        # Timeouts
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }
}
EOF

# Enable site
ln -sf /etc/nginx/sites-available/jakselnews-api /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default

# Test and reload nginx
nginx -t && systemctl reload nginx
echo -e "   ${GREEN}✓ Nginx configured${NC}"

# ===========================================
# FIREWALL
# ===========================================
echo -e "\n${BLUE}[BONUS] Configuring firewall...${NC}"
ufw allow ssh
ufw allow http
ufw allow https
ufw --force enable
echo -e "   ${GREEN}✓ Firewall enabled (SSH, HTTP, HTTPS allowed)${NC}"

# ===========================================
# FINAL STATUS
# ===========================================
echo -e "\n${GREEN}╔════════════════════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║                                                        ║${NC}"
echo -e "${GREEN}║      ✅ DEPLOYMENT COMPLETE!                          ║${NC}"
echo -e "${GREEN}║                                                        ║${NC}"
echo -e "${GREEN}╚════════════════════════════════════════════════════════╝${NC}"

echo -e "\n${CYAN}📊 API Status:${NC}"
docker ps | grep jakselnews-api

echo -e "\n${CYAN}🔗 API Endpoints:${NC}"
echo -e "   Health:     http://$VPS_IP:5000/api/health"
echo -e "   API:        http://$VPS_IP:5000/api"
echo -e "   (after DNS) http://$API_DOMAIN/api"

echo -e "\n${CYAN}📝 Useful Commands:${NC}"
echo -e "   View logs:     docker logs -f jakselnews-api"
echo -e "   Restart API:   docker restart jakselnews-api"
echo -e "   Stop API:      docker stop jakselnews-api"
echo -e "   Shell into:    docker exec -it jakselnews-api sh"

echo -e "\n${YELLOW}⚠️  NEXT STEPS:${NC}"
echo -e "1. Point DNS A record 'api.$DOMAIN' to $VPS_IP"
echo -e "2. Setup SSL: certbot --nginx -d $API_DOMAIN"
echo -e "3. Test the API: curl http://$VPS_IP:5000/api/health"

echo -e "\n${GREEN}🎉 Happy coding!${NC}\n"
