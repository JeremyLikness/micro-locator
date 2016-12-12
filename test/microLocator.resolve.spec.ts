import { MicroServicesLocator } from '../src/microLocator';

describe('resolve', () => {

    let loc: MicroServicesLocator.locator = null;
    let locate: (sig: string) => string = null;

    beforeEach(() => {
        loc = new MicroServicesLocator.locator();
        locate = sig => loc.resolve(sig);
    });

    it('resolves to global root by default', () => {
        expect(locate('/')).toBe('/');
    });

    it('resolves the path /api/etc/etc', () => {
        expect(locate('/api/etc/etc')).toBe('/api/etc/etc');
    });

    it('resolves the path /api/etc', () => {
        expect(locate('/api/etc')).toBe('/api/etc');
    });

    it('resolves the path /api', () => {
        expect(locate('/api')).toBe('/api');
    });

    it('preserves the queryString', () => {
        expect(locate('/api/etc?foo=bar&e=mc2')).toBe('/api/etc?foo=bar&e=mc2');
    });

    it('rejects malformed paths', () => {
        expect(() => locate('/api/ etc')).toThrowError();
    });

    describe('resolve after replace', () => {
        
        beforeEach(() => { 
            loc.replace('/api/etc', 'http://www.test.com/api/');
        });

        it('ignores anything but an exact match', () => {
            expect(locate('/api/etc/etc')).toBe('/api/etc/etc');
        });

        it('replaces the path when exact match', () => {
            expect(locate('/api/etc')).toBe('http://www.test.com/api/');
        });
    });

    describe('resolve after rebase', () => {

        it('rebase without truncate ignores higher level paths', () => {
            loc.rebase('/api/accounting', 'http://testing/');
            expect(locate('/api/billing/etc')).toBe('/api/billing/etc');
        });

        it('rebase without truncate rebases the target path', () => {
            loc.rebase('/api/accounting', 'http://testing/');
            expect(locate('/api/accounting/etc')).toBe('http://testing/api/accounting/etc');
        });

        it('rebase with truncate ignores higher level paths', () => {
            loc.rebase('/api/sales', 'http://sales/').truncate();
            expect(locate('/api/billing/etc')).toBe('/api/billing/etc');
        });

        it('rebase with truncate rebases the target path', () => {
            loc.rebase('/api/sales', 'http://sales/').truncate();
            expect(locate('/api/sales/etc')).toBe('http://sales/etc');        
        });
    });

});