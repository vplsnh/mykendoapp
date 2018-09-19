'use strict';
(function () {
    app.location = {
        init: function () {
            app.location = (function () {
                app.user.position = null;
                var getLocation = function (callBackFunction, data) {
                    /// <summary>To get GPS location.</summary>
                    /// <param name="callBackFunction" type="Function">calling callBackFunction on response of GPS location</param>
                    /// <param name="data" type="Any">data will be passed as it is to callBackFunction.</param>
    
                    try {
                        app.location.callBackFunction = callBackFunction;
                        app.location.callBackFunctionData = data;
                       
                        if (app.user.position != undefined && app.user.position != null) {
                            var twentyMinutesLater = new Date(app.user.position.CapturedOn);
                            twentyMinutesLater.setMinutes(twentyMinutesLater.getMinutes() + 0);//0 minute
                            var lastCapturedOn = FormatDate(app.config.dateTimeFormatForDB, twentyMinutesLater);
                            var currentDateTime = FormatDate(app.config.dateTimeFormatForDB);
                            if (lastCapturedOn < currentDateTime) {
                                navigator.geolocation.getCurrentPosition(app.location.onSuccess, app.location.onError, { maximumAge: 300000, timeout: 5000, enableHighAccuracy: true });
                            } else {
                                
                                if (app.location.callBackFunction != null) {
                                    app.location.callBackFunction(app.location.callBackFunctionData, app.user.position);
                                    app.location.callBackFunction = null;
                                }
                            }
                        } else {
                            navigator.geolocation.getCurrentPosition(app.location.onSuccess, app.location.onError, { maximumAge: 300000, timeout: 5000, enableHighAccuracy: true });
                        }
                        
                    } catch (err) {
                        app.error.log('GPS location', 'getLocation', 'catch', error.message);
                    }
                };
                var onSuccess = function (position) {
                    app.user.position = {
                        coords: {
                            "latitude": position.coords.latitude,
                            "longitude": position.coords.longitude,
                            "accuracy": position.coords.accuracy,
                            "timestamp": position.timestamp,
                        },
                        CapturedOn: FormatDate(app.config.dateTimeFormatForDB)
                    }
                    
                    //alert('functionName: ' + app.location.callBackFunction + '; Data: ' + app.location.callBackFunctionData);
                    try {
                        if (typeof app.location.callBackFunction == 'function') {
                            app.location.callBackFunction(app.location.callBackFunctionData, app.user.position);
                            app.location.callBackFunction = null;
                        }
                    } catch (err) {
                        //alert('catched: '+err.message);
                    }
                    //customAlert('Latitude: ' + position.coords.latitude + '\n' +
                    //      'Longitude: ' + position.coords.longitude + '\n' +
                    //      'Altitude: ' + position.coords.altitude + '\n' +
                    //      'Accuracy: ' + position.coords.accuracy + '\n' +
                    //      'Altitude Accuracy: ' + position.coords.altitudeAccuracy + '\n' +
                    //      'Heading: ' + position.coords.heading + '\n' +
                    //      'Speed: ' + position.coords.speed + '\n' +
                    //      'Timestamp: ' + position.timestamp + '\n');
                };

                function onError(error) {
                    //customAlert(app.alertMessage.onGPSLocationNotFound);
                    //app.error.log('GPS location', 'getLocation', 'request', error.message);
                     //if (error.message == PositionError.PERMISSION_DENIED) {
                    //    customAlert('Please Enable GPS.');
                    //}
                    try{
                        switch (error.code) {
                            case error.PERMISSION_DENIED:
                                // x.innerHTML = "User denied the request for Geolocation."
                                //customAlert("User denied the request for Geolocation.", false);
                                break;
                            case error.POSITION_UNAVAILABLE:
                                // x.innerHTML = "Location information is unavailable."
                                //customAlert("Location information is unavailable.", false);
                                break;
                            case error.TIMEOUT:
                                //  x.innerHTML = "The request to get user location timed out."
                                // if (app.loader.currentMessage == app.loaderMessage.onGettingGPSLocation) {
                                //     //customAlert("The request to get user location is timed out for GPS. Calling AGPS", false);
                                //     app.loader.show(app.loaderMessage.onGettingAGPSLocation);
                                // }
                                // app.location.locationByCellTower();
                                
                                break;
                            case error.UNKNOWN_ERROR:
                                //  x.innerHTML = "An unknown error occurred."
                                //customAlert("An unknown error occurred.", false);
                                break;
                        }
                        if (typeof app.location.callBackFunction == 'function') {
                            app.location.callBackFunction(app.location.callBackFunctionData, null);
                            app.location.callBackFunction = null;
                        }
                    } catch (err) {
                        //alert('GPS onerror catch: '+err.message);
                    }

                    //if (typeof app.location.callBackFunction == 'function') {
                    //    app.location.callBackFunction(app.location.callBackFunctionData, null);
                    //    app.location.callBackFunction = null;
                    //}
                }

                //To create call for Location by Cell Tower.
                var locationByCellTower = function () {
                    //alert('q');
                    // alert('In AGPS' + WatchCellID);
                    //app.loader.show("Getting Location by AGPS");
                    //if (app.location.watchCellID === null) {
                        navigator.geolocation.getCurrentPosition(
                            function (position) {
                                app.user.position = {
                                    coords: {
                                        "latitude": position.coords.latitude,
                                        "longitude": position.coords.longitude,
                                        "accuracy": position.coords.accuracy,
                                        "timestamp": position.timestamp,
                                    },
                                    CapturedOn: FormatDate(app.config.dateTimeFormatForDB)
                                }
                                
                                if (typeof app.location.callBackFunction == 'function') {
                                    app.location.callBackFunction(app.location.callBackFunctionData, position);
                                    app.location.callBackFunction = null;
                                }
                            },
                            function (error) {
                                try{
                                    //app.loader.hide();
                                    switch (error.code) {
                                        case error.PERMISSION_DENIED:
                                            // x.innerHTML = "User denied the request for Geolocation."
                                            customAlert("User denied the request for Geolocation.", false);
                                            break;
                                        case error.POSITION_UNAVAILABLE:
                                            // x.innerHTML = "Location information is unavailable."
                                            customAlert("Location information is unavailable.", false);
                                            break;
                                        case error.TIMEOUT:
                                            //  x.innerHTML = "The request to get user location timed out."
                                            if (app.loader.currentMessage == app.loaderMessage.onGettingAGPSLocation)
                                                customAlert("Could not detect GPS and Tower location.");
                                            break;
                                        case error.UNKNOWN_ERROR:
                                            //  x.innerHTML = "An unknown error occurred."
                                            customAlert("An unknown error occurred.", false);
                                            break;
                                    }
                                    if (typeof app.location.callBackFunction == 'function') {
                                        app.location.callBackFunction(app.location.callBackFunctionData, null);
                                        app.location.callBackFunction = null;
                                    }
                                } catch (err) {
                                    //alert('agps onerror catch: '+err.message);
                                }
                            }, {
                                maximumAge: 60000,
                                timeout: 30000,
                                enableHighAccuracy: false
                            }
                        );

                    //}
                }

                return {
                    callBackFunction: null,
                    callBackFunctionData: null,
                    getLocation: getLocation,
                    locationByCellTower: locationByCellTower,
                    onSuccess: onSuccess,
                    onError: onError
                };
            })();
        }
    };
})();