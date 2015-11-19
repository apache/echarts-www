describe('util/graphic', function() {

    var utHelper = window.utHelper;
    var util;

    beforeAll(function (done) { // jshint ignore:line
        utHelper.resetPackageLoader(function () {
            window.require(['zrender/core/util'], function (g) {
                util = g;
                done();
            });
        });
    });

    describe('merge', function () {

        it('merge_base', function (done) {
            // base
            expect(util.merge({}, {a: 121})).toEqual({a: 121});
            expect(util.merge({a: 'zz'}, {a: '121'}, true)).toEqual({a: '121'});
            expect(util.merge({a: 'zz', b: {c: 1212}}, {b: {c: 'zxcv'}}, true)).toEqual({a: 'zz', b: {c: 'zxcv'}});

            // overwrite
            expect(util.merge({a: {b: 'zz'}}, {a: '121'}, true)).toEqual({a: '121'});
            expect(util.merge({a: null}, {a: '121'}, true)).toEqual({a: '121'});
            expect(util.merge({a: '12'}, {a: null}, true)).toEqual({a: null});
            expect(util.merge({a: {a: 'asdf'}}, {a: undefined}, true)).toEqual({a: undefined});
            var b = {b: 'vvv'}; // not same object
            var result = util.merge({a: null}, {a: b}, true);
            expect(result).toEqual({a: {b: 'vvv'}});
            expect(result.a === b).toEqual(false);

            // not overwrite
            expect(util.merge({a: {b: 'zz'}}, {a: '121'}, false)).toEqual({a: {b: 'zz'}});
            expect(util.merge({a: null}, {a: '121'}, false)).toEqual({a: null});
            expect(util.merge({a: '12'}, {a: null}, false)).toEqual({a: '12'});
            expect(util.merge({a: {a: 'asdf'}}, {a: undefined}, false)).toEqual({a: {a: 'asdf'}});

            // array
            expect(util.merge({a: {a: 'asdf'}}, {a: ['asdf', 'zxcv']}, true)).toEqual({a: ['asdf', 'zxcv']});
            expect(util.merge({a: {a: [12, 23, 34]}}, {a: {a: [99, 88]}}, false)).toEqual({a: {a: [12, 23, 34]}});
            var b = [99, 88]; // not same object
            var result = util.merge({a: {a: [12, 23, 34]}}, {a: {a: b}}, true);
            expect(result).toEqual({a: {a: b}});
            expect(result.a.a === b).toEqual(false);

            // null/undefined
            expect(util.merge(null, {a: '121'})).toEqual(undefined);
            expect(util.merge(undefined, {a: '121'})).toEqual(undefined);
            expect(util.merge({a: '121'}, null)).toEqual({a: '121'});
            expect(util.merge({a: '121'}, undefined)).toEqual({a: '121'});

            done();
        });

    });

});