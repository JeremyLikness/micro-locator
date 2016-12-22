/**
 * @license
 * Copyright Jeremy Likness. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT license that can be
 * found in the LICENSE file at https://github.com/jeremylikness/micro-locator/LICENSE
 */
import { Locator } from '../src/microLocator';

describe('MicroServicesLocator', () => {

    it('exists', () => {
        expect(Locator).toBeDefined();
    });

    it('has a locator class', () => {
        let temp = new Locator();
        expect(temp).toBeDefined();
    });

});