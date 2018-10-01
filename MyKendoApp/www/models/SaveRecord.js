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
                        amount:""


                        
                    },
                    RecId:"",
                    invpic: [],
                    ornpic: [],
                    invoice: "",
                    ornament: "",
                    pictype: "",
                    invno: "",
                    sno: "",
                  


                    

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
                    },
                    call(e) {
                        app.models.SaveRecord.SaveRecordView.viewModel.filledata(e);
                    },
                 
                   

                    onsubmitcheck: function () {
                        onSubmitConfirmBox("Please ensure internet connectivity; otherwise data could be corrupt or lost.", function (selection) {
                            if (selection == 2) {

                            } else if (selection == 1) {
                                return;
                            }
                        });

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
                    //   rtoStatemenu("vdRegistrationState");
                        


                    },
                    fillSavedData: function (e) {

                        app.db.transaction(function (tx) {
                            tx.executeSql(
                                "SELECT * FROM Record1 where Id=?", [app.record.id],
                                function (transaction, res) {
                                    if (res.rows.length > 0) {
                                        viewModel.set('saverec.Name', res.rows.item(0).Name);
                                        viewModel.set('saverec.address1', res.rows.item(0).AddressLine1);
                                        viewModel.set('saverec.address2', res.rows.item(0).AddressLine2);
                                        viewModel.set('saverec.invno', res.rows.item(0).InvNo);

                                       //viewModel = res.rows.item(0).AddressLine1;
                                       //viewModel= res.rows.item(0).AddressLine2;
                                       //viewModel = res.rows.item(0).InvNo;
                                       // //  viewModel.saverec.Name = res.rows.item(0).Name;

                                    }


                                },
                                function (transaction, err) {
                                });
                        });


                    },
                    
                    
                    back: function () {
                        app.models.SaveRecord.SaveRecordView.viewModel.cleanform();
                        
                    },
                  

                       
                        addrecord: function () {

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
                                    app.models.SaveRecord.SaveRecordView.viewModel.onsubmitcheck();

                                    app.db.transaction(function (tx) {
                                        var fidate = viewModel.saverec.invdate;
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
                                        var z;

                                        tx.executeSql("SELECT * FROM StateMaster where StateCode=?", [viewModel.saverec.state],
                                            function (t, res) {
                                                if (res.rows.length > 0) {
                                                    z = res.rows.item(0).StateName;
                                                    tx.executeSql("INSERT INTO Record1 (Id,Name ,AddressLine1,AddressLine2,State,City,Pincode,InvoiceDate,Amount,InvNo,MobNo,DateCreated,IsSaved,IsSubmitted,IsSynced) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)", [viewModel.RecId, viewModel.saverec.Name, viewModel.saverec.address1, viewModel.saverec.address2, z, viewModel.saverec.city, viewModel.saverec.pincode, fidate, viewModel.saverec.amount, viewModel.saverec.invno, viewModel.saverec.mobileno, e, 'Y', 'N', app.constant.progBooleanFalseKeyword],
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
                                                }

                                            },
                                            function (t, err) {
                                            });



                                    });
                                    
                                }
                            }
                            else {
                                alert("Please fill all the required fields!!");
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