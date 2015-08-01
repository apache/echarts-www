define(function (require) {
    describe('LogicSet', function() {

        var LogicSetFactory = require('common/LogicSetFactory');

        var UNIVERSAL = ['line', 'bar', 'pie', 'map'];
        var UNIVERSAL2 = ['liNe', 'bar', 'Pie', 'map'];

        function createFactory(parseMode, toLowerCase) {
            return new LogicSetFactory({
                universal: UNIVERSAL,
                parseMode: parseMode,
                toLowerCase: toLowerCase
            });
        }

        it('baseCreate', function () {
            var factory = createFactory(LogicSetFactory.NO_POSITIVE_MEANS_UNIVERSAL);
            var set1 = factory.createSet('line,bar');
            sameSet(set1, ['bar', 'line']);

            var set2 = factory.createSet('!pie');
            sameSet(set2, ['bar', 'line', 'map'], true);
            expect(set2.list(false)).toEqual(jasmine.arrayContaining(['!pie']));

            var set3 = factory.createSet('line, !pie, bar');
            sameSet(set3, ['line', 'bar']);

            var set4 = factory.createSet('!pie, !bar');
            sameSet(set4, ['line', 'map'], true);

            expect(function () {
                factory.createSet('zxcv');
            }).toThrow();
        });

        it('toLowerCase', function () {
            var factory = new LogicSetFactory({
                universal: UNIVERSAL2,
                toLowerCase: true
            });
            var set1 = factory.createSet('lIne,pIE');
            sameSet(set1, ['line', 'pie']);
        });

        it('testParseMode', function () {
            var factory1 = createFactory();
            var set1 = factory1.createSet();
            sameSet(set1, UNIVERSAL);
            var set2 = factory1.createSet(null, {parseMode: LogicSetFactory.NO_POSITIVE_MEANS_EMPTY});
            sameSet(set2, []);
            var set3 = factory1.createSet(['!bar'], {parseMode: LogicSetFactory.NO_POSITIVE_MEANS_EMPTY});
            sameSet(set3, []);

            var factory2 = createFactory(LogicSetFactory.NO_POSITIVE_MEANS_EMPTY);
            var set3 = factory2.createSet();
            sameSet(set3, []);
            var set4 = factory1.createSet(null, {parseMode: LogicSetFactory.NO_POSITIVE_MEANS_UNIVERSAL});
            sameSet(set4, UNIVERSAL);
        });

        it('testIntersect', function () {
            var factory1 = createFactory();
            var set1 = factory1.createSet('line, bar');
            // var set2 = factory1.createSet('bar, pie');
            var set3 = factory1.createSet('!bar');
            var set4 = factory1.createSet('!pie, !map');
            var set5 = factory1.createSet('!line, !bar');
            var set6 = factory1.createSet();
            var set7 = factory1.createSet();

            // sameSet(set1.intersects(set2), ['bar']);
            sameSet(set1.intersects(set3), ['line']);
            sameSet(set1.intersects(set4), ['line', 'bar']);
            sameSet(set1.intersects(set5), []);
            sameSet(set1.intersects(set6), []);
            sameSet(set7.intersects(set6), []);
        });

    });

    function sameSet(srcSet, expectArr, allPositive) {
        expect(srcSet.count()).toEqual(expectArr.length);
        expect(srcSet.list(allPositive)).toEqual(jasmine.arrayContaining(expectArr));
    }

});
