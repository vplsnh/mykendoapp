'use strict';
(function () {
    app.error = (function () {
        var log = function (page, method, process, error) {
           // app.loader.hide();
           // app.sync.isSingleSync = true;
            if (page == 'service')
                customAlert(app.alertMessage.serviceConnectionFail);
            else {
                if(app.config.isDebugMode)
                    customAlert(page + '>' + method + '>' + process + '>' + error);
            }
            app.db.transaction(function (t) {
                t.executeSql("INSERT INTO ErrorLog (Page, Method, Process, ErrorMessage, CreatedOn) VALUES (?,?,?,?,?)",
                    [page, method, process, error, FormatDate(app.config.dateTimeFormatForDB)],
                    function (transsaction, result) {
                    },
                    function (transaction, result) {
                    });
            });
        };
        var onShow = function () {
            app.db.transaction(function (t) {
                t.executeSql("SELECT * FROM ErrorLog",[],
                    function (transsaction, result) {
                        if (result.rows.length > 0) {
                            app.error.errorList = [];
                            for (var i = 0; i < result.rows.length; i++) {
                                app.error.errorList.push(result.rows.item(i));
                            }
                        }
                    },
                    function (transaction, result) {
                    });
            });
        };
        return {
            'errorList':[],
            'log': log,
            'onShow': onShow
        }
    })();
})();