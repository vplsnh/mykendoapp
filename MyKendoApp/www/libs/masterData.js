'use strict';
(function () {
    app.masterData = {
        init: function () {
            app.masterData = function () {
                var downloadCropMaster = function (newUser) {
                    try {
                        app.loader.show('Downloading Master data...');
                        var CurrentVersion = window.localStorage.getItem("CurrentVersion");
                        var CredentialsString = "abc:abc:" + "G_Device#fjdslfj" + ":" + "fjdslfj" + ":" + app.user.id + ":" + app.user.deviceIMEINo + ":NoAuthRequired:" + CurrentVersion;
                        CredentialsString = $.base64.btoa(CredentialsString);
                        CredentialsString = "Basic " + CredentialsString;
                        app.service.get('GetCropMasterList', {}, CredentialsString).then(function (response) {
                            if (response.IsSuccess) {
                                app.masterData.CropMaster = response.ListOfCrop;
                                app.masterData.CropMasterLength = app.masterData.CropMaster.length;
                                app.db.transaction(function (t) {
                                    t.executeSql("DELETE FROM CropMaster", [],
                                        function (transaction, results) {
                                            app.masterData.updateCropMaster(newUser);
                                        },
                                        function (transaction, err) {
                                            alert("Error in deleting from crop master");
                                        });
                                });
                            }
                            else {
                                if (response.ErrorMessage) {
                                    alert("GetCropMasterList: " + response.ErrorMessage);
                                }
                            }
                        });
                    }
                    catch (ex) {
                        alert("GetCropMaster error : " + ex);
                    }
                };
                var updateCropMaster = function (newUser) {
                    try {
                        app.db.transaction(function (t) {
                            var Count = app.masterData.CropMaster.length;
                            while (app.masterData.CropMaster.length > 0) {
                                var row = app.masterData.CropMaster.splice(0, 1)[0];
                                t.executeSql("INSERT INTO CropMaster (Id,Name,CreatedOn,UpdatedOn,IsActive) VALUES(?,?,?,?,?)", [row.Id, row.Name, row.CreatedOn, row.UpdatedOn, row.IsActive],
                                    function (transaction, results) {
                                        Count = Count - 1;
                                        if (Count == 0) {
                                            if (newUser == 'Y') {
                                                 app.masterData.downloadDistrictMaster(newUser);
                                                //app.masterData.downloadStateMaster(newUser);
                                            } else {
                                                app.loader.hide();
                                            }
                                            window.localStorage.setItem("TotalCrop", app.masterData.CropMasterLength);
                                        }
                                        //  console.log("CropMaster Updated Successfully");
                                    },
                                    function (transaction, err) {
                                        alert("Error in Updating Crop : " + err.message);
                                    });
                            }
                        })
                    }
                    catch (ex) { alert("Update Crop Master Error : " + ex); }
                };
                var downloadDistrictMaster = function (newUser) {
                    app.loader.show('Downloading Master data...');
                    try {
                        var CurrentVersion = window.localStorage.getItem("CurrentVersion");
                        var CredentialsString = "abc:abc:" + "G_Device#fjdslfj" + ":" + "fjdslfj" + ":" + app.user.id + ":" + app.user.deviceIMEINo + ":NoAuthRequired:" + CurrentVersion;
                        CredentialsString = $.base64.btoa(CredentialsString);
                        CredentialsString = "Basic " + CredentialsString;
                        var DistrictData = {
                            UserId: app.user.id
                        }
                        app.service.post('GetDistrictMasterListbyUserId', DistrictData, CredentialsString).then(function (response) {//changed method 01.06.2018
                            if (response.IsSuccess) {
                                app.masterData.DistrictMaster = response.ListOfDistrict;
                                app.masterData.DistrictMasterLength = app.masterData.DistrictMaster.length;
                                app.db.transaction(function (t) {
                                    t.executeSql("DELETE FROM DistrictMaster", [],
                                        function (transaction, results) {
                                            app.masterData.updateDistrictMaster(newUser);
                                        },
                                        function (transaction, err) {
                                            alert("Error in deleting from district master");
                                        });
                                });
                            }
                            else {
                                if (response.ErrorMessage) {
                                    alert("GetDistrictMasterList error: " + response.ErrorMessage);
                                }
                            }
                        });
                    }
                    catch (ex) {
                        alert("GetDistrictMaster error : " + ex);
                    }
                };
                var updateDistrictMaster = function (newUser) {
                    try {
                        app.db.transaction(function (t) {
                            var Count = app.masterData.DistrictMaster.length;
                            
                            while (app.masterData.DistrictMaster.length > 0) {
                                var row = app.masterData.DistrictMaster.splice(0, 1)[0];
                                t.executeSql("INSERT INTO DistrictMaster (Id,Name,StateId,CreatedOn,UpdatedOn) VALUES(?,?,?,?,?)", [row.Id, row.Name, row.StateId, row.CreatedOn, row.UpdatedOn],
                                    function (transaction, results) {
                                        Count = Count - 1;
                                        if (Count == 0) {
                                            if (newUser == 'Y') {
                                                app.masterData.downloadStateMaster(newUser);
                                                //app.masterData.downloadTehsilMaster(newUser);
                                                
                                            } else {
                                                app.loader.hide();
                                            }

                                            window.localStorage.setItem("TotalDistrict", app.masterData.DistrictMasterLength);
                                        }
                                        // console.log("DistrictMaster Updated Successfully");
                                    },
                                    function (transaction, err) {
                                        alert("Error in Updating District : " + err.message);
                                    });
                            }
                        })
                    }
                    catch (ex) { alert("Update District Master Error : " + ex); }
                };
                var downloadStateMaster = function (newUser) {
                    app.loader.show('Downloading Master data...');
                    try {
                        var CurrentVersion = window.localStorage.getItem("CurrentVersion");
                        var CredentialsString = "abc:abc:" + "G_Device#fjdslfj" + ":" + "fjdslfj" + ":" + app.user.id + ":" + app.user.deviceIMEINo + ":NoAuthRequired:" + CurrentVersion;
                        CredentialsString = $.base64.btoa(CredentialsString);
                        CredentialsString = "Basic " + CredentialsString;
                        var StateData = {
                            UserId:app.user.id
                        }
                        //console.log(StateData);
                        app.service.post('GetStateMasterListbyUserId', StateData, CredentialsString).then(function (response) {//changing GetStateMasterList to GetStateMasterListbyUserId & state data is passed.
                           // console.log(response.ListOfState);
                            if (response.IsSuccess) {
                                app.masterData.StateMaster = response.ListOfState;
                                app.masterData.StateMasterLength = app.masterData.StateMaster.length;
                                app.db.transaction(function (t) {
                                    t.executeSql("DELETE FROM StateMaster", [],
                                        function (transaction, results) {
                                            app.masterData.updateStateMaster(newUser);
                                        },
                                        function (transaction, err) {
                                            alert("Error in deleting from state master");
                                        });
                                });
                            }
                            else {
                                if (response.ErrorMessage) {
                                    alert("GetStateMasterList: " + response.ErrorMessage);
                                }
                            } 
                        });
                    }
                    catch (ex) {
                        alert("GetStateMaster error : " + ex);
                    }
                };
                var updateStateMaster = function (newUser) {
                    try {
                        app.db.transaction(function (t) {
                            var Count = app.masterData.StateMaster.length;
                              while (app.masterData.StateMaster.length > 0) {
                                var row = app.masterData.StateMaster.splice(0, 1)[0];
                                t.executeSql("INSERT INTO StateMaster (Id,Name,CreatedOn,UpdatedOn) VALUES(?,?,?,?)", [row.Id, row.Name, row.CreatedOn, row.UpdatedOn],
                                    function (transaction, results) {
                                        Count = Count - 1;
                                        if (Count == 0) {
                                            if (newUser == 'Y') {
                                                app.masterData.downloadTehsilMaster(newUser);
                                                //app.masterData.downloadDistrictMaster(newUser);
                                            } else {
                                                app.loader.hide();
                                            }
                                            window.localStorage.setItem("TotalState", app.masterData.StateMasterLength);
                                        }
                                        console.log("StateMaster Updated Successfully");
                                    },
                                    function (transaction, err) {
                                        alert("Error in Updating State : " + err.message);
                                    });
                            }
                        })
                    }
                    catch (ex) { alert("Update State Master Error : " + ex); }
                };
                var downloadTehsilMaster = function (newUser) {
                    app.loader.show('Downloading Master data...');
                    try {
                        var CurrentVersion = window.localStorage.getItem("CurrentVersion");
                        var CredentialsString = "abc:abc:" + "G_Device#fjdslfj" + ":" + "fjdslfj" + ":" + app.user.id + ":" + app.user.deviceIMEINo + ":NoAuthRequired:" + CurrentVersion;
                        CredentialsString = $.base64.btoa(CredentialsString);
                        CredentialsString = "Basic " + CredentialsString;
                        var TehsilData = {
                            UserId: app.user.id
                        }
                        app.service.post('GetTehsilMasterListbyUserId', TehsilData, CredentialsString).then(function (response) { //changing method 
                            if (response.IsSuccess) {
                                app.masterData.TehsilMaster = response.ListOfTehsil;
                                app.masterData.TehsilMasterLength = app.masterData.TehsilMaster.length;
                                app.db.transaction(function (t) {
                                    t.executeSql("DELETE FROM TehsilMaster", [],
                                        function (transaction, results) {
                                            app.masterData.updateTehsilMaster(newUser);                                            
                                        },
                                        function (transaction, err) {
                                            alert("Error in deleting from Tehsil Master");
                                        });
                                });
                            }
                            else {
                                if (response.ErrorMessage) {
                                    alert("GetTehsilMasterList: " + response.ErrorMessage);
                                }
                            }
                        });
                    }
                    catch (ex) {
                        alert("GetTehsilMaster error : " + ex);
                    }
                };
                var updateTehsilMaster = function (newUser) {
                    try {
                        app.db.transaction(function (t) {
                            var Count = app.masterData.TehsilMaster.length;       
                            while (app.masterData.TehsilMaster.length > 0) {
                                var row = app.masterData.TehsilMaster.splice(0, 1)[0];
                                t.executeSql("INSERT INTO TehsilMaster (Id,DistrictId,Name,CreatedOn,UpdatedOn) VALUES(?,?,?,?,?)", [row.Id, row.DistrictId, row.Name, row.CreatedOn, row.UpdatedOn],
                                    function (transaction, results) {
                                        Count = Count - 1;
                                        if (Count == 0) {
                                            if (newUser == 'Y') {
                                                app.masterData.downloadGramPanchayatMaster(newUser);
                                                console.log("TM updated successfully-"+newUser);
                                            } else {
                                                app.loader.hide();
                                                console.log("TM updated successfully");
                                            }
                                            window.localStorage.setItem("TotalTehsil", app.masterData.TehsilMasterLength);
                                        }
                                        //  console.log("TehsilMaster Updated Successfully");
                                    },
                                    function (transaction, err) {
                                        alert("Error in Updating Tehsil : " + err.message);
                                    });
                            }
                        })
                    }
                    catch (ex) { alert("Update Tehsil Master Error : " + ex); }
                };
                var downloadGramPanchayatMaster = function (newUser) {
                    app.loader.show('Downloading Master data...');
                    try {
                        var CurrentVersion = window.localStorage.getItem("CurrentVersion");
                        var CredentialsString = "abc:abc:" + "G_Device#fjdslfj" + ":" + "fjdslfj" + ":" + app.user.id + ":" + app.user.deviceIMEINo + ":NoAuthRequired:" + CurrentVersion;
                        CredentialsString = $.base64.btoa(CredentialsString);
                        CredentialsString = "Basic " + CredentialsString;
                        var GramPanchayatData = {
                            UserId: app.user.id
                        }
                        app.service.post('GetGramPanchayatListbyUserId', GramPanchayatData, CredentialsString).then(function (response) {//changes to method 01.06.2018
                            if (response.IsSuccess) {
                                app.masterData.GramPanchayatMaster = response.ListOfGramPanchayat;
                                app.masterData.GramPanchayatMasterLength = app.masterData.GramPanchayatMaster.length;
                                app.db.transaction(function (t) {
                                    t.executeSql("DELETE FROM GramPanchayat", [],
                                        function (transaction, results) {
                                            app.masterData.updateGramPanchayatMaster(newUser);
                                        },
                                        function (transaction, err) {
                                            alert("Error in deleting from GramPanchayat Master");
                                        });
                                });
                            }
                            else {
                                if (response.ErrorMessage) {
                                    alert("GetGramPanchayatList: " + response.ErrorMessage);
                                }
                            }
                        });
                    }
                    catch (ex) {
                        alert("GetGramPanchayatList error : " + ex);
                    }
                };
                var updateGramPanchayatMaster = function (newUser) {
                    try {
                        app.db.transaction(function (t) {
                            var Count = app.masterData.GramPanchayatMaster.length;
                            
                            while (app.masterData.GramPanchayatMaster.length > 0) {
                                var row = app.masterData.GramPanchayatMaster.splice(0, 1)[0];
                                t.executeSql("INSERT INTO GramPanchayat (Id,RevenueCircleId,Name,CreatedOn,UpdatedOn,GrampanchayatCode) VALUES(?,?,?,?,?,?)", [row.Id, row.RevenueCircleId, row.Name, row.CreatedOn, row.UpdatedOn, row.GrampanchayatCode],//gpcode added 18.05.2018
                                    function (transaction, results) {
                                        Count = Count - 1;
                                        if (Count == 0) {
                                            if (newUser == 'Y') {
                                                app.masterData.downloadRevenueCircleMaster(newUser);
                                                console.log("GP updated successfully- " +newUser);
                                            } else {
                                                app.loader.hide();
                                                console.log("GP updated successfully");
                                            }
                                            window.localStorage.setItem("TotalGramPanchayat", app.masterData.GramPanchayatMasterLength);
                                        }
                                        // console.log("GramPanchayat Updated Successfully");
                                    },
                                    function (transaction, err) {
                                        alert("Error in Updating GramPanchayat : " + err.message);
                                    });
                            }
                        })
                    }
                    catch (ex) { alert("Update GramPanchayat Master Error : " + ex); }
                };
                var downloadRevenueCircleMaster = function (newUser) {
                    app.loader.show('Downloading Master data...');
                    try {
                        var CurrentVersion = window.localStorage.getItem("CurrentVersion");
                        var CredentialsString = "abc:abc:" + "G_Device#fjdslfj" + ":" + "fjdslfj" + ":" + app.user.id + ":" + app.user.deviceIMEINo + ":NoAuthRequired:" + CurrentVersion;
                        CredentialsString = $.base64.btoa(CredentialsString);
                        CredentialsString = "Basic " + CredentialsString;
                        var RevenueCircleData = {
                            UserId: app.user.id
                        }
                        app.service.post('GetRevenueCircleMasterListbyUserId', RevenueCircleData, CredentialsString).then(function (response) {//changes to method 01.06.2018
                            if (response.IsSuccess) {
                                app.masterData.RevenueCircleMaster = response.ListOfRevenueCircle;
                                app.masterData.RevenueCircleMasterLength = app.masterData.RevenueCircleMaster.length;
                                app.db.transaction(function (t) {
                                    t.executeSql("DELETE FROM RevenueCircleMaster", [],
                                        function (transaction, results) {
                                            app.masterData.updateRevenueCircleMaster(newUser);
                                        },
                                        function (transaction, err) {
                                            alert("Error in deleting from RevenueCircle Master");
                                        });
                                });
                            }
                            else {
                                if (response.ErrorMessage) {
                                    alert("GetRevenueCircleMasterList: " + response.ErrorMessage);
                                }
                            }
                        });
                    }
                    catch (ex) {
                        alert("GetRevenueCircleMasterList error : " + ex);
                    }
                };
                var updateRevenueCircleMaster = function (newUser) {
                    try {
                        app.db.transaction(function (t) {
                            var Count = app.masterData.RevenueCircleMaster.length;
                            
                            while (app.masterData.RevenueCircleMaster.length > 0) {
                                var row = app.masterData.RevenueCircleMaster.splice(0, 1)[0];
                                t.executeSql("INSERT INTO RevenueCircleMaster (Id,TehsilId,Name,CreatedOn,UpdatedOn) VALUES(?,?,?,?,?)", [row.Id, row.TehsilId, row.Name, row.CreatedOn, row.UpdatedOn],
                                    function (transaction, results) {
                                        Count = Count - 1;
                                        if (Count == 0) {
                                            if (newUser == 'Y') {
                                                app.masterData.downloadCropMapping(newUser);
                                                console.log("RevenueCircleMaster Updated Successfully" + newUser);
                                            } else {
                                                app.loader.hide();
                                                console.log("RevenueCircleMaster Updated Successfully" );
                                            }
                                            window.localStorage.setItem("TotalRevenueCircle", app.masterData.RevenueCircleMasterLength);
                                        }

                                        // console.log("RevenueCircleMaster Updated Successfully");
                                    },
                                    function (transaction, err) {
                                        alert("Error in Updating RevenueCircleMaster : " + err.message);
                                    });
                            }
                        })
                    }
                    catch (ex) { alert("Update RevenueCircle Master Error : " + ex); }
                };
                var downloadCropMapping = function (newUser) {
                    app.loader.show('Downloading Master data...');
                    try {
                        var CurrentVersion = window.localStorage.getItem("CurrentVersion");
                        var CredentialsString = "abc:abc:" + "G_Device#fjdslfj" + ":" + "fjdslfj" + ":" + app.user.id + ":" + app.user.deviceIMEINo + ":NoAuthRequired:" + CurrentVersion;
                        CredentialsString = $.base64.btoa(CredentialsString);
                        CredentialsString = "Basic " + CredentialsString;
                        app.service.get('GetCropMappingList', {}, CredentialsString).then(function (response) {
                            if (response.IsSuccess) {
                                app.masterData.CropMapping = response.ListOfCropMapping;
                                app.masterData.CropMappingLength = app.masterData.CropMapping.length;
                                app.db.transaction(function (t) {
                                    t.executeSql("DELETE FROM CropMapping", [],
                                        function (transaction, results) {
                                            app.masterData.updateCropMapping(newUser);
                                        },
                                        function (transaction, err) {
                                            alert("Error in deleting from Crop Mapping ");
                                        });
                                });
                            }
                            else {
                                if (response.ErrorMessage) {
                                    alert("GetCropMappingList: " + response.ErrorMessage);
                                }
                            }
                        });
                    }
                    catch (ex) {
                        alert("GetCropMAppingList error : " + ex);
                    }
                };
                var updateCropMapping = function (newUser) {
                    try {
                        app.db.transaction(function (t) {
                            var Count = app.masterData.CropMapping.length;
                            
                            while (app.masterData.CropMapping.length > 0) {
                                var row = app.masterData.CropMapping.splice(0, 1)[0];
                                t.executeSql("INSERT INTO CropMapping (Id,StateId,Season,CropId,CreatedOn,UpdatedOn) VALUES(?,?,?,?,?,?)", [row.Id,row.StateId,row.Season,row.CropId,row.CreatedOn,row.UpdatedOn],
                                    function (transaction, results) {
                                        Count = Count - 1;
                                        if (Count == 0) {
                                            if (newUser == 'Y') {
                                                app.masterData.downloadVillageMaster(newUser);
                                            } else {
                                                app.loader.hide();
                                            }
                                            window.localStorage.setItem("TotalCropMapping", app.masterData.CropMappingLength);
                                        }

                                         console.log("CropMapping Updated Successfully");
                                    },
                                    function (transaction, err) {
                                        alert("Error in Updating CropMapping : " + err.message);
                                    });
                            }
                        })
                    }
                    catch (ex) { alert("Update Crop Mapping Error : " + ex); }
                };
                //changes added18.05.2018
                var downloadVillageMaster = function (newUser) {
                    app.loader.show('Downloading Master data...');
                    try {
                        var CurrentVersion = window.localStorage.getItem("CurrentVersion");
                        var CredentialsString = "abc:abc:" + "G_Device#fjdslfj" + ":" + "fjdslfj" + ":" + app.user.id + ":" + app.user.deviceIMEINo + ":NoAuthRequired:" + CurrentVersion;
                        CredentialsString = $.base64.btoa(CredentialsString);
                        CredentialsString = "Basic " + CredentialsString;
                        var VillageData = {
                            UserId: app.user.id
                        }
                        app.service.post('GetVillageMasterListbyUserId', VillageData, CredentialsString).then(function (response) {// changes to method 01.06.2018
                            if (response.IsSuccess) {
                                app.masterData.VillageMaster = response.ListOfVillageMaster;
                                app.masterData.VillageMasterLength = app.masterData.VillageMaster.length;
                                app.db.transaction(function (t) {
                                    t.executeSql("DELETE FROM VillageMaster", [],
                                        function (transaction, results) {
                                            app.masterData.updateVillageMaster(newUser);
                                        },
                                        function (transaction, err) {
                                            alert("Error in deleting from VillageMaster ");
                                        });
                                });
                            }
                            else {
                                if (response.ErrorMessage) {
                                    alert("GetVillageMasterList: " + response.ErrorMessage);
                                }
                            }
                        });
                    }
                    catch (ex) {
                        alert("GetVillageMasterList error : " + ex);
                    }
                };
                var updateVillageMaster = function (newUser) {
                    try {
                        app.db.transaction(function (t) {
                            var Count = app.masterData.VillageMaster.length;
                            
                            var i = 1;
                            while (Count >= i) {
                                var row = app.masterData.VillageMaster.splice(0, 1)[0];                              
                                if (row != undefined) {
                                    t.executeSql("INSERT INTO VillageMaster (Id,Name,VillageCode,GramPanchayatId,CreatedOn,UpdatedOn) VALUES(?,?,?,?,?,?)", [row.Id, row.Name, row.VillageCode, row.GramPanchayatId, row.CreatedOn, row.UpdatedOn],
                                    function (transaction, results) {
                                        Count = Count - 1;
                                        if (Count == 0) {
                                            app.loader.hide();
                                            window.localStorage.setItem("TotalVillage", app.masterData.VillageMasterLength);
                                        }

                                        console.log("VillageMaster Updated Successfully");
                                    },
                                    function (transaction, err) {
                                        alert("Error in Updating VillageMaster : " + err.message);
                                    });
                                } else {  app.loader.hide(); }
                                i++;
                            }

                            if (Count == 0) { app.loader.hide(); console.log("No data for Village Master in database."); }
                        })
                    }
                    catch (ex) { alert("Update VillageMaster Error : " + ex); }
                };
                return {
                    'CropMaster': [],
                    'DistrictMaster': [],
                    'StateMaster': [],
                    'TehsilMaster': [],
                    'GramPanchayatMaster': [],
                    'RevenueCircleMaster': [],
                    'CropMapping': [],
                    'VillageMaster': [],
                    'downloadCropMaster': downloadCropMaster,
                    'updateCropMaster': updateCropMaster,
                    'downloadDistrictMaster': downloadDistrictMaster,
                    'updateDistrictMaster': updateDistrictMaster,
                    'downloadStateMaster': downloadStateMaster,
                    'updateStateMaster': updateStateMaster,
                    'downloadTehsilMaster': downloadTehsilMaster,
                    'updateTehsilMaster': updateTehsilMaster,
                    'downloadGramPanchayatMaster': downloadGramPanchayatMaster,
                    'updateGramPanchayatMaster': updateGramPanchayatMaster,
                    'downloadRevenueCircleMaster': downloadRevenueCircleMaster,
                    'updateRevenueCircleMaster': updateRevenueCircleMaster,
                    'downloadCropMapping': downloadCropMapping,
                    'updateCropMapping': updateCropMapping,
                    'downloadVillageMaster': downloadVillageMaster,
                    'updateVillageMaster':updateVillageMaster,
                    'downloadMasterData': function () {
                        app.masterData.downloadCropMaster('Y');
                        //app.masterData.downloadDistrictMaster();
                        //app.masterData.downloadStateMaster();
                        //app.masterData.downloadTehsilMaster();
                        //app.masterData.downloadGramPanchayatMaster();
                        //app.masterData.downloadRevenueCircleMaster();
                    }
                }
            }();
        }
    }
}())