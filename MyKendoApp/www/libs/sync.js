'use strict';
(function () {
    app.sync = {
        init: function () {
            app.sync.checkforSync = function () {
                if (app.isOnline()) {
                    app.db.transaction(function (t) {
                        t.executeSql("SELECT * FROM SurveyDetails WHERE IsSaved=? AND IsSubmitted=? AND IsSynced=? AND UserId = ? AND SurveyType=?", ['Y', 'Y', false, app.user.id, 'CCE'],
                        function (transaction, result) {
                            if (result.rows.length > 0) {
                                for (var i = 0; i < result.rows.length; i++) {
                                    var SurveyType = result.rows.item(i).SurveyType;
                                    app.sync.UploadbySurveyId(result.rows.item(i).SurveyId);
                                }

                            }
                        },
                        function (transaction, err) {
                            app.error.log('Sync', 'checkForSync', 'Fetch SurveyDetails', err.message);
                        });
                    });
                }
            },
            app.sync.UploadbySurveyId = function (SurveyId) {
                var BasicData = {
                    basic: {},
                    cce: {},
                    supervisor: {},
                    other: {},
                    lstphoto: [],
                    surveyDetails: {}

                };

                app.db.transaction(function (t) {
                    t.executeSql("SELECT * FROM SurveyDetails WHERE SurveyId = ?", [SurveyId],
                    function (transaction, result) {
                        if (result.rows.length > 0) {
                            t.executeSql("SELECT * FROM BasicDetails WHERE SurveyId=?", [SurveyId],
                                function (transaction, result) {
                                    if (result.rows.length > 0) {
                                        BasicData.basic = result.rows.item(0);
                                        t.executeSql("SELECT * FROM CCEDetails WHERE SurveyId=?", [SurveyId],
                                            function (transaction, result) {
                                                if (result.rows.length > 0) {
                                                    BasicData.cce = result.rows.item(0);
                                                    t.executeSql("SELECT * FROM SupervisorDetails WHERE SurveyId=?", [SurveyId],
                                                        function (transaction, result) {
                                                            if (result.rows.length > 0) {
                                                                BasicData.supervisor = result.rows.item(0);
                                                                t.executeSql("SELECT * FROM OtherDetails WHERE SurveyId=?", [SurveyId],
                                                                    function (transaction, result) {
                                                                        if (result.rows.length > 0) {
                                                                            BasicData.other = result.rows.item(0);
                                                                            t.executeSql("SELECT * FROM Photos WHERE SurveyId = ?", [SurveyId],
                                                                            function (transaction, result) {
                                                                                if (result.rows.length > 0) {
                                                                                    for (var i = 0; i < result.rows.length; i++) {
                                                                                        var item = result.rows.item(i);
                                                                                        BasicData.lstphoto.push(item);
                                                                                    }
                                                                                    t.executeSql("SELECT * FROM SurveyDetails WHERE SurveyId = ?", [SurveyId],
                                                                                       function (transaction, result) {
                                                                                           if (result.rows.length > 0) {
                                                                                               BasicData.surveyDetails = result.rows.item(0);
                                                                                               if (app.isOnline()) {
                                                                                                   app.service.post("PostRequestData", BasicData).then(function (response) {
                                                                                                       if (response.IsSuccess) {
                                                                                                           app.sync.updatePendingSurveyDetails(true, SurveyId, 'Y');
                                                                                                       }
                                                                                                       else if (response.ErrorMessage) {
                                                                                                       }
                                                                                                   }
                                                                                                   )

                                                                                               }
                                                                                           } else {
                                                                                               alert('Survey : ' + SurveyId + ' could not be uploaded due to missing data. It has been moved to Drafts.');
                                                                                               app.sync.updatePendingSurveyDetails(false, SurveyId, 'N');
                                                                                           }
                                                                                       });
                                                                                }
                                                                                else {
                                                                                    alert('Survey : ' + SurveyId + ' could not be uploaded due to missing Photos. It has been moved to Drafts.');
                                                                                    app.sync.updatePendingSurveyDetails(false, SurveyId, 'N');
                                                                                }

                                                                                //data.photos = result.rows.item(0);;
                                                                            });
                                                                        }
                                                                        else {
                                                                            alert('Survey : ' + SurveyId + ' could not be uploaded due to missing Other Details. It has been moved to Drafts.');
                                                                            app.sync.updatePendingSurveyDetails(false, SurveyId, 'N');
                                                                        }
                                                                    },
                                                                    function (transaction, err) {
                                                                        console.log("OtherDetails Post Error : " + err);
                                                                    });
                                                            }
                                                            else {
                                                                alert('Survey : ' + SurveyId + ' could not be uploaded due to missing Supervisor Details. It has been moved to Drafts.');
                                                                app.sync.updatePendingSurveyDetails(false, SurveyId, 'N');
                                                            }
                                                        },
                                                        function (transaction, err) {
                                                            console.log("SupervisorDetails Post Error : " + err);
                                                        });
                                                }
                                                else {
                                                    alert('Survey : ' + SurveyId + ' could not be uploaded due to missing CCE Details. It has been moved to Drafts.');
                                                    app.sync.updatePendingSurveyDetails(false, SurveyId, 'N');
                                                }
                                            },
                                            function (transaction, err) {
                                                console.log("CCEDetails Post Error : " + err);
                                            });
                                    }
                                    else {
                                        alert('Survey : ' + SurveyId + ' could not be uploaded due to missing Basic Details. It has been moved to Drafts.');
                                        app.sync.updatePendingSurveyDetails(false, SurveyId, 'N');
                                    }
                                },
                                function (transaction, err) {
                                    console.log("BasicDetails Post Error : " + err);
                                });
                        }
                        else {
                            alert('Survey : ' + SurveyId + ' could not be uploaded due to missing data. It has been moved to Drafts.');
                            app.sync.updatePendingSurveyDetails(false, SurveyId, 'N');
                        }
                    },
                    function (transaction, err) {
                        console.log("SurveyDetails Post Error : " + err);
                    });
                });
            },
            app.sync.updatePendingSurveyDetails = function (isSync, SurveyId, IsSubmitted) {
                app.db.transaction(function (t) {
                    t.executeSql("Update SurveyDetails SET IsSaved=?,IsSubmitted=?,IsSynced=? where SurveyId=?", ['Y', IsSubmitted, isSync, SurveyId],
                    function (transaction, result) {
                        app.models.pendingSurveys.pendingSurveysList.onShow();
                        //app.sync.checkforSync();
                    }, function (transaction, err) {
                        console.log("Error in Updating SurveyDetails");
                    });
                });

            },
            app.sync.checkforSyncLocalizedCalamity = function () {
                if (app.isOnline()) {
                    app.db.transaction(function (t) {
                        t.executeSql("SELECT * FROM SurveyDetails WHERE IsSaved=? AND IsSubmitted=? AND IsSynced=? AND UserId = ? AND SurveyType=?", ['Y', 'Y', false, app.user.id, 'LocalizedCalamity'],
                        function (transaction, result) {
                            if (result.rows.length > 0) {
                                for (var i = 0; i < result.rows.length; i++) {
                                    var SurveyType = result.rows.item(i).SurveyType;
                                    app.sync.UploadLocalizedCalamitybySurveyId(result.rows.item(i).SurveyId);
                                }
                            }
                        },
                        function (transaction, err) {
                            app.error.log('Sync', 'checkForSync', 'Fetch LocalizedCalamity', err.message);
                        });
                    });
                }
            },
            app.sync.UploadLocalizedCalamitybySurveyId = function (SurveyId) {
                var LocalizedCalamityData = {
                    farmerbasic: {},
                    bankdetail: {},
                    SupervisorDetails: {},
                    LocalizedCalamitySurveyDetails: {},
                    lstphoto: [],
                    lcSurveyDetails: {}

                };

                app.db.transaction(function (t) {
                    t.executeSql("SELECT * FROM SurveyDetails WHERE SurveyId = ?", [SurveyId],
                    function (transaction, result) {
                        if (result.rows.length > 0) {
                            t.executeSql("SELECT * FROM FarmerDetails WHERE SurveyId=?", [SurveyId],
                                function (transaction, result) {
                                    if (result.rows.length > 0) {
                                        LocalizedCalamityData.farmerbasic = result.rows.item(0);
                                        t.executeSql("SELECT * FROM BankDetail WHERE SurveyId=?", [SurveyId],
                                            function (transaction, result) {
                                                if (result.rows.length > 0) {
                                                    LocalizedCalamityData.bankdetail = result.rows.item(0);
                                                    t.executeSql("SELECT * FROM LocalizedCalamitySurveyDetails WHERE SurveyId=?", [SurveyId],
                                                        function (transaction, result) {
                                                            if (result.rows.length > 0) {
                                                                LocalizedCalamityData.surveydetail = result.rows.item(0);
                                                                t.executeSql("SELECT * FROM SupervisorDetails WHERE SurveyId=?", [SurveyId],
                                                                    function (transaction, result) {
                                                                        if (result.rows.length > 0) {
                                                                            LocalizedCalamityData.superwiserdetails = result.rows.item(0);
                                                                            t.executeSql("SELECT * FROM Photos WHERE SurveyId = ?", [SurveyId],
                                                                                function (transaction, result) {
                                                                                    if (result.rows.length > 0) {
                                                                                        for (var i = 0; i < result.rows.length; i++) {
                                                                                            var item = result.rows.item(i);
                                                                                            LocalizedCalamityData.lstphoto.push(item);
                                                                                        }
                                                                                        t.executeSql("SELECT * FROM SurveyDetails WHERE SurveyId = ?", [SurveyId],
                                                                                               function (transaction, result) {
                                                                                                   if (result.rows.length > 0) {
                                                                                                       LocalizedCalamityData.lcSurveyDetails = result.rows.item(0);

                                                                                                       if (app.isOnline()) {
                                                                                                           app.service.post("PostLcRequestData", LocalizedCalamityData).then(function (response) {
                                                                                                               if (response.IsSuccess) {

                                                                                                                   app.sync.updateLocalizedCalamityPendingSurveyDetails(true, SurveyId, 'Y');
                                                                                                               }
                                                                                                               else if (response.ErrorMessage) {
                                                                                                                   //app.loader.hide();
                                                                                                                   //alert("Error in Submitting Data : " + response.ErrorMessage);
                                                                                                               }
                                                                                                           });
                                                                                                       }
                                                                                                   } else {
                                                                                                       alert('Crop Loss Survey : ' + SurveyId + ' could not be uploaded due to missing Data. It has been moved to Drafts.');
                                                                                                       app.sync.updateLocalizedCalamityPendingSurveyDetails(false, SurveyId, 'N');
                                                                                                   }
                                                                                               });
                                                                                    } else {
                                                                                        alert('Crop Loss Survey : ' + SurveyId + ' could not be uploaded due to missing photos. It has been moved to Drafts.');
                                                                                        app.sync.updateLocalizedCalamityPendingSurveyDetails(false, SurveyId, 'N');
                                                                                    }
                                                                                });
                                                                        } else {
                                                                            alert('Crop Loss Survey : ' + SurveyId + ' could not be uploaded due to missing Govt. Official details. It has been moved to Drafts.');
                                                                            app.sync.updateLocalizedCalamityPendingSurveyDetails(false, SurveyId, 'N');
                                                                        }
                                                                    },
                                                                    function (transaction, err) {
                                                                        console.log("OtherDetails Post Error : " + err);
                                                                    });
                                                            } else {
                                                                alert('Crop Loss Survey : ' + SurveyId + ' could not be uploaded due to missing Localized Calamity Survey details. It has been moved to Drafts.');
                                                                app.sync.updateLocalizedCalamityPendingSurveyDetails(false, SurveyId, 'N');
                                                            }
                                                        },
                                                        function (transaction, err) {
                                                            console.log("SupervisorDetails Post Error : " + err);
                                                        });
                                                } else {
                                                    alert('Crop Loss Survey : ' + SurveyId + ' could not be uploaded due to missing Bank details. It has been moved to Drafts.');
                                                    app.sync.updateLocalizedCalamityPendingSurveyDetails(false, SurveyId, 'N');
                                                }
                                            },
                                            function (transaction, err) {
                                                console.log("CCEDetails Post Error : " + err);
                                            });
                                    } else {
                                        alert('Crop Loss Survey : ' + SurveyId + ' could not be uploaded due to missing Basic details. It has been moved to Drafts.');
                                        app.sync.updateLocalizedCalamityPendingSurveyDetails(false, SurveyId, 'N');
                                    }
                                },
                                function (transaction, err) {
                                    console.log("BasicDetails Post Error : " + err);
                                });
                        }
                    },
                    function (transaction, err) {
                        console.log("LocalizedCalamitySurveySummary Post Error : " + err);
                    });
                });
            },
            app.sync.updateLocalizedCalamityPendingSurveyDetails = function (isSync, SurveyId, IsSubmitted) {
                app.db.transaction(function (t) {
                    t.executeSql("Update SurveyDetails SET IsSaved=?,IsSubmitted=?,IsSynced=? where SurveyId=?", ['Y', IsSubmitted, isSync, SurveyId],
                    function (transaction, result) {
                        app.models.Lc_pendingSurveys.pendingSurveysList.onShow();
                        //app.sync.checkforSyncLocalizedCalamity();
                    }, function (transaction, err) {
                        console.log("Error in Updating SurveyDetails");
                    });
                });
            }

            //------------------------------------------------------------------------------------------------------
            app.sync.checkforSyncCropConditionMonitoring = function () {
                if (app.isOnline()) {
                    app.db.transaction(function (t) {
                        t.executeSql("SELECT * FROM SurveyDetails WHERE IsSaved=? AND IsSubmitted=? AND IsSynced=? AND UserId = ? AND SurveyType=?", ['Y', 'Y', false, app.user.id, 'CropConditionMonitoring'],
                        function (transaction, result) {
                            if (result.rows.length > 0) {
                                for (var i = 0; i < result.rows.length; i++) {
                                    var SurveyType = result.rows.item(i).SurveyType;
                                    app.sync.UploadCropConditionMonitoringBySurveyId(result.rows.item(i).SurveyId);
                                }
                            }
                        },
                        function (transaction, err) {
                            app.error.log('Sync', 'checkForSync', 'Fetch CropConditionMonitoring', err.message);
                        });
                    });
                }
            },
           app.sync.UploadCropConditionMonitoringBySurveyId = function (SurveyId) {
               var CropConditionMonitoringData = {
                   basic: {},
                   CropConditionMonitoringSurvey: {},
                   lstphoto: [],
                   SurveyDetails: {}
               };

               app.db.transaction(function (t) {
                   t.executeSql("SELECT * FROM SurveyDetails WHERE SurveyId = ?", [SurveyId],
                   function (transaction, result) {
                       if (result.rows.length > 0) {
                           CropConditionMonitoringData.SurveyDetails = result.rows.item(0);
                           t.executeSql("SELECT * FROM BasicDetails WHERE SurveyId=?", [SurveyId],
                               function (transaction, result) {
                                   if (result.rows.length > 0) {
                                       CropConditionMonitoringData.basic = result.rows.item(0);
                                       t.executeSql("SELECT * FROM CcMonitoringSurveyDetails WHERE SurveyId=?", [SurveyId],
                                           function (transaction, result) {
                                               if (result.rows.length > 0) {
                                                   CropConditionMonitoringData.CropConditionMonitoringSurvey = result.rows.item(0);
                                                   t.executeSql("SELECT * FROM Photos WHERE SurveyId = ?", [SurveyId],
                                                function (transaction, result) {
                                                    if (result.rows.length > 0) {
                                                        for (var i = 0; i < result.rows.length; i++) {
                                                            var item = result.rows.item(i);
                                                            CropConditionMonitoringData.lstphoto.push(item);
                                                        }
                                                        //app.loader.show('Submitting Data...');
                                                        if (app.isOnline()) {
                                                            app.service.post("PostCropConditionMonitoringRequestData", CropConditionMonitoringData).then(function (response) {
                                                                if (response.IsSuccess) {
                                                                    //app.loader.hide();
                                                                    // alert("Data Submitted Successfully.");
                                                                    app.sync.updateCropConditionMonitoringPendingSurveyDetails(true, SurveyId, 'Y');;
                                                                }
                                                                else if (response.ErrorMessage) {
                                                                    //app.loader.hide();
                                                                    //alert("Error in Submitting Data : " + response.ErrorMessage);
                                                                }
                                                            });
                                                        }

                                                    } else {
                                                        alert('Crop Monitoring Survey : ' + SurveyId + ' could not be uploaded due to missing data. It has been moved to Drafts.');
                                                        app.sync.updateCropConditionMonitoringPendingSurveyDetails(false, SurveyId, 'N');
                                                    }

                                                });
                                               } else {
                                                   alert('Crop Monitoring Survey : ' + SurveyId + ' could not be uploaded due to missing CCEMonitoring Survey Detail. It has been moved to Drafts.');
                                                   app.sync.updateCropConditionMonitoringPendingSurveyDetails(false, SurveyId, 'N');
                                               }

                                           });
                                   } else {
                                       alert('Crop Monitoring Survey : ' + SurveyId + ' could not be uploaded due to missing Basic Details. It has been moved to Drafts.');
                                       app.sync.updateCropConditionMonitoringPendingSurveyDetails(false, SurveyId, 'N');
                                   }

                               });
                       }

                   });
               });
           },
           app.sync.updateCropConditionMonitoringPendingSurveyDetails = function (isSync, SurveyId, IsSubmitted) {
               app.db.transaction(function (t) {
                   t.executeSql("Update SurveyDetails SET IsSaved=?,IsSubmitted=?,IsSynced=? where SurveyId=?", ['Y', IsSubmitted, isSync, SurveyId],
                   function (transaction, result) {
                       app.models.CropConditionMonitoring_pendingSurveys.pendingSurveysList.onShow();
                       //app.sync.checkforSyncCropConditionMonitoring();
                   }, function (transaction, err) {
                       console.log("Error in Updating SurveyDetails");
                   });
               });
           }

            //------------------------------------------------------------------------------------------------------

        }
    }
})();