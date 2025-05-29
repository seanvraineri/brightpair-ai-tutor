#!/usr/bin/env node

/**
 * Environment Variable Validation Script
 * Checks that all required environment variables are set and valid
 */

import chalk from 'chalk';

// Define required environment variables and their validation rules
const ENV_CONFIG = {
  // Core Required
  VITE_SUPABASE_URL: {
    required: true,
    pattern: /^https:\/\/.+\.supabase\.co$/,
    description: 'Supabase project URL'
  },
  VITE_SUPABASE_ANON_KEY: {
    required: true,
    pattern: /^[A-Za-z0-9+/=._-]+$/,
    minLength: 100,
    description: 'Supabase anonymous key'
  },
  
  // AI Configuration (required for production)
  VITE_OPENAI_API_KEY: {
    required: process.env.NODE_ENV === 'production',
    pattern: /^sk-[A-Za-z0-9]+$/,
    description: 'OpenAI API key'
  },
  
  // Error Tracking (required for production)
  VITE_SENTRY_DSN: {
    required: process.env.NODE_ENV === 'production',
    pattern: /^https:\/\/.+@.+\.ingest\.sentry\.io\/.+$/,
    description: 'Sentry DSN'
  },
  
  // Application Configuration
  VITE_APP_URL: {
    required: true,
    pattern: /^https?:\/\/.+$/,
    description: 'Application URL'
  },
  
  // Security (required for production)
  VITE_JWT_SECRET: {
    required: process.env.NODE_ENV === 'production',
    minLength: 32,
    description: 'JWT secret key'
  },
  VITE_ENCRYPTION_KEY: {
    required: process.env.NODE_ENV === 'production',
    minLength: 32,
    pattern: /^[a-f0-9]+$/,
    description: 'Encryption key (hex)'
  },
  
  // Optional but recommended
  VITE_APP_ENV: {
    required: false,
    enum: ['development', 'staging', 'production'],
    default: 'production',
    description: 'Application environment'
  },
  VITE_LOG_LEVEL: {
    required: false,
    enum: ['debug', 'info', 'warn', 'error'],
    default: 'info',
    description: 'Logging level'
  },
  VITE_SESSION_DURATION: {
    required: false,
    pattern: /^\d+$/,
    default: '30',
    description: 'Session duration in minutes'
  }
};

// Edge function specific variables
const EDGE_FUNCTION_CONFIG = {
  SUPABASE_SERVICE_ROLE_KEY: {
    required: true,
    pattern: /^[A-Za-z0-9+/=._-]+$/,
    minLength: 100,
    description: 'Supabase service role key'
  }
};

function validateEnvVar(name, config, value) {
  const errors = [];
  
  // Check if required
  if (config.required && !value) {
    errors.push(`Missing required variable`);
    return errors;
  }
  
  // If not required and not set, skip other validations
  if (!value) {
    return errors;
  }
  
  // Check pattern
  if (config.pattern && !config.pattern.test(value)) {
    errors.push(`Invalid format (expected: ${config.pattern})`);
  }
  
  // Check enum
  if (config.enum && !config.enum.includes(value)) {
    errors.push(`Invalid value (expected one of: ${config.enum.join(', ')})`);
  }
  
  // Check minimum length
  if (config.minLength && value.length < config.minLength) {
    errors.push(`Too short (minimum ${config.minLength} characters)`);
  }
  
  // Check maximum length
  if (config.maxLength && value.length > config.maxLength) {
    errors.push(`Too long (maximum ${config.maxLength} characters)`);
  }
  
  return errors;
}

function checkEnvironment(isEdgeFunction = false) {
  console.log(chalk.blue.bold('\n🔍 Validating Environment Variables\n'));
  
  const config = isEdgeFunction 
    ? { ...ENV_CONFIG, ...EDGE_FUNCTION_CONFIG }
    : ENV_CONFIG;
  
  let hasErrors = false;
  let hasWarnings = false;
  
  Object.entries(config).forEach(([name, rules]) => {
    const value = process.env[name];
    const errors = validateEnvVar(name, rules, value);
    
    if (errors.length > 0) {
      if (rules.required) {
        hasErrors = true;
        console.log(chalk.red(`❌ ${name}`));
        console.log(chalk.gray(`   ${rules.description}`));
        errors.forEach(error => {
          console.log(chalk.red(`   → ${error}`));
        });
      } else {
        hasWarnings = true;
        console.log(chalk.yellow(`⚠️  ${name}`));
        console.log(chalk.gray(`   ${rules.description}`));
        if (!value && rules.default) {
          console.log(chalk.yellow(`   → Using default: ${rules.default}`));
        } else {
          errors.forEach(error => {
            console.log(chalk.yellow(`   → ${error}`));
          });
        }
      }
    } else {
      console.log(chalk.green(`✅ ${name}`));
      console.log(chalk.gray(`   ${rules.description}`));
      if (value && (name.includes('KEY') || name.includes('SECRET'))) {
        console.log(chalk.gray(`   → ${value.substring(0, 10)}...`));
      } else if (value) {
        console.log(chalk.gray(`   → ${value}`));
      }
    }
    console.log();
  });
  
  // Additional security checks
  console.log(chalk.blue.bold('🔒 Security Checks\n'));
  
  // Check for exposed secrets
  const secretVars = Object.keys(config).filter(name => 
    name.includes('KEY') || name.includes('SECRET') || name.includes('PASSWORD')
  );
  
  secretVars.forEach(name => {
    const value = process.env[name];
    if (value && value.includes('example') || value === 'changeme') {
      hasErrors = true;
      console.log(chalk.red(`❌ ${name} contains placeholder value`));
    }
  });
  
  // Check environment consistency
  const appEnv = process.env.VITE_APP_ENV || 'production';
  const nodeEnv = process.env.NODE_ENV || 'production';
  
  if (appEnv !== nodeEnv && nodeEnv !== 'test') {
    hasWarnings = true;
    console.log(chalk.yellow(`⚠️  Environment mismatch: VITE_APP_ENV=${appEnv}, NODE_ENV=${nodeEnv}`));
  } else {
    console.log(chalk.green(`✅ Environment consistency: ${appEnv}`));
  }
  
  // Summary
  console.log(chalk.blue.bold('\n📊 Summary\n'));
  
  if (hasErrors) {
    console.log(chalk.red('❌ Environment validation failed'));
    console.log(chalk.red('   Please fix the errors above before proceeding.'));
    process.exit(1);
  } else if (hasWarnings) {
    console.log(chalk.yellow('⚠️  Environment validation passed with warnings'));
    console.log(chalk.yellow('   Consider addressing the warnings above.'));
  } else {
    console.log(chalk.green('✅ Environment validation passed'));
    console.log(chalk.green('   All required variables are properly configured.'));
  }
  
  // Environment-specific recommendations
  console.log(chalk.blue.bold('\n💡 Recommendations\n'));
  
  if (appEnv === 'production') {
    console.log(chalk.cyan('Production environment detected:'));
    console.log(chalk.gray('  • Ensure all API keys are production keys'));
    console.log(chalk.gray('  • Verify Sentry is configured for error tracking'));
    console.log(chalk.gray('  • Check that CORS origins are properly restricted'));
    console.log(chalk.gray('  • Confirm SSL certificates are valid'));
  } else if (appEnv === 'staging') {
    console.log(chalk.cyan('Staging environment detected:'));
    console.log(chalk.gray('  • Using staging API keys is recommended'));
    console.log(chalk.gray('  • Test error tracking with Sentry'));
    console.log(chalk.gray('  • Verify feature flags are appropriate'));
  } else {
    console.log(chalk.cyan('Development environment detected:'));
    console.log(chalk.gray('  • Mock data can be enabled with VITE_USE_MOCK_DATA=true'));
    console.log(chalk.gray('  • Debug logging is available with VITE_LOG_LEVEL=debug'));
    console.log(chalk.gray('  • Consider using local Supabase for development'));
  }
}

// Check if running for edge functions
const isEdgeFunction = process.argv.includes('--edge');

// Run validation
checkEnvironment(isEdgeFunction); 