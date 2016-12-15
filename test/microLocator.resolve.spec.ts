/**
 * @license
 * Copyright Jeremy Likness. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT license that can be
 * found in the LICENSE file at https://github.com/jeremylikness/micro-locator/LICENSE
 */
import { MicroServicesLocator } from "../src/microLocator";

describe("resolve", () => {

    let loc: MicroServicesLocator.Locator = null;
    let locate: (sig: string) => string = null;

    beforeEach(() => {
        loc = new MicroServicesLocator.Locator();
        locate = sig => loc.resolve(sig);
    });

    it("resolves to global root by default", () => {
        expect(locate("/")).toBe("/");
    });

    it("resolves the path /api/etc/etc", () => {
        expect(locate("/api/etc/etc")).toBe("/api/etc/etc");
    });

    it("resolves the path /api/etc", () => {
        expect(locate("/api/etc")).toBe("/api/etc");
    });

    it("resolves the path /api", () => {
        expect(locate("/api")).toBe("/api");
    });

    it("preserves the queryString", () => {
        expect(locate("/api/etc?foo=bar&e=mc2")).toBe("/api/etc?foo=bar&e=mc2");
    });

});