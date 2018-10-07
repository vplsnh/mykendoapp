'use strict';

(function () {
    app.models.SaveRecord = {
        init: function () {
          app.models.SaveRecord = (function () {
                return {
                    onShow: function () {
                    },
                    onHide: function () {
                    }

                };
            })();
           
            app.models.SaveRecord.SaveRecordView = (function () {
                var viewModel = kendo.observable({
                    directedfrom:'home',
                    saverec: {
                        Name: "",
                        address1: "",
                        address2:"",
                        invno: "",
                        mobileno: "",
                        emailid: "",
                        pincode: "",
                        statet1: "Select State..",
                        cityt1: "Select City..",
                        invdate:"",
                        validatePincode:false,
                        amount: "",
                        jewellerytype: "",
                        jamount:""


                        
                    },
                    RecId:"",
                    invpic: [],
                    ornpic: [],
                    invoice: "",
                    ornament: "",
                    pictype: "",
                    lang: app.strings.en,
                    nextrecordid: function () {
                        var currentdate = new Date();
                        app.models.SaveRecord.SaveRecordView.viewModel.RecId = "vipul" + ("0" + currentdate.getDate()).slice(-2) + '' + ("0" + (currentdate.getMonth() + 1)).slice(-2) + '' + currentdate.getFullYear()
                                    + '' + ("0" + currentdate.getHours()).slice(-2) + '' + ("0" + currentdate.getMinutes()).slice(-2) + '' + ("0" + currentdate.getSeconds()).slice(-2);
                        
                    },
                    onPreviewImage: function () {
                        
                        var FileBase64 = app.models.SaveRecord.SaveRecordView.viewModel.invpic[0].FileBase64;

                        app.models.SaveRecord.SaveRecordPreview.viewModel.set("resizeImage.FileBase64", FileBase64);
                        app.mobileApp.navigate('views/ImagePreview.html');
                    },
                    deletefromForm: function (e) {
                        customConfirmBox("Are you sure you want to delete?", function (selection) {
                            if (selection == 1) {

                                var indexi= viewModel.invpic.indexOf(e.data);
                                viewModel.invpic.remove(viewModel.invpic[indexi]);
                                var indexo = viewModel.ornpic.indexOf(e.data);
                                viewModel.ornpic.remove(viewModel.ornpic[indexo]);
                            }

                        });



                    },
                    
                    addp: function () {
                        var invphotos = app.models.SaveRecord.SaveRecordView.viewModel.get('invpic');
                        if (invphotos.length != 0) {
                            for (var i = 0; i < invphotos.length; i++) {
                                viewModel.addinPhotosDB(app.models.SaveRecord.SaveRecordView.viewModel.invpic[i],1,'Invoice Photo');
                            }

                        }
                        var ornphotos = app.models.SaveRecord.SaveRecordView.viewModel.get('ornpic');
                        if (ornphotos.length != 0) {
                            for (var i = 0; i < ornphotos.length; i++) {

                                viewModel.addinPhotosDB(app.models.SaveRecord.SaveRecordView.viewModel.ornpic[i],2,'Ornament Photo');

                            }

                        }
                        
                        },
               //return section functions work without viewModel
                addinPhotosDB: function (photos,categoryId,categoryName) {


                    app.db.transaction(function (tx) {
                        tx.executeSql(

                            "INSERT INTO Photos VALUES(?,?,?,?)", [viewModel.RecId,categoryId,categoryName,photos.FileBase64],
                            function (transaction, result) {
                                console.log("Photo added!");
                               

                            },
                            function (transaction, err) {
                                console.log("error:" + err.message);
                            }
                        );
                    });
                },
                   
                    onResize: function (longSideMax, url) {
                        var tempImg = new Image();
                        tempImg.src = url;
                        tempImg.onload = function () {
                            var targetWidth = tempImg.width;
                            var targetHeight = tempImg.height;
                            var aspect = tempImg.width / tempImg.height;

                            if (tempImg.width > tempImg.height) {
                                longSideMax = Math.min(tempImg.width, longSideMax);
                                targetWidth = longSideMax;
                                targetHeight = longSideMax / aspect;
                            } else {
                                longSideMax = Math.min(tempImg.height, longSideMax);
                                targetHeight = longSideMax;
                                targetWidth = longSideMax * aspect;
                            }

                            // Create canvas of required size.
                            var canvas = document.createElement('canvas');
                            canvas.width = targetWidth;
                            canvas.height = targetHeight;
                            var ctx = canvas.getContext("2d");
                            ctx.drawImage(this, 0, 0, tempImg.width, tempImg.height, 0, 0, targetWidth, targetHeight);

                           // addwatermark(ctx, tempImg, targetWidth, targetHeight, "photos");
                            //added as per CR(datetime as watermark)
                            var canvasOutputFileType = 'image/jpeg';
                            if (os.android)
                                canvasOutputFileType = 'image/png';
                            //alert('cAlling onsuccessresize');
                            viewModel.onSuccessResize(url, canvas.toDataURL(canvasOutputFileType, 0.5));
                            //viewModel.onSuccessResize(url, canvas.toDataURL("image/jpeg", 0.5));

                        };
                    },
                    onSuccessResize: function (ImageURI, imagedata) {
                        var docObj = {

                            FileBase64:imagedata,
                            MIME: 'image/jpeg'
                        };
                        
                       
                        viewModel.addPhotoInList(docObj, null);



                    },
                    addPhotoInList: function (item) {
                        var category = app.models.SaveRecord.SaveRecordView.viewModel.pictype;
                        if (category == 'invoice') {
                            app.models.SaveRecord.SaveRecordView.viewModel.invpic.push(item);
                        }
                        else if (category == "ornament") {

                            app.models.SaveRecord.SaveRecordView.viewModel.ornpic.push(item);

                        }
                     },
                    capturePhoto: function (e) {
                        var cameraOptions = {
                            quality: app.config.Photo.quality,
                            sourceType: Camera.PictureSourceType.CAMERA,
                            destinationType: Camera.DestinationType.FILE_URI,
                            saveToPhotoAlbum: app.models.settings.viewModel.saveToPhotoAlbum,//false,
                            encodingType: Camera.EncodingType.JPEG,
                            mediaType: Camera.MediaType.PICTURE,
                            correctOrientation: true,
                            targetHeight: app.config.Photo.targetSize,
                            targetWidth: app.config.Photo.targetSize
                        };

                        //if (app.models.SaveRecord.SaveRecordView.viewModel.invpic.length >=2) {
                            //customAlert("Invoice added already!!");
                            
                            
                        //} else {
                        viewModel.set('pictype', e);
                            navigator.camera.getPicture(viewModel.onPhotoDataSuccess, viewModel.onError, cameraOptions);
                        //}
                    },
                    onError: function (message) {
                        //navigator.camera.cleanup(function () { alert('clean up success.'); }, function (message) { alert('clean up failure.' + message);});
                        alert('Kindly check your settings. ' + message);
                    },
                    onPhotoDataSuccess: function (ImageURI) {
                      
                      viewModel.onResize(app.config.Photo.targetSize, ImageURI);
                     

                    },
                    cleanform: function () {
                        app.models.SaveRecord.SaveRecordView.viewModel.set('saverec', {
                            Name: "",
                            address1: "",
                            address2: "",
                            invno: "",
                            mobileno: "",
                            emailid: "",
                            pincode: "",
                            statet1: "Select State..",
                            cityt1: "Select City..",
                            invdate: "",
                            amount: ""

                        });
                        viewModel.invpic.length = 0;
                        viewModel.ornpic.length = 0;



                      

                        app.config.isSaved = false;
                    }
                 

                });
                return {
                    viewModel: viewModel,
                    
                    onShow: function(){
                       
                        if (app.models.draftRecords.draftRecordsList.viewModel.directedFromDraft) {
                            app.models.SaveRecord.SaveRecordView.fillSavedData('fromdraft');
                            app.models.SaveRecord.SaveRecordView.viewModel.set('directedfrom', 'draft');
                        }
                        
                        menu('statet1');
                        //Set Invoice Data Range
                        var today = new Date();
                        var dd = today.getDate();
                        var mm = today.getMonth() + 1;//0-11

                        var yyyy = today.getFullYear();
                        if (dd < 10) {
                            dd = '0' + dd;
                        }
                        if (mm < 10) {
                            mm = '0' + mm;
                        }
                        today = yyyy + '-' + mm + '-' + dd;
                        document.getElementById("invdate").max = today + "";
                        //
                       




                    },
                    fillSavedData: function (e) {
                      
                        app.db.transaction(function (tx) {
                            tx.executeSql(
                                "SELECT * FROM Record1 where Id=?", [app.record.id],
                                function (transaction, res) {
                                    if (res.rows.length > 0) {
                                    
                                     //   app.models.SaveRecord.SaveRecordView.fillState('statet1');
                                       
                                        viewModel.set('saverec.Name', res.rows.item(0).Name);
                                        viewModel.set('saverec.address1', res.rows.item(0).AddressLine1);
                                        viewModel.set('saverec.address2', res.rows.item(0).AddressLine2);
                                        viewModel.set('saverec.invno', res.rows.item(0).InvNo);
                                        viewModel.set('saverec.mobileno', res.rows.item(0).MobNo);
                                        viewModel.set('saverec.emailid', res.rows.item(0).EmailId);
                                        viewModel.set('saverec.pincode', res.rows.item(0).Pincode);

                                        //$('#statet1').val(app.record.state);
                                        //viewModel.set('saverec.statet1', app.record.state);
                                        //viewModel.set('saverec.city1', app.record.city);
                                        viewModel.set('saverec.invdate', app.record.timeStamp);
                                        viewModel.set('saverec.amount', res.rows.item(0).Amount);
                                        app.models.SaveRecord.SaveRecordView.fillstate('statet1', res.rows.item(0).StateCode);
                                        tx.executeSql("SELECT * FROM Photos where Id=?", [app.record.id],
                                            function (transaction, res) {
                                                var totalPhotosCount = res.rows.length;
                                                for (var i = 0; i < totalPhotosCount; i++) {
                                                    (function (i) {
                                                       
                                                        var item = res.rows.item(i);
                                                        var category = res.rows.item(i).CategoryName;
                                                        if (category == 'Invoice Photo') {
                                                            app.models.SaveRecord.SaveRecordView.viewModel.invpic.push(item);
                                                            
                                                        } else if (category == 'Ornament Photo') {
                                                            
                                                            app.models.SaveRecord.SaveRecordView.viewModel.ornpic.push(item);
                                                        } 
                                                    })(i);
                                                }
                                                
                                            },
                                            function (transaction, err) {
                                                console.log("Error" + err.message);
                                            });

                                       
                                    }

                                    
                               
                                },
                                function (transaction, err) {
                                    console.log("Error" + err.message);
                                });




                        });
                        

                    },
                    fillstate: function (id, statecode) {
                        var statename="";
                        app.db.transaction(function(tx){
                            tx.executeSql("SELECT * FROM StateMaster WHERE StateCode=?",[statecode],
                             function(transaction,res){
                                 if(res.rows.length>0){
                                     statename=res.rows.item(0).StateName;

                                 }
                            
                             },
                             function(transaction,err){
                                 console.log("error filling state details"+err.message);
                             });


                        });

                        var currentselectedoption = "<option value=" + statecode + ">" + statename + "</option>";


                        document.getElementById(id).innerHTML = currentselectedoption;


                    },
                    //fillState: function (id) {

                    //    //var stateOptions = "<option selected='selected' disabled='disabled' value=''>Select State...</option>";
                    //    app.db.transaction(function (tx) {

                    //        tx.executeSql("SELECT * FROM StateMaster WHERE StateCode=?", [app.record.stateid],
                    //        function (transaction, res) {
                    //            if (res.rows.length > 0) {
                    //                var stateOption = "";
                    //                for (var i = 0; i < res.rows.length; i++) {
                    //                  stateOptions += "<option value="+res.rows.item(0).StateCode+">"+res.rows.item(i).StateName+"</option>"
                    //                }
                    //            }
                    //            if (document.getElementById(id) != null) {
                    //                document.getElementById(id).innerHTML = stateOptions;

                    //            }
                    //            if (viewModel.saverec.statet1 != "") {
                    //                $("#" + id).val(viewModel.saverec.statet1);
                    //            }


                    //        },
                    //        function (transaction, err) {
                    //            alert("State filling error" + err.message);

                    //        }


                    //            );



                    //    });


                    //},
                    back: function () {
                        app.models.SaveRecord.SaveRecordView.viewModel.cleanform();
                        
                    },
                    addrecord: function () {
                            //if (app.isOnline()) {
                            //    alert("Online");
                            //} else {
                            //    alert("Offline");
                            //}
                            var validatable = $('#recordDetails').kendoValidator().data("kendoValidator");
                            if (validatable.validate()) {
                                app.models.SaveRecord.SaveRecordView.viewModel.nextrecordid();
                                var ilength = viewModel.invpic.length;
                                var olength = viewModel.ornpic.length;
                                if (ilength == 0 || olength == 0) {
                                    $("#Forms1").css("border-color", "red");
                                    $("#Forms1").css("border-width", "3px");
                                    $("#Forms2").css("border-color", "red");
                                    $("#Forms2").css("border-width", "3px");
                                    alert('Please upload at least one photo for required field(s).');
                                }
                                else {
                                    //app.db.transaction(function (tx) {
                                    //    tx.executeSql("INSERT INTO Record1 VALUES", [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
                                    //        function (transaction, res) {
                                    //            console.log("Alert");
                                    //        },
                                    //        function (tranasaction, err) {
                                    //            console.log("error" + err.message);
                                    //        }
                                    //        );


                                    //});
                                //  app.models.SaveRecord.SaveRecordView.viewModel.onsubmitcheck();

                                    app.db.transaction(function (tx) {
                                        var fidate = viewModel.saverec.invdate;
                                        app.record.timeStamp = viewModel.saverec.invdate;
                                        app.record.statecode = viewModel.saverec.statet1;
                                        app.record.citycode = viewModel.saverec.cityt1;
                                        var yyyy = fidate.getFullYear();
                                        var mm = fidate.getMonth() + 1;
                                        var dd = fidate.getDate();
                                        fidate = dd + '-' + mm + '-' + yyyy;

                                        var temp = new Date;
                                        var yyyy = temp.getFullYear();
                                        var mm = temp.getMonth() + 1;
                                        var dd = temp.getDate();
                                        var e = dd + '-' + mm + '-' + yyyy;
                                        //            var f = viewModel.invpic[0].FileBase64;
                                        //var z = viewModel.saverec.statet1;


                                        tx.executeSql("INSERT INTO Record1 (Id,Name ,AddressLine1,AddressLine2,EmailId,StateCode,CityCode,Pincode,InvoiceDate,Amount,InvNo,MobNo,DateCreated,IsSaved,IsSubmitted,IsSynced) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)", [viewModel.RecId, viewModel.saverec.Name, viewModel.saverec.address1, viewModel.saverec.address2, viewModel.saverec.emailid, viewModel.saverec.statet1, viewModel.saverec.cityt1, viewModel.saverec.pincode, fidate, viewModel.saverec.amount, viewModel.saverec.invno, viewModel.saverec.mobileno, e, 'Y', 'N', app.constant.progBooleanFalseKeyword],
                                 function (transaction, results) {

                                     console.log("Record Inserted");

                                     alert("Record Added");
                                     app.models.SaveRecord.SaveRecordView.viewModel.addp();
                                     viewModel.cleanform();

                                     app.mobileApp.navigate('views/Home.html');

                                 },
                                  function (transaction, err) {
                                      console.log("error:" + err.message);
                                  }
                                  );



                                    });
                                    
                                }
                            }
                            else {
                                alert("Please fill all the required fields!!");
                            }
                           
                           
                    },
                    changeCSS: function (select) {
                        select.style.color = "#404040";
                    },
                    addRow: function (tableID) {

                        var table = document.getElementById(tableID);

                        var rowCount = table.rows.length;
                        var row = table.insertRow(rowCount);

                        var colCount = table.rows[0].cells.length;

                        for (var i = 0; i < colCount; i++) {

                            var newcell = row.insertCell(i);

                            newcell.innerHTML = table.rows[0].cells[i].innerHTML;
                            //alert(newcell.childNodes);
                            switch (newcell.childNodes[0].type) {
                                case "text":
                                    newcell.childNodes[0].value = "";
                                    break;
                                case "checkbox":
                                    newcell.childNodes[0].checked = false;
                                    break;
                                case "select-one":
                                    newcell.childNodes[0].selectedIndex = 0;
                                    break;
                            }
                        }

                    },
                    deleteRow: function (tableID) {
                        try {
                            var table = document.getElementById(tableID);
                            var rowCount = table.rows.length;

                            for (var i = 0; i < rowCount; i++) {
                                var row = table.rows[i];
                                var chkbox = row.cells[0].childNodes[0];
                                if (null != chkbox && true == chkbox.checked) {
                                    if (rowCount <= 1) {
                                        alert("Cannot delete all the rows.");
                                        break;
                                    }
                                    table.deleteRow(i);
                                    rowCount--;
                                    i--;
                                }


                            }
                        } catch (e) {
                            alert(e);
                        }
                    }
                  
                       
                };

            })();
            app.models.SaveRecord.SaveRecordPreview = (function () {
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