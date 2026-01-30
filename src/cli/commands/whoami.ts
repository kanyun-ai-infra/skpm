/**
 * whoami command - Show current authenticated user
 *
 * Displays the currently logged in user for a registry
 */

import { Command } from 'commander';
import { AuthManager } from '../../core/auth-manager.js';
import { ConfigLoader } from '../../core/config-loader.js';
import { RegistryClient, RegistryError } from '../../core/registry-client.js';
import { logger } from '../../utils/logger.js';

// ============================================================================
// Types
// ============================================================================

interface WhoamiOptions {
  registry?: string;
}

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Resolve registry URL from multiple sources
 */
function resolveRegistry(cliRegistry: string | undefined): string {
  // 1. CLI option (highest priority)
  if (cliRegistry) {
    return cliRegistry;
  }

  // 2. Environment variable
  const envRegistry = process.env.RESKILL_REGISTRY;
  if (envRegistry) {
    return envRegistry;
  }

  // 3. From skills.json (current directory)
  const configLoader = new ConfigLoader(process.cwd());
  if (configLoader.exists()) {
    const publishRegistry = configLoader.getPublishRegistry();
    if (publishRegistry) {
      return publishRegistry;
    }
  }

  // No registry configured - error
  logger.error('No registry specified');
  logger.newline();
  logger.log('Please specify a registry using one of these methods:');
  logger.log('  • --registry <url> option');
  logger.log('  • RESKILL_REGISTRY environment variable');
  logger.log('  • "defaults.publishRegistry" in skills.json');
  process.exit(1);
}

// ============================================================================
// Main Action
// ============================================================================

async function whoamiAction(options: WhoamiOptions): Promise<void> {
  const registry = resolveRegistry(options.registry);
  const authManager = new AuthManager();

  // Check if logged in locally
  const token = authManager.getToken(registry);
  if (!token) {
    logger.log(`Not logged in to ${registry}`);
    logger.newline();
    logger.log("Run 'reskill login' to authenticate.");
    process.exit(1);
  }

  // Verify with server
  const client = new RegistryClient({ registry, token });

  try {
    const response = await client.whoami();

    if (!response.success || !response.publisher) {
      logger.error('Failed to get user info');
      process.exit(1);
    }

    const { publisher } = response;

    logger.log(`@${publisher.handle}`);
    logger.log(`  Email: ${publisher.email}`);
    logger.log(`  Verified: ${publisher.email_verified ? 'Yes' : 'No'}`);
    logger.log(`  Registry: ${registry}`);

  } catch (error) {
    if (error instanceof RegistryError) {
      if (error.statusCode === 401) {
        logger.error('Token is invalid or expired');
        logger.newline();
        logger.log("Run 'reskill login' to re-authenticate.");
      } else {
        logger.error(`Failed: ${error.message}`);
      }
    } else {
      logger.error(`Failed: ${(error as Error).message}`);
    }
    process.exit(1);
  }
}

// ============================================================================
// Command Definition
// ============================================================================

export const whoamiCommand = new Command('whoami')
  .description('Show current authenticated user')
  .option('-r, --registry <url>', 'Registry URL (or set RESKILL_REGISTRY env var, or defaults.publishRegistry in skills.json)')
  .action(whoamiAction);

export default whoamiCommand;
