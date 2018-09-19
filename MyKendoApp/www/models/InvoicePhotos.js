'use strict';
(function () {
    app.models.InvoicePhotos = {
        init: function () {
            app.models.InvoicePhotos = (function () {
                return {
                    onShow: function (e) {
                    },
                    onHide: function () {
                    }
                };
            })();
            app.models.InvoicePhotos.InvoicePhotosView = (function () {
                var viewModel = kendo.observable({
                    dataSource1: [],
                    dataSource2: [],
                    lang: app.strings.en
                  
                    
                    });
                return {
                    viewModel: viewModel,
                   
                    onPreviewImage: function (e) {

                        var FileBase64 = e.data.FileBase64;
                        
                        app.models.InvoicePhotos.InvoicePhotosPreview.viewModel.set("resizeImage.FileBase64", FileBase64);
                        app.mobileApp.navigate('views/ImagePreview.html');
                    },
                    onShow: function () {
                        
                        app.db.transaction(function (t) {
                            t.executeSql("SELECT * FROM Photos WHERE Id=? AND CategoryId=?", [app.models.SaveRecord.SaveRecordView.viewModel.RecId,1],
                                function (transaction, results) {
                                    var list = [];
                                    if (results.rows.length > 0) {
                                        for (var i = 0; i < results.rows.length; i++) {
                                            list.push(results.rows.item(i));
                                        }
                                    }
                                    viewModel.set('dataSource1', list);


                                },
                                function (transaction, err) {
                                    console.log("Error" + err.messsage);
                                });
                            t.executeSql("SELECT * FROM Photos WHERE Id=? AND CategoryId=?", [app.models.SaveRecord.SaveRecordView.viewModel.RecId, 2],
                              function (transaction, results) {
                                  var list = [];
                                  if (results.rows.length > 0) {
                                      for (var i = 0; i < results.rows.length; i++) {
                                          list.push(results.rows.item(i));
                                      }
                                  }
                                  viewModel.set('dataSource2', list);


                              },
                              function (transaction, err) {
                                  console.log("Error" + err.messsage);
                              });
                            

                        });
                    },
                    backbtn: function (e) {
                        e.preventDefault();
                        app.mobileApp.navigate('views/SavedRecords.html');

                    }
              };
            })();
            app.models.InvoicePhotos.InvoicePhotosPreview = (function () {

                var viewModel = kendo.observable({
                    resizeImage: {}
                });
                var onShow = function () {
                    app.state.previousPage = 'Preview';
                };
                return {
                    onShow: onShow,
                    viewModel: viewModel
                };
            })();
        }

    };

})();