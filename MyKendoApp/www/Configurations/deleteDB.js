'use strict';
(function () {
    app.deletedb = {
        init: function () {
            app.deletedb = (function () {

                if (app.config.isSimulator == true) {
                    var deletedb = null;
                    try {
                        if (app.config.isSimulator == true) {

                            deletedb = openDatabase("IFFCOTokioDB", "0.1", "A Database of ITGI CCE App", 2 * 1024 * 1024);
                        }
                        else {
                            deletedb = window.sqlitePlugin.openDatabase({
                                name: "IFFCOTokioDB",
                                location: "default"
                            });
                        }

                    } catch (err) {
                        alert(err.message);
                    }
                    if (deletedb !== null) {
                        app.deletedb = (function () {

                            deletedb.clean = function () {
                                if (!app.config.isDebugMode)
                                    return;
                                deletedb.transaction(function (t) {
                                    t.executeSql("DELETE FROM Users");                                                                 
                                   t.executeSql("DELETE FROM App_Version");
                                    t.executeSql("DELETE FROM CropMaster");
                                    t.executeSql("DELETE FROM DistrictMaster");
                                    t.executeSql("DELETE FROM SeasonMaster");
                                    t.executeSql("DELETE FROM StateMaster");
                                    t.executeSql("DELETE FROM TehsilMaster");
                                    t.executeSql("DELETE FROM GramPanchayat");
                                    t.executeSql("DELETE FROM RevenueCircleMaster");
                                    t.executeSql("DELETE FROM UserRole");
                                    t.executeSql("DELETE FROM BasicDetails");
                                    t.executeSql("DELETE FROM CCEDetails");
                                    t.executeSql("DELETE FROM OtherDetails");
                                    t.executeSql("DELETE FROM PhotoCategory");
                                    t.executeSql("DELETE FROM Photos");
                                    t.executeSql("DELETE FROM SupervisorDetails");
                                    t.executeSql("DELETE FROM SurveyDetails");
                                    t.executeSql("DELETE FROM FarmerDetails");
                                    t.executeSql("DELETE FROM LocalizedCalamitySurveyDetails");
                                    t.executeSql("DELETE FROM BankDetail");
                                    t.executeSql("DELETE FROM SurveyDetails");
                                    t.executeSql("DELETE FROM CcMonitoringSurveyDetails");
                                    t.executeSql("DELETE FROM CropMapping");
                                    localStorage.clear();
                                    alert('deleted');
                                });
                                deletedb.transaction(function (t) {
                                  t.executeSql("Drop Table IF EXISTS Users");
                                    t.executeSql("Drop Table IF EXISTS App_Version");
                                    t.executeSql("Drop Table IF EXISTS CropMaster");
                                    t.executeSql("Drop Table IF EXISTS DistrictMaster");
                                    t.executeSql("Drop Table IF EXISTS SeasonMaster");
                                    t.executeSql("Drop Table IF EXISTS StateMaster");
                                    t.executeSql("Drop Table IF EXISTS TehsilMaster");
                                    t.executeSql("Drop Table IF EXISTS UserRole");
                                    t.executeSql("Drop Table IF EXISTS BasicDetails");
                                    t.executeSql("Drop Table IF EXISTS CCEDetails");
                                    t.executeSql("Drop Table IF EXISTS OtherDetails");
                                    t.executeSql("Drop Table IF EXISTS PhotoCategory");
                                    t.executeSql("Drop Table IF EXISTS Photos");
                                    t.executeSql("Drop Table IF EXISTS SupervisorDetails");
                                    t.executeSql("Drop Table IF EXISTS SurveyDetails");
                                    t.executeSql("Drop Table IF EXISTS GramPanchayat");
                                    t.executeSql("Drop Table IF EXISTS RevenueCircleMaster");
                                    t.executeSql("Drop Table IF EXISTS FarmerDetails");
                                    t.executeSql("Drop Table IF EXISTS LocalizedCalamitySurveyDetails");
                                    t.executeSql("Drop Table IF EXISTS BankDetail");
                                    t.executeSql("Drop Table IF EXISTS SurveyDetails");
                                    t.executeSql("Drop Table IF EXISTS CcMonitoringSurveyDetails");
                                    t.executeSql("Drop Table IF EXISTS CropMapping");
                                                       
                                    alert('dropped');
                                });

                            };
                        })();


                    }
                    return deletedb;
                }
            })();

        },
    };
})();

























