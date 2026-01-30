/**
 * logout command - Log out from a reskill registry
 *
 * Removes the token from ~/.reskillrc
 */

import { Command } from 'commander';
import { AuthManager } from '../../core/auth-manager.js';
import { ConfigLoader } from '../../core/config-loader.js';
import { logger } from '../../utils/logger.js';

// ============================================================================
// Types
// ============================================================================

interface LogoutOptions {
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

async function logoutAction(options: LogoutOptions): Promise<void> {
  const registry = resolveRegistry(options.registry);
  const authManager = new AuthManager();

  // Check if logged in
  const token = authManager.getToken(registry);
  if (!token) {
    logger.log(`Not logged in to ${registry}`);
    return;
  }

  const email = authManager.getEmail(registry);

  // Remove token
  authManager.removeToken(registry);

  logger.log('✓ Logged out successfully');
  if (email) {
    logger.log(`  Email: ${email}`);
  }
  logger.log(`  Registry: ${registry}`);
}

// ============================================================================
// Command Definition
// ============================================================================

export const logoutCommand = new Command('logout')
  .description('Log out from a reskill registry')
  .option('-r, --registry <url>', 'Registry URL (or set RESKILL_REGISTRY env var, or defaults.publishRegistry in skills.json)')
  .action(logoutAction);

export default logoutCommand;
