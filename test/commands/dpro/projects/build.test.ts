import { expect, test } from '@salesforce/command/dist/test';

describe('not found project folder or it is empty', () => {
  test.stdout()
      .command(['dpro:projects:build'])
      .it('runs dpro:projects:build', (ctx) => {
        expect(ctx.stdout).to.contain('');
      });
});
