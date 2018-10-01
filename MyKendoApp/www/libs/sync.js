'use strict';
(function () {
    app.sync = {
        init: function () {
            app.sync.checkforSync = function () {
                if (app.isOnline()) {
                    app.db.transaction(function (t) {
                        t.executeSql("SELECT * FROM Record1 WHERE IsSaved=? AND IsSubmitted=? AND IsSynced=?", ['Y', 'N', false],
                        function (transaction, result) {
                            if (result.rows.length > 0) {
                                for (var i = 0; i < result.rows.length; i++) {
                                    
                                    app.sync.UploadbyRecordId(result.rows.item(i).Id);
                                }

                            }
                        },
                        function (transaction, err) {
                            app.error.log('Sync', 'checkForSync', 'Fetch SurveyDetails', err.message);
                        });
                    });
                }
            },
            app.sync.UploadbyRecordId = function (Id) {
                var BasicData = {
                    basic: {},
                    lstphoto: []
                   
                };

                app.db.transaction(function (t) {
                    t.executeSql("SELECT * FROM Record1 WHERE Id = ?", [Id],
                         function (transaction, result) {
                             if (result.rows.length > 0)
                             {
                                 BasicData.basic = result.rows.item(0);
                                 t.executeSql("SELECT * FROM Photos WHERE Id=?", [Id],
                                     function (transaction, result) {
                                         if (result.rows.length > 0) {
                                             for (var i = 0; i < result.rows.length; i++) {
                                                 var item = result.rows.item(i);
                                                 BasicData.lstphoto.push(item);
                                             }
                                             if (app.isOnline()) {
                                                 app.service.post("PostRequestData", BasicData).then(function (response) {
                                                     if (response.IsSuccess) {
                                                         app.sync.updatePendingRecordDetails(true, Id, 'Y');
                                                     }
                                                     else if (response.Error) {

                                                     }
                                                     } )

                                             }

                                         }

                                     },
                                     function (transaction, error) {

                                     }

                            );
                                 }
                             else{

                             }
                         },
                    function (transaction, error) {
                        alert("error"+error.message);
                    }
                   
                  );
                
                });
            },
            app.sync.updatePendingRecordDetails = function (isSync, Id, IsSubmitted) {
                app.db.transaction(function (t) {
                    t.executeSql("Update SurveyDetails SET IsSaved=?,IsSubmitted=?,IsSynced=? where SurveyId=?", ['Y', IsSubmitted, isSync, Id],
                    function (transaction, result) {
                        app.models.pendingRecords.pendingRecordsList.onShow();
                        //app.sync.checkforSync();
                    }, function (transaction, err) {
                        console.log("Error in Updating RecordDetails");
                    });
                });

            }
         
        
            //------------------------------------------------------------------------------------------------------

        }
    }
})();