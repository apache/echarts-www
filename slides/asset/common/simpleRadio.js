define(function (require) {

    var CSS_BASE = 'simple-radio-item';
    var CSS_SELECTED = CSS_BASE + '-selected';

    /**
     * @param  {HTMLElement} containerEl
     * @param  {Array.<Object>} dataList like: [{value: 'asdf', text: 'some', selected: 1}, ...]
     * @param  {Function} onChange
     */
    function init(containerEl, dataList, onChange) {
        var html = [];
        dataList.forEach(function (item, index) {
            var css = (item.selected ? CSS_SELECTED : '') + ' ' + CSS_BASE;
            html.push(
                '<label class="', css, '">', encodeHTML(item.text), '</label>'
            );
        });

        containerEl.innerHTML = html.join('');

        // Add event handlers.
        var labels = containerEl.querySelectorAll('label');
        for (var i = 0; i < labels.length; i++) {
            var label = labels[i];
            label.onclick = onClick.bind(label, labels, onChange, dataList[i]);
        }
    }

    function onClick(labels, onChange, dataItem) {
        var el = this;

        for (var i = 0; i < labels.length; i++) {
            labels[i].classList.remove(CSS_SELECTED);
        }

        el.classList.add(CSS_SELECTED);

        if (onChange) {
            onChange(dataItem.value, dataItem.text, dataItem);
        }
    }

    function encodeHTML(source) {
        return source == null
            ? ''
            : String(source)
                .replace(/&/g, '&amp;')
                .replace(/</g, '&lt;')
                .replace(/>/g, '&gt;')
                .replace(/"/g, '&quot;')
                .replace(/'/g, '&#39;');
    }

    return {
        init: init
    };

});