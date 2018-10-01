function hideCollapsibleContent(parent) {
    /// <summary>This function is used to resolve issue of collapsible data on android 4.2.x and 4.3.x</summary>
    /// <param name="parent" type="dom object">parent dom of collapsible dom object</param>
    if (os.android && (os.flatVersion.substring(0, 2) == '42' || os.flatVersion.substring(0, 2) == '43')) {
        if ($(parent).hasClass('km-collapsed'))
            $(parent).find('div[data-role="collapsible-content"]').hide();
    }
}
function GetNewFileName() {
    /// <summary>This function is used for generating unique file name for document photo and crash photos</summary>
    /// <returns type="String">Unique file name.</returns>
    var fileName = "";
    fileName = app.user.id + "_";
    var date = new Date();
    var components = [
        date.getYear(),
        date.getMonth(),
        date.getDate(),
        date.getHours(),
        date.getMinutes(),
        date.getSeconds(),
        date.getMilliseconds()
    ];

    fileName += components.join("");
    return fileName + ".jpg";
}
var FormatDate = function date2str(x, y) {
    /// <summary>This function is to get date or datetime in a format.</summary>
    /// <param name="x" type="String">date or datetime format to get in return ('MM/dd/yyyy hh:mm:ss').</param>
    /// <param name="y" type="Date">(Optional) Date object</param>
    /// <returns type="String">Formated Date/Datetime String.</returns>
    if (y == "Invalid Date") {
        return "";
    }
    var month = new Array();
    month[0] = "JAN";
    month[1] = "FEB";
    month[2] = "MAR";
    month[3] = "APR";
    month[4] = "MAY";
    month[5] = "JUN";
    month[6] = "JUL";
    month[7] = "AUG";
    month[8] = "SEP";
    month[9] = "OCT";
    month[10] = "NOV";
    month[11] = "DEC";

    if (y === undefined)
        y = new Date();
    var z = {
        a: month[y.getMonth()],
        M: y.getMonth() + 1,
        d: y.getDate(),
        h: y.getHours(),
        m: y.getMinutes(),
        s: y.getSeconds()
    };
    var prim = '';
    if (x.indexOf(':') != -1) {
        prim = ' AM';
        if (z.h >= 12) {
            prim = ' PM';
            if (z.h > 12)
                z.h -= 12;
        }
    }

    x = x.replace(/(a+|M+|d+|h+|m+|s+)/g, function (v) {
        if (v.indexOf('a') != -1)
            return (eval('z.' + v.slice(-1))); //.slice(-2)
        else
            return ((v.length > 1 ? "0" : "") + eval('z.' + v.slice(-1))).slice(-2)
    });
    x = x.replace(/(MMM+)/g, function (v) {
        if (v.indexOf('a') != -1)
            return (eval('z.' + v.slice(-1))); //.slice(-2)
        else
            return ((v.length > 1 ? "0" : "") + eval('z.' + v.slice(-1))).slice(-2)
    });

    x = x.replace(/(y+)/g, function (v) {
        return y.getFullYear().toString().slice(-v.length)
    });

    return x + prim;
}
function rtoStatemenu(id) {
    var stateNamelist = [];
    var stateIdlist = [];
    var stateOptions = "<option selected='selected' disabled='disabled' value=''>Select State...</option>";
    app.db.transaction(function (tx) {
        tx.executeSql("SELECT StateName,StateId FROM 'StateMaster' ORDER BY StateName", [],
            function (transaction, results) {
                if (results.rows.length > 0) {
                    for (var i = 0; i < results.rows.length; i++) {
                        stateNamelist.push(results.rows.item(i).StateName);
                        stateIdlist.push(results.rows.item(i).StateId);
                        stateOptions += "<option value='" + stateIdlist[i] + "'>" + stateNamelist[i] + "</option>";
                    }
                    document.getElementById(id).innerHTML = stateOptions;

                    if (app.models.SaveRecord.SaveRecordView.viewModel.saverec.state != "") {
                        if (id == "vdRegistrationState") {
                            $("#" + id).val(app.models.SaveRecord.SaveRecordView.viewModel.saverec.state);
                            rtoCitymenu(app.models.SaveRecord.SaveRecordView.viewModel.saverec.state, 'vdRegistrationCity', 0);
                        } else if (id == "previousPolicyState") {
                            $("#" + id).val(app.models.TwoWheeler.twpPreviousPolicyDetailsView.viewModel.twpPreviousPolicyDetails.State);
                            rtoCitymenu(app.models.TwoWheeler.twpPreviousPolicyDetailsView.viewModel.twpPreviousPolicyDetails.State, 'previousPolicyCity', 0);
                        } else {
                            $("#" + id).val(app.models.TwoWheeler.quoteRequestView.viewModel.twpQuote.RegistrationState);
                            rtoCitymenu(app.models.TwoWheeler.quoteRequestView.viewModel.twpQuote.RegistrationState, 'twpregistrationCity', 0);
                        }
                    }
                }
            },
            function (transaction, error) {
                customAlert("error" + error.message)
            });
    });
}
function rtoCitymenu(value, Cid, index) {
    // customAlert(value);


    var cityNamelist = [];
    var cityIdlist = [];
    var rtocityOptions = "<option selected='selected' disabled='disabled' value=''>Select City...</option>";

    app.db.transaction(function (tx) {

        tx.executeSql("SELECT CityName,CityId FROM 'RTOCityMaster' WHERE StateId='" + value + "'ORDER BY CityName", [],
            function (transaction, results) {
                if (results.rows.length > 0) {
                    for (var i = 0; i < results.rows.length; i++) {
                        cityNamelist.push(results.rows.item(i).CityName);
                        cityIdlist.push(results.rows.item(i).CityId);
                        rtocityOptions += "<option value='" + cityIdlist[i] + "'>" + cityNamelist[i] + "</option>";

                    } //for
                    document.getElementById(Cid).innerHTML = rtocityOptions;
                    if (Cid == "vdRegistrationCity") {
                        if (app.models.SaveRecord.SaveRecordView.viewModel.saverec.city != "") {
                            $("#" + Cid).val(app.models.SaveRecord.SaveRecordView.viewModel.saverec.city);
                        }
                    } else if (Cid == "previousPolicyCity") {
                        if (app.models.SaveRecord.SaveRecordView.viewModel.saverec.cityy != "") {
                            $("#" + Cid).val(app.models.SaveRecord.SaveRecordView.viewModel.saverec.city);
                        }
                    } else {
                        if (app.models.SaveRecord.SaveRecordView.viewModel.saverec.city) {
                            $("#" + Cid).val(app.models.SaveRecord.SaveRecordView.viewModel.saverec.city);

                        }
                    }
                } //if              
            },
            function (transaction, error) {
                customAlert("error" + error.message)
            });
    });
} //if
//RTOCITYMENU
function menu(id) {
    var list1 = [];
    var list2 = [];
    var def = "DEF";
    var stateOptions = "<option selected='selected' disabled='disabled'>Select State...</option>";
    app.db.transaction(function (tx) {
        tx.executeSql("SELECT StateName,StateCode FROM 'StateMaster' ORDER BY StateName", [],
            function (transaction, results) {
                if (results.rows.length > 0) {
                    for (var i = 0; i < results.rows.length; i++) {
                        list1.push(results.rows.item(i).StateName);
                        list2.push(results.rows.item(i).StateCode);
                        stateOptions += "<option value=" + list2[i] + ">" + list1[i] + "</option>";
                    }
                    document.getElementById(id).innerHTML = stateOptions;
                 
                }
            },
            function (transaction, error) {
                customAlert("error" + error.message)
            });
    });

    //menu
} //menu
function makeSubmenu(value, Cid, index) {
    //alert(value);


    var list = [];
    var cityOptions = "<option selected='selected' disabled='disabled' value='Select City...'>Select City...</option>";

    app.db.transaction(function (tx) {

        tx.executeSql("SELECT CityDesc,CityCode FROM 'CityMaster' WHERE StateCode='" + value + "'ORDER BY CityDesc", [],
            function (transaction, results) {
                if (results.rows.length > 0) {
                    for (var i = 0; i < results.rows.length; i++) {
                        list.push(results.rows.item(i).CityDesc);
                        cityOptions += "<option>" + list[i] + "</option>";

                    } 
                    document.getElementById(Cid).innerHTML = cityOptions;
                   
                } 
            },
            function (transaction, error) {
                customAlert("error" + error.message)
            });
    });
  
} //if id is stateT1
//makesubmenu
function GetProgressPercent(total, completed) {
    /// <summary>To calculate completed percentage.</summary>
    /// <param name="total" type="Number">Total number.</param>
    /// <param name="completed" type="Number">Completed number out of total number.</param>
    /// <returns type="Number">Completed percentage.</returns>
    if (total == 0 && completed == 0)
        return 0;
    var perc = parseInt((completed * 100) / total);

    if (perc >= 100) {
        perc = 100;
    }
    return perc;
}

function setDatePicker(id, startYear, endYear) {
    /// <summary>To apply date picker on input control.</summary>
    /// <param name="id" type="String">Input control id.</param>
    /// <param name="startYear" type="Number">From year.</param>
    /// <param name="endYear" type="Number">To year.</param>

    var yrRange = '2016:2056';
    var dateToday = new Date();
    if (startYear != undefined && startYear != null && endYear != undefined && endYear != null)
        yrRange = startYear + ':' + endYear; //(dateToday.getFullYear()-10) + ":" + (dateToday.getFullYear() + 40);

    $("#" + id).datepicker({
        "dateFormat": 'dd/mm/yy',
        changeMonth: true,
        changeYear: true,
        yearRange: yrRange
    });
}

function dataURIToBlob(b64Data, contentType, sliceSize) {
    /// <summary>To convert base64 into blob object.</summary>
    /// <param name="b64Data" type="String">Base64 string with MIME type.</param>
    /// <param name="contentType" type="String">MIME Type (Optional).</param>
    /// <param name="sliceSize" type="String">Slice Size (Optional).</param>
    /// <returns type="Object">Blob Object or null if invalid base64</returns>    
    var blob = null;
    try {
        contentType = contentType || b64Data.split(',')[0].split(':')[1].split(';')[0];
        sliceSize = sliceSize || 512;
        b64Data = b64Data.split(',')[1];
        var byteCharacters = atob(b64Data);

        var len = byteCharacters.length;
        var byteArrays = new Uint8Array(len);
        for (var i = 0; i < len; i++) {
            byteArrays[i] = byteCharacters.charCodeAt(i);
        }

        try {
            blob = new Blob([byteArrays.buffer], {
                type: contentType
            });
        } catch (e) {
            window.BlobBuilder = window.BlobBuilder || window.WebKitBlobBuilder || window.MozBlobBuilder || window.MSBlobBuilder;
            if (e.name == 'TypeError' && window.BlobBuilder) {
                var bb = new BlobBuilder();
                bb.append(byteArrays.buffer);

                blob = bb.getBlob(contentType);
            } else if (e.name == "InvalidStateError") {
                // InvalidStateError FF13 WinXP
                blob = new Blob([byteArrays.buffer], {
                    type: contentType
                });
            } else {
                // We're screwed, blob constructor unsupported entirely 
            }
        }

    } catch (err) {
        //alert('In blob err: '+err.message);
    }
    return blob;
}
function isBase64(str) {
    /// <summary>To validate correct base64 string.</summary>
    /// <param name="str" type="String">Base64 string without MIME type.</param>
    /// <returns type="Boolean">True or False</returns>    
    try {
        if (str != "")
            return btoa(atob(str)) == str;
        else
            return false;
    } catch (err) {
        return false;
    }
}
function crossCheckFile(fileURL, callBack) {
    /// <summary>To cross check created file is valid.</summary>
    /// <param name="fileURL" type="String">File URL</param>
    /// <param name="callBack" type="Function">callback function which will be called after cross check complete.</param>

    window.resolveLocalFileSystemURL(fileURL,
        // success callback; generates the FileEntry object needed to convert to Base64 string
        function (fileEntry) {
            // convert to Base64 string
            function win(file) {
                var reader = new FileReader();
                reader.onloadend = function (evt) {
                    var result = evt.target.result;
                    //alert('file size on sync: '+(row.FileBase64.length/1024));
                    var b64Data = result.split(',')[1];
                    if (isBase64(b64Data))
                        callBack(fileURL);
                    else {
                        fileEntry.remove();
                        callBack('');
                    }
                };
                reader.readAsDataURL(file);
            };
            var fail = function (evt) { //file entry failed

            };
            fileEntry.file(win, fail);
        },
        // error callback
        function () {
            //marking as deleted because not found in file system
            // alert('cross check: file not found');
        }
    );
}

function saveFile(docObj, callBack) {
    /// <summary>To save file in persistent location.</summary>
    /// <param name="docObj" type="Object">File Object which has properties (FileName, FileBase64)</param>
    /// <param name="callBack" type="Function">callback function which will be called after operation complete.</param>

    try {
        var fileName = docObj.FileName.split('.')[0] + '.txt';
        if (os.wp)
            fileName = docObj.FileName;
        window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function (fileSystem) {
            fileSystem.root.getDirectory("CCEApp", {
                create: true
            }, function (dirEntry) {
                dirEntry.getDirectory(app.survey.id, { create: true }, function (subDirEntry) {
                    subDirEntry.getFile(fileName, {
                        create: true,
                        exclusive: true
                    }, function (fileEntry) {
                        //write file
                        fileEntry.createWriter(function (fileWriter) {
                            fileWriter.onwriteend = function (e) {
                                //alert('Write completed.');
                                //callBack(fileEntry.nativeURL);
                                crossCheckFile(fileEntry.nativeURL, callBack);
                            };

                            fileWriter.onerror = function (e) {
                                alert('Write failed: ' + e.toString());
                            };
                            try {
                                fileWriter.write(dataURIToBlob(docObj.FileBase64));
                            } catch (err) {
                                alert(err);
                            }
                        }, function (error) {
                            alert("write file ERROR: " + error.code)
                        });
                    }, function (error) {
                        alert("get file ERROR: " + error.code)
                    });
                }, function (error) {
                    alert("request sub dir ERROR: " + error.code)
                });

            }, function (error) {
                alert("request dir ERROR: " + error.code)
            });
        }, function (error) {
            alert("request file ERROR: " + error.code)
        });
    } catch (err) {
        alert('cordova file: ' + err.message);
    }
}

function removeDirectory(dirName) {
    /// <summary>To delete directory and its containing files.</summary>
    /// <param name="dirName" type="String">Dircetory Name (which is sub directory of SurveyorApp and the directory name is appraisal job id.)</param>
    window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function (fileSystem) {
        fileSystem.root.getDirectory("SurveyorApp", {
            create: false
        }, function (dirEntry) {
            dirEntry.getDirectory(dirName, { create: false }, function (subDirEntry) {
                subDirEntry.removeRecursively(function () {
                    //alert('removed successfully');
                }, function (error) {
                    //alert('dir remove err: '+error);
                });
            }, function (error) {
                //customAlert("request sub dir ERROR: " + error.code)
            });
        }, function (error) {
            //customAlert("request dir ERROR: " + error.code)
        });
    }, function (error) {
        //customAlert("request file ERROR: " + error.code)
    });
}

function removeFile(fileURL) {
    /// <summary>To delete file from file system.</summary>
    /// <param name="fileURL" type="String">File URL</param>
    window.resolveLocalFileSystemURL(fileURL, function (fileEntry) {
        fileEntry.remove(function () {
            //alert('file remove success');
        }, function (err) {
            //alert('file remove error: '+err)
        });
    }, function (error) {
        //alert('remove file error: '+error);
    });
}

function addwatermark(ctx, tempImg, targetWidth, targetHeight, calledBy) {
    if (calledBy == "photos")
        var photocapturedfromcamera = app.models.Photo.PhotoView.viewModel.isPhotoCapturedFromCamera;

    ctx.font = '16px sans-serif';
    var date = new Date();
    var day = date.getDate();
    if (day < 10) {
        day = '0' + day;
    }
    var month = date.getMonth() + 1;
    if (month < 10) {
        month = '0' + month;
    }
    var year = date.getFullYear();
    var hours = date.getHours();
    time = date.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', seconds: 'numeric', hour12: true });
    if (hours < 10) {
        hours = '0' + hours;
    }
    var minutes = date.getMinutes();
    if (minutes < 10) {
        minutes = '0' + minutes;
    }
    var seconds = date.getSeconds();
    if (seconds < 10) {
        seconds = '0' + seconds;
    }

    var timestamp = day + '/' + month + '/' + year + '  ' + time + '  ';
    var latlong = app.locationDetails.latitude +' , '+  app.locationDetails.longitude+' ';
    var lat = 'Lat: ' + kendo.toString(app.locationDetails.latitude, 'n5') + '  ';
    var long = 'Long: ' + kendo.toString(app.locationDetails.longitude, 'n5') + '  ';
    var accuracy = 'Acc: ' + kendo.toString(app.locationDetails.accuracy, "00.00") + ' m  ';
    var textWidth = ctx.measureText(timestamp).width;

    ctx.globalCompositeOperation = 'source-over:';
    ctx.fillStyle = '#ffffff';
    if (photocapturedfromcamera == true) {
        ctx.font = '16px sans-serif';
        ctx.textAlign = "left";
        ctx.textBaseline = "bottom";
        
        var IsGPSNeeded =app.models.Photo.PhotoView.viewModel.get('isGPSNeeded');
        if (IsGPSNeeded == true) {
            //ctx.fillText(timestamp, targetWidth, targetHeight - 72);
            //ctx.fillText(lat, targetWidth, targetHeight - 48);
            //ctx.fillText(long, targetWidth, targetHeight - 24);
            //ctx.fillText(accuracy, targetWidth, targetHeight);
            // ctx.textAlign = "left";
           // ctx.fillText(latlong, targetWidth, targetHeight - 48);
            ctx.fillText(latlong + accuracy, 5, targetHeight - 24);
           // ctx.textAlign = "right";
            ctx.fillText(timestamp, 5 , targetHeight);
        } else {
            ctx.fillText(timestamp, 5, targetHeight);
        }

    }
}



//added as per CR(datetime as watermark)

var customConfirmBox = function (message, callBackFunction) {
    /// <summary>This function is to show custom confirm box with some customized behaviour</summary>
    if (typeof callBackFunction == 'function') {
        if (navigator.notification != undefined && navigator.notification != null) {
            navigator.notification.confirm(
                message, // message
                callBackFunction, // callback to invoke with index of button pressed
                'Confirm', // title
                ['Ok', 'Cancel'] // buttonLabels
            );
        } else {
            if (confirm(message))
                callBackFunction(1);
            else
                callBackFunction(2);
        }
    }
}

var cleanModelData = function () {
    
    clearCCEModel();
    clearLocalizedCalamityModel();
    clearCropConditionMonitoringModel();
}
var clearCCEModel = function () {
    app.models.home.onShow();
    app.models.CCESurvey.CCEDetailsView.viewModel.set('CCEDetails', {
        RandomNo: "",
        CCESize: "",
        CCEShape: "",
        BiomassWeight: "",
        GrainWetWeight: "",
        GrainDryWeight: "",
        GrainMoisture: "",
        Latitude: "",
        Longitude: "",
        Accuracy: "",
        somethingChanged: false
    });
    app.models.CCESurvey.BasicDetailsView.viewModel.set('BasicDetails', {
        Year: "",
        Season: "",
        Crop: "",
        State: "",
        District: "",
        Tehsil: "",
        Block: "",
        NyayPanchayat: "",
        Grampanchayat: "",
        Village: "",
        Latitude: "",
        Longitude: "",
        Accuracy: "",
        somethingChanged: false
    });
    app.models.CCESurvey.SupervisorDetailsView.viewModel.set('SupervisorDetails',
        {
            Name: "",
            MobileNo: "",
            Designation: "0",
            somethingChanged: false
        });
    app.models.CCESurvey.OtherDetailsView.viewModel.set('OtherDetails',
        {
            FieldCropCondition: "",
            VillageCropCondition: "",
            CropType: "",
            CCE: "",
            Other: "",
            PlotIrrigated: "",
            stress: "",
            Comments: "",
            somethingChanged: false
        });
    app.models.CCESurvey.viewModel.set('dierctedFrom', 'home');
    app.models.CCESurvey.viewModel.set('surveyPlace', {
        StateName: "",
        DistrictName: "",
        TehsilName: "",
        NyayPanchayat: ""
    });

    /** Not In Use***/
    app.models.CCESurvey.viewModel.set('locationDetails', {
        latitude: "",
        longitude: "",
        accuracy: ""
    });
    /**x-x-x-x**/
    app.models.Photo.PhotoView.clearPhotos();

    app.state.previousPage = '';
}
var clearLocalizedCalamityModel = function () {

    app.models.LcSurveys.ClearScreen();
    app.models.LcSurveys.viewModel.set('surveyPlace', {
            StateName: "",
            DistrictName: "",
            TehsilName: "",
            NyayPanchayat: "",
            FarmerName: ""
    });
    app.models.LocalizedCalamitySurvey.viewModel.set('PositionOn',{
        Latitude: '',
        Longitude: '',
        Accuracy: ''
    }); 
}
var clearCropConditionMonitoringModel = function () {
    app.models.CropConditionMonitoring.ClearScreen();
    app.models.CropConditionMonitoring.viewModel.set( 'monitoringPlace', {
        StateName: "",
        DistrictName: "",
        TehsilName: "",
        NyayPanchayat: ""
    })

    app.models.CropConditionMonitoringBasicDetails.viewModel.set('PositionOn', {
        Latitude: '',
        Longitude: '',
        Accuracy: ''
    });
}

var customAlert = function (message, hideLoader) {
    if (hideLoader == undefined)
        hideLoader = true;
    if (hideLoader)
        //  app.loader.hide();
        if (message != 'no') {
            if (navigator.notification != undefined && navigator.notification != null)
                navigator.notification.alert(message, null, 'Message', 'OK');
            else
                alert(message);
        }
}
var customContinueConfirmBox = function (message, callBackFunction) {
    if (typeof callBackFunction == 'function') {
        if (navigator.notification != undefined && navigator.notification != null) {
            navigator.notification.confirm(
                message, // message
                callBackFunction, // callback to invoke with index of button pressed
                'Confirm', // title
                ['OK'] // buttonLabels
            );
        } else {
            if (confirm(message))
                callBackFunction(1);
        }
    }

}

var onSubmitConfirmBox = function (message, callBackFunction) {
    if (typeof callBackFunction == 'function') {
        if (navigator.notification != undefined && navigator.notification != null) {
            navigator.notification.confirm(
                message, // message
                callBackFunction, // callback to invoke with index of button pressed
                'Confirm', // title
                ['Cancel','Submit'] // buttonLabels
            );
        } else {
            if (confirm(message))
                callBackFunction(1);
        }
    }

}
