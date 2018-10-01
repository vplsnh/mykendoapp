'use strict';
(function () {
    app.models.draftRecords = {
        init: function () {
            app.models.draftRecords = (function () {
                return {
                    onShow: function (e) {
                    },
                    onHide: function () {

                    }

                };
            })();
            app.models.draftRecords.draftRecordsList = (function () {
                var viewModel = kendo.observable({
                    dataSource: [],
                    directedFromDraft: '',
                    lang:app.strings.en,
                  

                });
                return {
                    viewModel: viewModel,
                    onShow: function () {

                       
                        app.db.transaction(function (t) {
                            t.executeSql('SELECT * FROM Record1 WHERE IsSaved=? AND IsSubmitted=?', ['Y', 'N'],
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
                                        console.log('Pending Records List', 'onShow', 'catch', err.message);
                                    }
                                },
                                function (transaction, err) {
                                    console.log('Pending Records List', 'onShow', 'Survey Details', err.message);
                                });
                        });
                    },
                    itemClick: function (e) {
                        app.record.id = e.dataItem.Id;
                        //app.models.SaveRecord.SaveRecordView.viewModel.set('saverec.Name',e.dataItem.Name);
                        //app.models.SaveRecord.SaveRecordView.viewModel.set('saverec.address1', e.dataItem.address1);
                        //app.models.SaveRecord.SaveRecordView.viewModel.set('saverec.address2', e.dataItem.address2);
                      //  app.models.SaveRecord.SaveRecordView.viewModel.call(e);
                         




                        app.state.previousPage = '';
                        viewModel.set('directedFromDraft', 'Draft');
                        app.mobileApp.navigate('views/SaveRecord.html');
                      
                         
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