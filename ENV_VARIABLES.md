# Environment Variables Documentation

This document describes all environment variables required for the BrightPair AI
Tutor application.

## Required Variables

### 🔐 Authentication & Database

#### `VITE_SUPABASE_URL`

- **Description**: Your Supabase project URL
- **Example**: `https://xyzcompany.supabase.co`
- **Required**: Yes
- **Used in**: Database connections, API calls

#### `VITE_SUPABASE_ANON_KEY`

- **Description**: Supabase anonymous/public key for client-side operations
- **Example**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`
- **Required**: Yes
- **Used in**: Client authentication, public API access

#### `SUPABASE_SERVICE_ROLE_KEY`

- **Description**: Supabase service role key for server-side operations
- **Example**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`
- **Required**: Yes (for edge functions)
- **Used in**: Admin operations, bypassing RLS
- **⚠️ Security**: Never expose this in client-side code

### 🤖 AI Configuration

#### `VITE_OPENAI_API_KEY`

- **Description**: OpenAI API key for AI tutoring features
- **Example**: `sk-proj-...`
- **Required**: Yes
- **Used in**: AI tutoring, content generation

#### `VITE_AI_MODEL`

- **Description**: OpenAI model to use
- **Default**: `gpt-4`
- **Options**: `gpt-4`, `gpt-3.5-turbo`
- **Required**: No
- **Used in**: AI service configuration

#### `VITE_AI_MAX_TOKENS`

- **Description**: Maximum tokens for AI responses
- **Default**: `1000`
- **Required**: No
- **Used in**: AI response length control

#### `VITE_AI_TEMPERATURE`

- **Description**: AI response creativity (0-1)
- **Default**: `0.7`
- **Required**: No
- **Used in**: AI response variation

### 🐛 Error Tracking

#### `VITE_SENTRY_DSN`

- **Description**: Sentry Data Source Name for error tracking
- **Example**: `https://abc123@o123456.ingest.sentry.io/1234567`
- **Required**: Yes (for production)
- **Used in**: Error monitoring and reporting

#### `VITE_SENTRY_ENVIRONMENT`

- **Description**: Environment name for Sentry
- **Default**: `production`
- **Options**: `development`, `staging`, `production`
- **Required**: No
- **Used in**: Error categorization

### 🌐 Application Configuration

#### `VITE_APP_URL`

- **Description**: Public URL of your application
- **Example**: `https://app.brightpair.com`
- **Required**: Yes
- **Used in**: Email links, OAuth redirects, CORS

#### `VITE_APP_NAME`

- **Description**: Application name
- **Default**: `BrightPair AI Tutor`
- **Required**: No
- **Used in**: Email templates, UI display

#### `VITE_APP_VERSION`

- **Description**: Application version
- **Example**: `1.0.0`
- **Required**: No
- **Used in**: Health checks, debugging

#### `VITE_APP_ENV`

- **Description**: Application environment
- **Default**: `production`
- **Options**: `development`, `staging`, `production`
- **Required**: No
- **Used in**: Feature flags, logging levels

### 📧 Email Configuration

#### `VITE_SMTP_HOST`

- **Description**: SMTP server hostname
- **Example**: `smtp.sendgrid.net`
- **Required**: Yes (if using email features)
- **Used in**: Transactional emails

#### `VITE_SMTP_PORT`

- **Description**: SMTP server port
- **Default**: `587`
- **Required**: No
- **Used in**: Email service configuration

#### `VITE_SMTP_USER`

- **Description**: SMTP authentication username
- **Example**: `apikey`
- **Required**: Yes (if using email features)
- **Used in**: Email authentication

#### `VITE_SMTP_PASS`

- **Description**: SMTP authentication password
- **Example**: `SG.actualKey...`
- **Required**: Yes (if using email features)
- **Used in**: Email authentication

#### `VITE_EMAIL_FROM`

- **Description**: Default from email address
- **Example**: `noreply@brightpair.com`
- **Required**: Yes (if using email features)
- **Used in**: Email sender address

### 🔒 Security Configuration

#### `VITE_JWT_SECRET`

- **Description**: Secret key for JWT token signing
- **Example**: `your-256-bit-secret`
- **Required**: Yes
- **Used in**: Token generation and validation
- **⚠️ Security**: Generate using `openssl rand -base64 32`

#### `VITE_ENCRYPTION_KEY`

- **Description**: Key for encrypting sensitive data
- **Example**: `32-character-encryption-key-here`
- **Required**: Yes
- **Used in**: Data encryption at rest
- **⚠️ Security**: Generate using `openssl rand -hex 32`

#### `VITE_ALLOWED_ORIGINS`

- **Description**: Comma-separated list of allowed CORS origins
- **Example**: `https://app.brightpair.com,https://www.brightpair.com`
- **Required**: No
- **Default**: Same origin only
- **Used in**: CORS configuration

#### `VITE_SESSION_DURATION`

- **Description**: Session duration in minutes
- **Default**: `30`
- **Required**: No
- **Used in**: Session timeout configuration

### 📊 Analytics & Monitoring

#### `VITE_GA_TRACKING_ID`

- **Description**: Google Analytics tracking ID
- **Example**: `G-XXXXXXXXXX`
- **Required**: No
- **Used in**: Usage analytics

#### `VITE_HOTJAR_ID`

- **Description**: Hotjar site ID
- **Example**: `1234567`
- **Required**: No
- **Used in**: User behavior tracking

### 🚀 Performance & Features

#### `VITE_ENABLE_PWA`

- **Description**: Enable Progressive Web App features
- **Default**: `false`
- **Options**: `true`, `false`
- **Required**: No
- **Used in**: Service worker, offline support

#### `VITE_CDN_URL`

- **Description**: CDN URL for static assets
- **Example**: `https://cdn.brightpair.com`
- **Required**: No
- **Used in**: Asset loading optimization

#### `VITE_API_TIMEOUT`

- **Description**: API request timeout in milliseconds
- **Default**: `30000`
- **Required**: No
- **Used in**: Network request configuration

### 🧪 Development & Testing

#### `VITE_USE_MOCK_DATA`

- **Description**: Use mock data instead of real API calls
- **Default**: `false`
- **Options**: `true`, `false`
- **Required**: No
- **Used in**: Development and testing

#### `VITE_LOG_LEVEL`

- **Description**: Logging verbosity level
- **Default**: `info`
- **Options**: `debug`, `info`, `warn`, `error`
- **Required**: No
- **Used in**: Logger configuration

## Environment Files

### `.env.local` (Development)

```bash
# Core Configuration
VITE_SUPABASE_URL=https://localhost:54321
VITE_SUPABASE_ANON_KEY=your-local-anon-key
VITE_APP_URL=http://localhost:8080
VITE_APP_ENV=development

# Development Settings
VITE_LOG_LEVEL=debug
VITE_USE_MOCK_DATA=true
```

### `.env.staging` (Staging)

```bash
# Core Configuration
VITE_SUPABASE_URL=https://staging.supabase.co
VITE_SUPABASE_ANON_KEY=your-staging-anon-key
VITE_APP_URL=https://staging.brightpair.com
VITE_APP_ENV=staging

# Staging Settings
VITE_LOG_LEVEL=info
VITE_SENTRY_DSN=your-sentry-dsn
VITE_SENTRY_ENVIRONMENT=staging
```

### `.env.production` (Production)

```bash
# Core Configuration
VITE_SUPABASE_URL=https://production.supabase.co
VITE_SUPABASE_ANON_KEY=your-production-anon-key
VITE_APP_URL=https://app.brightpair.com
VITE_APP_ENV=production

# Production Settings
VITE_LOG_LEVEL=warn
VITE_SENTRY_DSN=your-sentry-dsn
VITE_SENTRY_ENVIRONMENT=production

# Security
VITE_ALLOWED_ORIGINS=https://app.brightpair.com,https://www.brightpair.com
VITE_SESSION_DURATION=30

# Performance
VITE_ENABLE_PWA=true
VITE_CDN_URL=https://cdn.brightpair.com
```

## Security Best Practices

1. **Never commit `.env` files** to version control
2. **Use different keys** for each environment
3. **Rotate keys regularly** (every 90 days recommended)
4. **Use secrets management** services in production (AWS Secrets Manager,
   Vault, etc.)
5. **Limit access** to production environment variables
6. **Audit access** to sensitive keys regularly
7. **Use least privilege** principle for service keys

## Validation

To validate your environment configuration, run:

```bash
npm run check:env
```

This will verify that all required environment variables are set and properly
formatted.
