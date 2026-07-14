#!/bin/bash
# ===========================================
# Jakselnews VPS Initial Setup Script
# Run this ONCE on a fresh VPS
# ===========================================

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE} Jakselnews VPS Initial Setup${NC}"
echo -e "${BLUE}========================================${NC}"

# Check if running as root
if [ "$EUID" -ne 0 ]; then
  echo -e "${RED}Please run as root (sudo bash setup-vps.sh)${NC}"
  exit 1
fi

# ===========================================
# Update System
# ===========================================
echo -e "\n${YELLOW}Updating system packages...${NC}"
apt update && apt upgrade -y

# ===========================================
# Install Essential Packages
# ===========================================
echo -e "\n${YELLOW}Installing essential packages...${NC}"
apt install -y \
    curl \
    wget \
    git \
    ufw \
    fail2ban \
    unzip \
    software-properties-common \
    apt-transport-https \
    ca-certificates \
    gnupg \
    lsb-release

# ===========================================
# Setup SSH (Hardening)
# ===========================================
echo -e "\n${YELLOW}Configuring SSH...${NC}"
# Backup original sshd_config
cp /etc/ssh/sshd_config /etc/ssh/sshd_config.backup

# Disable root login
sed -i 's/^PermitRootLogin.*/PermitRootLogin no/' /etc/ssh/sshd_config

# Disable password authentication (use SSH keys instead)
sed -i 's/^PasswordAuthentication.*/PasswordAuthentication no/' /etc/ssh/sshd_config

# Restart SSH
systemctl restart sshd

# ===========================================
# Setup Firewall
# ===========================================
echo -e "\n${YELLOW}Setting up firewall...${NC}"
ufw default deny incoming
ufw default allow outgoing
ufw allow ssh
ufw allow http
ufw allow https
ufw --force enable

# ===========================================
# Install Docker
# ===========================================
echo -e "\n${YELLOW}Installing Docker...${NC}"

# Remove old Docker versions if any
apt remove -y docker docker-engine docker.io containerd runc 2>/dev/null || true

# Install Docker
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg

echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | tee /etc/apt/sources.list.d/docker.list > /dev/null

apt update
apt install -y docker-ce docker-ce-cli containerd.io docker-compose-plugin

# Enable Docker
systemctl start docker
systemctl enable docker

# Add docker group
groupadd -f docker
usermod -aG docker $SUDO_USER

# ===========================================
# Setup Docker Daemon
# ===========================================
echo -e "\n${YELLOW}Configuring Docker...${NC}"
mkdir -p /etc/docker
cat > /etc/docker/daemon.json << 'EOF'
{
  "log-driver": "json-file",
  "log-opts": {
    "max-size": "10m",
    "max-file": "3"
  },
  "storage-driver": "overlay2"
}
EOF

systemctl restart docker

# ===========================================
# Install Nginx
# ===========================================
echo -e "\n${YELLOW}Installing Nginx...${NC}"
apt install -y nginx
systemctl start nginx
systemctl enable nginx

# ===========================================
# Install Certbot (SSL)
# ===========================================
echo -e "\n${YELLOW}Installing Certbot for SSL...${NC}"
snap install --classic certbot
ln -sf /snap/bin/certbot /usr/bin/certbot

# ===========================================
# Setup Fail2Ban
# ===========================================
echo -e "\n${YELLOW}Configuring Fail2Ban...${NC}"
cat > /etc/fail2ban/jail.local << 'EOF'
[DEFAULT]
bantime = 3600
findtime = 600
maxretry = 5

[sshd]
enabled = true
port = ssh
filter = sshd
logpath = /var/log/auth.log
maxretry = 3
EOF

systemctl enable fail2ban
systemctl start fail2ban

# ===========================================
# Create Deployment Directory
# ===========================================
echo -e "\n${YELLOW}Creating deployment directory...${NC}"
mkdir -p /var/www/jakselnews
chown -R $SUDO_USER:$SUDO_USER /var/www/jakselnews

# ===========================================
# Final Message
# ===========================================
echo -e "\n${GREEN}========================================${NC}"
echo -e "${GREEN} Initial VPS Setup Complete!${NC}"
echo -e "${GREEN}========================================${NC}"
echo -e "\n${YELLOW}Next Steps:${NC}"
echo -e "1. Copy project files to /var/www/jakselnews"
echo -e "2. Run: cd /var/www/jakselnews && bash scripts/deploy-vps.sh"
echo -e "3. Set up SSL: certbot --nginx -d api.jakselnews.com"
echo -e "\n${RED}IMPORTANT:${NC}"
echo -e "- Add your SSH public key to ~/.ssh/authorized_keys"
echo -e "- Edit /var/www/jakselnews/.env.production with secure JWT_SECRET"
echo -e "- Configure DNS A record for api.jakselnews.com -> VPS IP"
