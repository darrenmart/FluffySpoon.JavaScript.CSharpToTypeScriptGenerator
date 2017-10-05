var fs = require('fs');

import { OptionsHelper } from '../src/OptionsHelper';

describe("OptionsHelper", function () {

	it("should be able to handle merging of complex objects", function () {
		var helper = new OptionsHelper();

        var offset = 10;

        var result = helper.mergeOptions({
                a: 1337,
                b: "foo",
                q: 8,
                c: {
                    d: true,
                    e: 42,
                    f: (number) => offset += number + 2
                }
            },
            {
                o: 987,
                b: "foo1",
                c: {
                    d: false,
                    e: 42,
                    f: (number) => offset += number + 1337
                }
            });

        expect(result.a).toBe(1337);
        expect(result.b).toBe("foo1");
        expect(result.o).toBe(987);
        expect(result.q).toBe(8);
        expect(result.c.d).toBe(false);
        expect(result.c.e).toBe(42);

        expect(result.c.f(20)).toBe(10+1337+2+20+20);
	});

});
