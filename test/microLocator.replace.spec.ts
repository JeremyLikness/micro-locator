/**
 * @license
 * Copyright Jeremy Likness. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT license that can be
 * found in the LICENSE file at https://github.com/jeremylikness/micro-locator/LICENSE
 */
import { Locator } from '../src/microLocator';

describe('resolve after replace', () => {

    let loc: Locator = null;
    let locate: (sig: string) => string = null;

    beforeEach(() => {
        loc = new Locator();
        locate = sig => loc.resolve(sig);
        loc.replace('/api/etc', 'http://www.test.com/api/');
    });

    it('ignores anything but an exact match', () => {
        expect(locate('/api/etc/etc')).toBe('/api/etc/etc');
    });

    it('replaces the path when exact match', () => {
        expect(locate('/api/etc')).toBe('http://www.test.com/api/');
    });

});