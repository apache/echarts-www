/**
 * @file config
 * @author sushuang(sushuang@baidu.com)
 */

define(function (require) {

    // Default data
    var data = {
        panelBaseZIndex: 900000,
        panelMastOpacity: 0.7,
        winPanelAnimationDuration: 300,

        // Languages
        langDialogConfirm: '确定',
        langDialogYes: '是',
        langDialogNo: '否',
        langDialogSave: '保存',
        langDialogDontSave: '不保存',
        langDialogCancel: '取消',
        langDialogSaveFail: '保存失败',
        langDialogRemove: '删除',
        langDialogConfirmRemove: '您确认要删除吗？一旦删除，不可恢复。'
    };

    /**
     * Usage:
     * var value = config('some'); // read
     * var value = config('some', 112233); // write
     *
     * @public
     * @param {string} name
     * @param {string=} value
     * @return {*} value
     */
    function config(name, value) {
        if (arguments.length > 1) {
            data[name] = value;
        }
        return data[name];
    }

    return config;
});
