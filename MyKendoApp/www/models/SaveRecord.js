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
                    saverec: {
                        Name: "",
                        address: "",
                        invno: "",
                        mobileno:"",
                        
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
                    deletefromForm: function () {
                        customConfirmBox("Are you sure you want to delete?", function (selection) {
                            if (selection == 1) {

                                viewModel.invpic.remove(viewModel.invpic[0]);
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
                     

                    }


                });
                return {
                    viewModel: viewModel,
                    onShow: function(){
                        //Set Fields Blank
                        app.models.SaveRecord.SaveRecordView.viewModel.set('saverec', {
                            Name: "",
                            address: "",
                            invno: "",
                            mobileno: ""

                        });
                        


                    },
                    
                        back: function () {
                        app.models.SaveRecord.SaveRecordView.viewModel.set('saverec', {
                            Name: "",
                            address: "",
                            invno: "",
                            mobileno: ""

                        });
                       
                        app.config.isSaved = false;
                        },
                       
                        addrecord: function () {

                            var validatable = $('#recordDetails').kendoValidator().data("kendoValidator");
                            if (validatable.validate()) {
                            app.models.SaveRecord.SaveRecordView.viewModel.nextrecordid();

                            
                                app.db.transaction(function (tx) {
                                    var a = viewModel.saverec.Name;
                                    var b = viewModel.saverec.address;
                                    var c = viewModel.saverec.invno;
                                    var d = viewModel.saverec.mobileno;
                                    var temp = new Date;
                                    var yyyy = temp.getFullYear();
                                    var mm = temp.getMonth() + 1;
                                    var dd = temp.getDate();
                                    var e = dd + '-' + mm + '-' + yyyy;
                                    //            var f = viewModel.invpic[0].FileBase64;
                                   
                                   

                                    tx.executeSql("INSERT INTO Record1 (Id,Name ,Address ,InvNo,MobNo,DateCreated) VALUES (?,?,?,?,?,?)", [viewModel.RecId, a, b, c, d, e],
                                    function (transaction, results) {
                                        console.log("Record Inserted");

                                        alert("Record Added");

                                        app.mobileApp.navigate('views/Home.html');

                                    },
                                     function (transaction, err) {
                                         console.log("error:" + err.message);
                                     }
                                     );

                                });
                                app.models.SaveRecord.SaveRecordView.viewModel.addp();
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