'use strict';
(function () {
    app.models.SavedRecords = {
        init: function () {
            app.models.SavedRecords = (function () {
                return {
                    onShow: function (e) {
                    },
                    onHide: function () {
                    }
                };
            })();
            app.models.SavedRecords.SavedRecordsView = (function () {
                var viewModel = kendo.observable({
                    dataSource: [],
                    hasItem: false,
                    date: false,
                    count: 0,
                    lang: app.strings.en,
                  
                    
                });
                return {
                    viewModel: viewModel,
                    onShow: function () {

                        app.loader.show("Please Wait...");
                        app.db.transaction(function (tx) {
                            tx.executeSql(
                                "SELECT * FROM Record1", [],
                                function (tx, res) {
                                    var list = [];
                                    if (res.rows.length > 0) {
                                        viewModel.set('hasItem', true);
                                        for (var i = 0; i < res.rows.length; i++) {
                                            var item = res.rows.item(i);

                                            list.push(item);


                                        }
                                    } else {
                                        viewModel.set('hasItem', false);
                                    }

                                    viewModel.set("dataSource", list);
                                    app.loader.hide();
                                },
                                function (tx, err) {
                                    console.log('Issued Policy Error:  ' + err.message);
                                });
                        });
                    },
                    backbtn:function(e){
                        e.preventDefault();
                        app.mobileApp.navigate('views/Home.html');
                    },
                    onPreviewImage: function (e) {
                        app.models.SaveRecord.SaveRecordView.viewModel.RecId= e.dataItem.Id;
                        app.mobileApp.navigate('views/InvoicePhotos.html');




                    }
                    

                };
            })();
        }

    };

})();