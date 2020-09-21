import { strictEqual } from 'assert';

describe('environment', () => it('evaluate test environment variables', () => {
  strictEqual(process.env.NODE_ENV, 'test');
  strictEqual(process.env.DATABASE, ':memory:');
}));
