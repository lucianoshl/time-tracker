import { strictEqual } from 'assert';

  describe('environment', () => 
    it('evaluate test environment variables', function () {
        strictEqual(process.env.NODE_ENV,'test');
        strictEqual(process.env.DATABASE,'memory:');
    })
  );