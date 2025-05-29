# BrightPair AI Tutor - Deployment Guide

This guide walks through deploying the BrightPair AI Tutor application to
production.

## Table of Contents

1. [Pre-Deployment Checklist](#pre-deployment-checklist)
2. [Environment Setup](#environment-setup)
3. [Database Setup](#database-setup)
4. [Deployment Options](#deployment-options)
5. [Post-Deployment](#post-deployment)
6. [Monitoring & Maintenance](#monitoring--maintenance)

## Pre-Deployment Checklist

Before deploying, ensure:

- [ ] All tests are passing (`npm test`)
- [ ] Build completes successfully (`npm run build`)
- [ ] Environment variables are configured (`npm run check:env`)
- [ ] Database migrations are up to date
- [ ] Security audit passes (`npm audit`)
- [ ] SSL certificates are ready
- [ ] Domain/subdomain is configured
- [ ] Backup strategy is in place

## Environment Setup

### 1. Create Production Environment File

Create `.env.production` with all required variables:

```bash
# Core Configuration
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
VITE_APP_URL=https://app.brightpair.com
VITE_APP_ENV=production

# AI Configuration
VITE_OPENAI_API_KEY=sk-proj-...
VITE_AI_MODEL=gpt-4
VITE_AI_MAX_TOKENS=1000
VITE_AI_TEMPERATURE=0.7

# Error Tracking
VITE_SENTRY_DSN=https://...@sentry.io/...
VITE_SENTRY_ENVIRONMENT=production

# Security
VITE_JWT_SECRET=your-secret-key
VITE_ENCRYPTION_KEY=your-encryption-key
VITE_ALLOWED_ORIGINS=https://app.brightpair.com
VITE_SESSION_DURATION=30

# Performance
VITE_ENABLE_PWA=true
VITE_CDN_URL=https://cdn.brightpair.com
VITE_API_TIMEOUT=30000
```

### 2. Validate Environment

```bash
npm run check:env
```

This will verify all required variables are set correctly.

## Database Setup

### 1. Create Production Database

If using Supabase:

```bash
# Login to Supabase CLI
npx supabase login

# Link to your project
npx supabase link --project-ref your-project-ref

# Push database schema
npx supabase db push
```

### 2. Run Migrations

```bash
# Apply all migrations
npx supabase migration up

# Verify migrations
npx supabase migration list
```

### 3. Set Up Database Backups

Configure automated backups in Supabase dashboard:

- Navigate to Settings → Backups
- Enable daily backups
- Set retention period (recommended: 30 days)
- Test restore process

### 4. Configure Connection Pooling

For high traffic, enable connection pooling:

- Use Supabase connection pooler endpoint
- Update `VITE_SUPABASE_URL` to pooler URL
- Configure pool size based on expected load

## Deployment Options

### Option 1: Vercel (Recommended)

#### Setup

1. Install Vercel CLI:

```bash
npm i -g vercel
```

2. Login to Vercel:

```bash
vercel login
```

3. Configure project:

```bash
vercel
```

4. Set environment variables:

```bash
vercel env add VITE_SUPABASE_URL
vercel env add VITE_SUPABASE_ANON_KEY
# Add all other required variables
```

#### Deploy

```bash
# Production deployment
vercel --prod

# Preview deployment
vercel
```

#### Configuration

Create `vercel.json`:

```json
{
    "buildCommand": "npm run build",
    "outputDirectory": "dist",
    "framework": "vite",
    "rewrites": [
        { "source": "/(.*)", "destination": "/" }
    ],
    "headers": [
        {
            "source": "/api/(.*)",
            "headers": [
                { "key": "Cache-Control", "value": "s-maxage=60" }
            ]
        },
        {
            "source": "/assets/(.*)",
            "headers": [
                {
                    "key": "Cache-Control",
                    "value": "max-age=31536000, immutable"
                }
            ]
        }
    ]
}
```

### Option 2: Netlify

#### Setup

1. Install Netlify CLI:

```bash
npm i -g netlify-cli
```

2. Login:

```bash
netlify login
```

3. Initialize:

```bash
netlify init
```

#### Deploy

```bash
# Production deployment
netlify deploy --prod

# Preview deployment
netlify deploy
```

#### Configuration

Create `netlify.toml`:

```toml
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

[[headers]]
  for = "/assets/*"
  [headers.values]
    Cache-Control = "max-age=31536000, immutable"

[[headers]]
  for = "/api/*"
  [headers.values]
    Cache-Control = "max-age=0, must-revalidate"
```

### Option 3: AWS Amplify

#### Setup

1. Install AWS CLI and configure:

```bash
aws configure
```

2. Create Amplify app:

```bash
aws amplify create-app --name brightpair-ai-tutor
```

#### Deploy

1. Connect to GitHub repository
2. Configure build settings:

```yaml
version: 1
frontend:
    phases:
        preBuild:
            commands:
                - npm ci
        build:
            commands:
                - npm run build
    artifacts:
        baseDirectory: dist
        files:
            - "**/*"
    cache:
        paths:
            - node_modules/**/*
```

### Option 4: Docker

#### Create Dockerfile

```dockerfile
# Build stage
FROM node:20-alpine as builder

WORKDIR /app

# Copy package files
COPY package*.json ./
RUN npm ci

# Copy source code
COPY . .

# Build application
RUN npm run build

# Production stage
FROM nginx:alpine

# Copy built assets
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
```

#### Create nginx.conf

```nginx
server {
    listen 80;
    server_name _;
    
    root /usr/share/nginx/html;
    index index.html;
    
    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;
    add_header Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline';" always;
    
    # Compression
    gzip on;
    gzip_types text/plain text/css text/xml text/javascript application/javascript application/xml+rss application/json;
    
    # SPA routing
    location / {
        try_files $uri $uri/ /index.html;
    }
    
    # Cache static assets
    location /assets/ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
    
    # API proxy (if needed)
    location /api/ {
        proxy_pass https://your-api-endpoint.com;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

#### Build and Deploy

```bash
# Build Docker image
docker build -t brightpair-ai-tutor .

# Run locally
docker run -p 80:80 brightpair-ai-tutor

# Push to registry
docker tag brightpair-ai-tutor your-registry/brightpair-ai-tutor
docker push your-registry/brightpair-ai-tutor
```

## Post-Deployment

### 1. SSL Configuration

#### For Vercel/Netlify

- SSL is automatically configured
- Verify HTTPS redirect is enabled

#### For Custom Deployments

- Use Let's Encrypt with Certbot
- Configure auto-renewal
- Test SSL rating at SSL Labs

### 2. DNS Configuration

Update DNS records:

```
Type  Name    Value                   TTL
A     @       your-server-ip          300
A     www     your-server-ip          300
CNAME app     your-deployment.app     300
```

### 3. Health Check Verification

```bash
# Check application health
curl https://app.brightpair.com/api/health

# Check specific services
curl https://app.brightpair.com/api/health/database
curl https://app.brightpair.com/api/health/auth
```

### 4. Performance Testing

Run performance tests:

```bash
# Using Lighthouse
npx lighthouse https://app.brightpair.com --view

# Load testing
npm install -g artillery
artillery quick -d 60 -r 10 https://app.brightpair.com
```

### 5. Security Verification

```bash
# Security headers check
curl -I https://app.brightpair.com

# SSL verification
openssl s_client -connect app.brightpair.com:443 -servername app.brightpair.com
```

## Monitoring & Maintenance

### 1. Set Up Monitoring

#### Application Monitoring

- Sentry for error tracking (already configured)
- Set up alerts for error rate thresholds
- Configure user context for better debugging

#### Infrastructure Monitoring

- Uptime monitoring (e.g., Pingdom, UptimeRobot)
- Set up alerts for downtime
- Monitor response times

#### Analytics

- Google Analytics or similar
- Track user engagement metrics
- Monitor conversion rates

### 2. Regular Maintenance Tasks

#### Daily

- Check error logs in Sentry
- Monitor application performance
- Review security alerts

#### Weekly

- Review analytics data
- Check for dependency updates
- Verify backup integrity

#### Monthly

- Security audit
- Performance optimization review
- Database maintenance
- Update dependencies

### 3. Rollback Procedures

#### Vercel/Netlify

```bash
# List deployments
vercel ls

# Rollback to previous
vercel rollback [deployment-url]
```

#### Docker

```bash
# Keep previous image tagged
docker tag brightpair-ai-tutor brightpair-ai-tutor:backup

# Rollback
docker stop current-container
docker run -d -p 80:80 brightpair-ai-tutor:backup
```

### 4. Scaling Considerations

#### Horizontal Scaling

- Use load balancer (AWS ALB, Cloudflare)
- Deploy multiple instances
- Configure session persistence

#### Vertical Scaling

- Monitor resource usage
- Upgrade server specs as needed
- Optimize database queries

#### CDN Configuration

- Use Cloudflare or similar
- Cache static assets
- Configure purge rules

## Troubleshooting

### Common Issues

#### Build Failures

```bash
# Clear cache and rebuild
rm -rf node_modules dist
npm install
npm run build
```

#### Environment Variable Issues

```bash
# Verify all variables
npm run check:env

# Check deployment platform
vercel env ls
```

#### Database Connection Issues

- Verify connection string
- Check firewall rules
- Ensure SSL mode is correct

### Debug Mode

Enable debug logging:

```bash
VITE_LOG_LEVEL=debug npm run build
```

### Support Contacts

- Technical Issues: tech@brightpair.com
- Security Issues: security@brightpair.com
- Database Support: Supabase support portal

## Security Checklist

Before going live:

- [ ] All API keys are production keys
- [ ] Rate limiting is enabled
- [ ] CORS is properly configured
- [ ] Security headers are set
- [ ] SSL certificate is valid
- [ ] Passwords meet complexity requirements
- [ ] Session timeout is configured
- [ ] Input sanitization is active
- [ ] Error messages don't leak sensitive info
- [ ] Monitoring and alerting is configured

## Final Steps

1. **Announce Deployment**
   - Notify team members
   - Update status page
   - Send deployment notification

2. **Monitor Initial Hours**
   - Watch error rates
   - Check performance metrics
   - Be ready to rollback

3. **Document Deployment**
   - Record deployment time
   - Note any issues encountered
   - Update runbooks

Congratulations! Your BrightPair AI Tutor is now live! 🎉
