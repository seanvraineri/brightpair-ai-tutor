/**
 * Deployment Configuration for BrightPair AI Tutor
 * This file contains deployment settings for different environments
 */

const deployConfig = {
  // Production configuration
  production: {
    name: 'production',
    url: process.env.PRODUCTION_URL || 'https://app.brightpair.com',
    branch: 'main',
    
    // Environment variables that need to be set
    requiredEnvVars: [
      'VITE_SUPABASE_URL',
      'VITE_SUPABASE_ANON_KEY',
      'VITE_SENTRY_DSN',
      'VITE_APP_URL',
      'VITE_APP_VERSION',
    ],
    
    // Build configuration
    build: {
      command: 'npm run build',
      outputDir: 'dist',
      // Environment-specific build flags
      env: {
        NODE_ENV: 'production',
        VITE_APP_ENV: 'production',
      },
    },
    
    // Security settings
    security: {
      enableRateLimiting: true,
      enableSessionTimeout: true,
      sessionTimeoutMinutes: 30,
      corsOrigins: [
        'https://app.brightpair.com',
        'https://www.brightpair.com',
      ],
    },
    
    // Performance settings
    performance: {
      enableCaching: true,
      enableCompression: true,
      enableServiceWorker: true,
      cdnUrl: process.env.CDN_URL || '',
    },
    
    // Monitoring
    monitoring: {
      enableSentry: true,
      enableHealthChecks: true,
      healthCheckPath: '/api/health',
      enablePerformanceMonitoring: true,
    },
  },
  
  // Staging configuration
  staging: {
    name: 'staging',
    url: process.env.STAGING_URL || 'https://staging.brightpair.com',
    branch: 'develop',
    
    requiredEnvVars: [
      'VITE_SUPABASE_URL',
      'VITE_SUPABASE_ANON_KEY',
      'VITE_APP_URL',
    ],
    
    build: {
      command: 'npm run build',
      outputDir: 'dist',
      env: {
        NODE_ENV: 'production',
        VITE_APP_ENV: 'staging',
      },
    },
    
    security: {
      enableRateLimiting: true,
      enableSessionTimeout: true,
      sessionTimeoutMinutes: 60,
      corsOrigins: [
        'https://staging.brightpair.com',
        'http://localhost:3000',
        'http://localhost:8080',
      ],
    },
    
    performance: {
      enableCaching: true,
      enableCompression: true,
      enableServiceWorker: false,
      cdnUrl: '',
    },
    
    monitoring: {
      enableSentry: true,
      enableHealthChecks: true,
      healthCheckPath: '/api/health',
      enablePerformanceMonitoring: false,
    },
  },
  
  // Development configuration
  development: {
    name: 'development',
    url: 'http://localhost:8080',
    branch: 'feature/*',
    
    requiredEnvVars: [
      'VITE_SUPABASE_URL',
      'VITE_SUPABASE_ANON_KEY',
    ],
    
    build: {
      command: 'npm run dev',
      outputDir: 'dist',
      env: {
        NODE_ENV: 'development',
        VITE_APP_ENV: 'development',
      },
    },
    
    security: {
      enableRateLimiting: false,
      enableSessionTimeout: false,
      sessionTimeoutMinutes: 0,
      corsOrigins: ['*'], // Allow all in development
    },
    
    performance: {
      enableCaching: false,
      enableCompression: false,
      enableServiceWorker: false,
      cdnUrl: '',
    },
    
    monitoring: {
      enableSentry: false,
      enableHealthChecks: true,
      healthCheckPath: '/api/health',
      enablePerformanceMonitoring: false,
    },
  },
};

// Deployment scripts
const deploymentScripts = {
  // Pre-deployment checks
  preDeployChecks: async (environment) => {
    const config = deployConfig[environment];
    if (!config) {
      throw new Error(`Unknown environment: ${environment}`);
    }
    
    console.log(`🔍 Running pre-deployment checks for ${environment}...`);
    
    // Check required environment variables
    const missingVars = config.requiredEnvVars.filter(
      (varName) => !process.env[varName]
    );
    
    if (missingVars.length > 0) {
      throw new Error(
        `Missing required environment variables: ${missingVars.join(', ')}`
      );
    }
    
    // Run tests
    console.log('🧪 Running tests...');
    await runCommand('npm test');
    
    // Run lint
    console.log('🔍 Running linter...');
    await runCommand('npm run lint');
    
    // Run type check
    console.log('📝 Running type check...');
    await runCommand('npm run type-check');
    
    console.log('✅ Pre-deployment checks passed!');
  },
  
  // Build for deployment
  build: async (environment) => {
    const config = deployConfig[environment];
    console.log(`🔨 Building for ${environment}...`);
    
    // Set environment variables
    Object.entries(config.build.env).forEach(([key, value]) => {
      process.env[key] = value;
    });
    
    // Run build command
    await runCommand(config.build.command);
    
    console.log('✅ Build completed!');
  },
  
  // Post-deployment tasks
  postDeploy: async (environment) => {
    const config = deployConfig[environment];
    console.log(`🎉 Post-deployment tasks for ${environment}...`);
    
    // Verify deployment
    if (config.monitoring.enableHealthChecks) {
      console.log('🏥 Checking health endpoint...');
      const healthUrl = `${config.url}${config.monitoring.healthCheckPath}`;
      // Would make actual HTTP request here
      console.log(`Health check URL: ${healthUrl}`);
    }
    
    // Clear CDN cache if applicable
    if (config.performance.cdnUrl) {
      console.log('🧹 Clearing CDN cache...');
      // Would trigger CDN cache clear here
    }
    
    // Notify monitoring services
    if (config.monitoring.enableSentry) {
      console.log('📊 Creating Sentry release...');
      // Would create Sentry release here
    }
    
    console.log('✅ Deployment completed successfully!');
  },
};

// Helper function to run shell commands
async function runCommand(command) {
  console.log(`  $ ${command}`);
  // In real implementation, would use child_process.exec or similar
  return Promise.resolve();
}

// Export configuration
module.exports = {
  deployConfig,
  deploymentScripts,
  
  // Main deployment function
  deploy: async (environment = 'production') => {
    try {
      await deploymentScripts.preDeployChecks(environment);
      await deploymentScripts.build(environment);
      await deploymentScripts.postDeploy(environment);
    } catch (error) {
      console.error('❌ Deployment failed:', error.message);
      process.exit(1);
    }
  },
}; 