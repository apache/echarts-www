define(function (require) {
    describe('SchemaBuild', function() {

        var $ = require('jquery');
        var schemaHelper = require('common/schemaHelper');
        var dtLib = require('dt/lib');

        var SCHEMA_URL = './spec/common/optionSchemaForTest.json?_v_=' + Math.random();
        var RENDER_URL = './spec/common/expectedRender.json?_v_=' + Math.random();
        var RENDER_KEYS = [
            'children', 'propertyName', 'optionPath', 'optionPathForHash',
            'childrenBrief', 'childrenPost', 'childrenPre', 'text'
        ];

        it('buildDoc', function (done) {
            fetchOptionSchema().done(function (schema, expectedRender) {
                schema = schema[0];
                expectedRender = expectedRender[0];
                var renderBase = {};
                this._schemaStatistic = schemaHelper.statisticSchema(schema);
                schemaHelper.buildDoc(schema, renderBase, this._schemaStatistic.universal);

                var diffResult = dtLib.diffObjects(cutRenderBase(renderBase), expectedRender);

                expect(diffResult.length).toEqual(0);

                done();
            });
        });

        xit('makeExpectRender', function (done) {
            fetchOptionSchema().done(function (schema) {
                schema = schema[0];
                var renderBase = {};
                this._schemaStatistic = schemaHelper.statisticSchema(schema);
                schemaHelper.buildDoc(schema, renderBase, this._schemaStatistic.universal);

                cutRenderBase(renderBase);

                var ta = $(
                    '<textarea style="position: fixed; left : 0; top: 0; width: 500px; height: 500px;" > </textarea>'
                ).appendTo(document.body);
                ta.val(JSON.stringify(renderBase, null, 4));

                expect(true).toEqual(true);

                done();
            });
        });

        function fetchOptionSchema() {
            return $.when($.getJSON(SCHEMA_URL), $.getJSON(RENDER_URL));
        }

        // 为了expectedRender.json不要太大，减掉些不必要的东西。
        function cutRenderBase(renderBase) {
            travelObj(renderBase, function (obj) {
                var type = $.type(obj);
                if (type === 'object') {
                    for (var key in obj) {
                        if (obj.hasOwnProperty(key) && (
                            dtLib.arrayIndexOf(RENDER_KEYS, key) < 0
                            || obj[key] === void 0
                        )) {
                            delete obj[key];
                        }
                    }
                }
            });
            return renderBase;
        }

        function travelObj (obj, callback) {
            callback(obj);

            var type = $.type(obj);

            if (type === 'array') {
                for (var i = 0, len = obj.length; i < len; i++) {
                    travelObj(obj[i], callback);
                }
            }
            else if (type === 'object') {
                for (var key in obj) {
                    if (obj.hasOwnProperty(key)) {
                        travelObj(obj[key], callback);
                    }
                }
            }
        }

    });

});
