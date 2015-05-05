define(function(require) {
    var team = require('../../data/team');
    var teamInfo = require('../../data/teamInfo');
    var groupInfo = require('../../data/groupInfo');
    var regionInfo = require('../../data/regionInfo');
    var colorMap = require('../../data/colorJson');
    var rank = require('./rank');

    var value = [];

    function init() {
        value = groupInfo['A组'].slice();

        fill(groupInfo);
        bindEvents();
    }

    function load() {
        rank.repaintChart(value);
    }

    function fill(data) {
        var table = $('<table>');

        var tr = $('<tr>').appendTo(table);
        $.each(data, function(index, item) {
            var th = $('<th>').attr('colspan', Math.ceil(item.length / 4)).appendTo(tr);
            $('<a>').attr('data-value', item.join(',')).html(index).appendTo(th);
        });

        $.each([0, 1, 2, 3], function(i) {
            var tr = $('<tr>').appendTo(table);
            $.each(data, function(index, item) {
                var colnum = Math.ceil(item.length / 4);
                for (var j = 0; j < colnum; j++) {
                    var td = $('<td>').appendTo(tr);
                    var name = item[i * colnum + j];
                    if (name) {
                        var bgColor;
                        if ($.inArray(name, value) >= 0) {
                            bgColor = colorMap[name];
                        }
                        else {
                            bgColor = '#eee';
                        }

                        var anchor = $('<a>').attr('data-value', name)
                            .attr('title', name)
                            .appendTo(td);
                        
                        $('<img>').attr('src', './asset/img/' + teamInfo[name]['id'] + '.png').appendTo(anchor);
                        $('<i>').css('background-color', bgColor).appendTo(anchor);
                    }
                }
            });
        });

        $('#filter').empty().append(table);
    }

    function bindEvents() {
        $('#groupDimen').mouseenter(function(e) {
            $('.filter-wrap').removeClass('region');
            $('.filter-wrap').addClass('group');
            
            fill(groupInfo);
        });

        $('#regionDimen').mouseenter(function(e) {
            $('.filter-wrap').removeClass('group');
            $('.filter-wrap').addClass('region');

            fill(regionInfo);
        });

        $('#filter').click(function(e) {
            var target = e.target;
            var tagName = target.tagName.toUpperCase();
            var selected;
            if (tagName === 'I' || tagName === 'IMG') {
                selected = $(target).parent().attr('data-value').split(',');
            }
            else if (tagName === 'A') {
                selected = $(target).attr('data-value').split(',');
            }
            else {
                return ;
            }

            setValue(selected);
        });
    }

    function setValue(change) {
        var change = change || [];

        if (change.length > 1) {
            var isAll = isAllSelected(change);
            $.each(change, function(index, item) {
                if ($.inArray(item, value) >= 0) {
                    if (isAll) {
                        value.splice($.inArray(item, value), 1);
                    }
                }
                else {
                    value.push(item);
                }
            });
        }
        else {
            if ($.inArray(change[0], value) >= 0) {
                value.splice($.inArray(change[0], value), 1);
            }
            else {
                value.push(change[0]);
            }
        }

        if ($('.filter-wrap').hasClass('group')) {
            fill(groupInfo);
        }
        else {
            fill(regionInfo);
        }
        
        rank.repaintChart(value);
    }

    function isAllSelected(selected) {
        for (var i = 0; i < selected.length; i++) {
            if ($.inArray(selected[i], value) < 0) {
                return false;
            }
        }

        return true;
    }

    return {
        init: init,
        load: load
    };
});
