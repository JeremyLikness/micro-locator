/**
 * @license
 * Copyright Jeremy Likness. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT license that can be
 * found in the LICENSE file at https://github.com/jeremylikness/micro-locator/LICENSE
 */
import { MicroServicesLocator } from "../src/microLocator";

interface ITest {
    requested: string;
    expected: string;
}

/**  
Here are the basic URLs: 

/api/accounting/func1 
/api/accounting/func2 
/api/billing/func3 
/api/billing/func4 

SCENARIO 1: 

Rebase the root so everything is http://production/api/accounting .. .etc. 

SCENARIO 2: 

Accounting "func2" gets implemented on an experimental server http://experimental/func 

Senario 3: 

Billing is moved to http://billing.production/func3 etc. 

*/

describe("scenarios", () => {

    let loc: MicroServicesLocator.Locator = null;
    let locate: (sig: string) => string = null;

    beforeEach(() => {
        loc = new MicroServicesLocator.Locator();
        loc.rebase("/", "http://production");
        loc.rebase("/api/billing", "http://billing.production/").truncate();
        loc.replace("/api/accounting/func2", "http://experimental/func");
        locate = sig => loc.resolve(sig);
    });

    describe("scenario 1", () => {

        it("rebases any urls without explicit match", () => {
            expect(locate("/api/accounting/func1")).toBe("http://production/api/accounting/func1");
        });

    });

     describe("scenario 2", () => {

        it("replaces the url", () => {
            expect(locate("/api/accounting/func2")).toBe("http://experimental/func");
        });

    });

    describe("scenario 3", () => {

        it("rebases the url with truncation", () => {
            expect(locate("/api/billing/func3")).toBe("http://billing.production/func3");
            expect(locate("/api/billing/func4")).toBe("http://billing.production/func4");
        });
    });
});