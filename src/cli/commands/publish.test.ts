/**
 * publish command unit tests
 *
 * Tests for helper functions in the publish command
 */

import { describe, expect, it } from 'vitest';
import { isBlockedPublicRegistry } from './publish.js';

describe('publish command', () => {
  // ============================================================================
  // isBlockedPublicRegistry tests
  // ============================================================================

  describe('isBlockedPublicRegistry', () => {
    describe('should block public registries', () => {
      it('should block reskill.info', () => {
        expect(isBlockedPublicRegistry('https://reskill.info')).toBe(true);
      });

      it('should block www.reskill.info', () => {
        expect(isBlockedPublicRegistry('https://www.reskill.info')).toBe(true);
      });

      it('should block registry.reskill.info', () => {
        expect(isBlockedPublicRegistry('https://registry.reskill.info')).toBe(true);
      });

      it('should block api.reskill.info', () => {
        expect(isBlockedPublicRegistry('https://api.reskill.info')).toBe(true);
      });

      it('should block with path', () => {
        expect(isBlockedPublicRegistry('https://reskill.info/api/v1')).toBe(true);
      });

      it('should block with port', () => {
        expect(isBlockedPublicRegistry('https://reskill.info:443')).toBe(true);
      });

      it('should block http (not https)', () => {
        expect(isBlockedPublicRegistry('http://reskill.info')).toBe(true);
      });

      it('should block subdomains of reskill.info', () => {
        expect(isBlockedPublicRegistry('https://sub.api.reskill.info')).toBe(true);
      });

      it('should be case insensitive', () => {
        expect(isBlockedPublicRegistry('https://RESKILL.INFO')).toBe(true);
        expect(isBlockedPublicRegistry('https://Reskill.Info')).toBe(true);
      });
    });

    describe('should allow private registries', () => {
      it('should allow custom private domain', () => {
        expect(isBlockedPublicRegistry('https://reskill-test.zhenguanyu.com')).toBe(false);
      });

      it('should allow localhost', () => {
        expect(isBlockedPublicRegistry('http://localhost:3000')).toBe(false);
      });

      it('should allow 127.0.0.1', () => {
        expect(isBlockedPublicRegistry('http://127.0.0.1:3000')).toBe(false);
      });

      it('should allow internal company domain', () => {
        expect(isBlockedPublicRegistry('https://registry.company.internal')).toBe(false);
      });

      it('should allow other .info domains', () => {
        expect(isBlockedPublicRegistry('https://other-registry.info')).toBe(false);
      });

      it('should allow domains containing reskill but not reskill.info', () => {
        expect(isBlockedPublicRegistry('https://reskill-private.com')).toBe(false);
        expect(isBlockedPublicRegistry('https://my-reskill.org')).toBe(false);
      });

      it('should not block reskill.info as part of another domain', () => {
        // e.g., reskill.info.example.com is NOT reskill.info
        expect(isBlockedPublicRegistry('https://reskill.info.example.com')).toBe(false);
      });
    });

    describe('edge cases', () => {
      it('should handle invalid URL gracefully', () => {
        // Falls back to string matching
        expect(isBlockedPublicRegistry('not-a-url')).toBe(false);
      });

      it('should handle malformed URL with reskill.info', () => {
        // Falls back to string matching
        expect(isBlockedPublicRegistry('reskill.info')).toBe(true);
      });

      it('should handle empty string', () => {
        expect(isBlockedPublicRegistry('')).toBe(false);
      });
    });
  });
});
