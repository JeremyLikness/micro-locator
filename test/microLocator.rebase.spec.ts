/**
 * @license
 * Copyright Jeremy Likness. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT license that can be
 * found in the LICENSE file at https://github.com/jeremylikness/micro-locator/LICENSE
 */
import { MicroServicesLocator } from '../src/microLocator';

describe('resolve after rebase', () => {

    let loc: MicroServicesLocator.Locator = null;
    let locate: (sig: string) => string = null;

    beforeEach(() => {
        loc = new MicroServicesLocator.Locator();
        locate = sig => loc.resolve(sig);
    });

    describe('root', () => {

        it('rebases anything from root', () => {
            loc.rebase('/', 'http://testing/');
            expect(locate('/api/etc/etc')).toBe('http://testing/api/etc/etc');
        });

    });

    describe('without truncate', () => {

        beforeEach(() => {
            loc.rebase('/api/accounting', 'http://testing/');
        });

        it('rebase without truncate ignores higher level paths', () => {
            expect(locate('/api/billing/etc')).toBe('/api/billing/etc');
        });

        it('rebase without truncate rebases the target path', () => {
            expect(locate('/api/accounting/etc')).toBe('http://testing/api/accounting/etc');
        });
    });

    describe('with truncate', () => {

        beforeEach(() => {
            loc.rebase('/api/sales', 'http://sales/').truncate();
        });

        it('ignores higher level paths', () => {
            expect(locate('/api/billing/etc')).toBe('/api/billing/etc');
        });

        it('rebases the target path', () => {
            expect(locate('/api/sales/etc')).toBe('http://sales/etc');
        });
    });
});