'use strict';
(function () {
    app.models.pendingRecords = {
        init: function () {
            app.models.pendingRecords = (function () {
                return {
                    onShow: function (e) {
                    },
                    onHide: function () {

                    }

                };
            })();
            app.models.pendingRecords.pendingRecordsList = (function () {
                var viewModel = kendo.observable({
                    dataSource: [],
                    lang: app.strings.en
                });
                return {
                    viewModel: viewModel,
                    onShow: function () {
                       
                        app.db.transaction(function (t) {
                            t.executeSql('SELECT * FROM Record1 WHERE IsSaved=? AND IsSubmitted=? AND IsSynced=?', ['Y', 'Y', false],
                                function (transaction, results) {
                                    try {
                                        var list = [];
                                        if (results.rows.length > 0) {
                                            for (var i = 0; i < results.rows.length; i++)
                                                list.push(results.rows.item(i));
                                        }
                                        viewModel.set('dataSource', list);
                                        //viewModel.set('dataSource', kendo.data.DataSource.create({ data: list, group: "State" }));
                                    } catch (err) {
                                        console.log('Pending Surveys List', 'onShow', 'catch', err.message);
                                    }
                                },
                                function (transaction, err) {
                                    console.log('Pending Surveys List', 'onShow', 'Survey Details', err.message);
                                });
                        });
                    },
                    Upload: function () {
                      
                        if (app.isOnline()) {
                            app.sync.checkforSync();
                        } else {
                            alert("Internet not Available!");
                        }
                    },
                    onHide: function () {

                    },
                    back: function (e) {
                        e.preventDefault();
                     
                        app.mobileApp.navigate('views/Home.html');
                    }
                };
            })();

        }
    };
})();