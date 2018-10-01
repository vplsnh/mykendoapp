'use strict';

(function () {
    var app = {
        data: {},
        models: {},
       
        navigation: {
            viewModel: kendo.observable()
        },
        showMore: {
            viewModel: kendo.observable()
        },
        config: {
            isSimulator: true,
            isDebugMode: true,
            isSaved: false,
            cloudServiceURL: 'http://52.172.203.211/testservice/api/b2bappservice/',
          //  cloudServiceURL: 'http://localhost:51793/api/CCEAppservice/',
            //cloudServiceURL: 'http://52.172.203.211/CCEDevService/api/CCEAppservice/',
            //cloudServiceURL: 'http://surveyorapp.iffcotokio.co.in/CCEService/api/CCEAppservice/',
            dateFormatForDB: 'yyyy/MM/dd',
            dateTimeFormatForDB: 'yyyy/MM/dd hh:mm:ss',
            dateFormatForView: 'dd/MM/yyyy',
            dateTimeFormatForView: 'dd/MM/yyyy hh:mm:ss',
            Photo: { quality: 100, targetSize: 700 },
            appId: 'tqpk60qdpaczmob8'
        },
        user: {
            name: 'Guest',
            id: 0,
            isLoggedIn: false,
            deviceIMEINo: '',
            position: null,
            Username: 'Guest'
            

        },
        constant: {
            progBooleanFalseKeyword: 'false',
            progBooleanTrueKeyword: 'true',
            sqlBooleanTrueKeyword: '\'true\'',
            sqlBooleanFalseKeyword: '\'false\'',
        },
        record: {
            id: "",
            timeStamp: "",
            sequentialNo: "",
            userName: ""
        },
        GetDeviceInfoAsString: function () {
            if (app.config.isSimulator) {
                return 'DeviceName=simulator;' +
                    'DevicePhoneGap=device.phonegap ;' +
                    'DevicePlatform=Android;' +
                    'DeviceUUID=' + app.user.deviceUUID + ';' +
                    'DeviceVersion=1.0.0;' +
                    'DeviceIMEI=' + app.user.deviceIMEINo;
            } else {
                return 'DeviceName=' + device.name + ';' +
                'DevicePhoneGap=' + device.phonegap + ';' +
                'DevicePlatform=' + device.platform + ';' +
                'DeviceUUID=' + app.user.deviceUUID + ';' +
                'DeviceVersion=' + device.version + ';' +
                'DeviceIMEI=' + app.user.deviceIMEINo;
            }

        },
        state: {
            previousPage: ''
        },
        locationDetails: {
            MIN_LOCATION_ACCURACY: 10,
            latitude: '',
            longitude: '',
            accuracy: '',
            MaxWatchCount: 20
        }
    };

    var bootstrap = function () {
        var os = kendo.support.mobileOS,
        statusBarStyle = os.ios && os.flatVersion >= 700 ? 'black-translucent' : 'black';
        window.os = os;
        $(function () {
            app.mobileApp = new kendo.mobile.Application(document.body, {
                transition: 'slide',
                skin: 'nova',
                initial: 'views/Login.html'


            });
         //   app.models.lang.init();
            app.db.init();
            app.sync.init();
            app.models.home.init();
            app.models.Login.init();
            app.models.draftRecords.init();
            app.models.SaveRecord.init();
            app.models.pendingRecords.init();
            app.models.SavedRecords.init();
            app.models.InvoicePhotos.init();
           // app.deletedb.init();
            
            app.models.settings.init();
            
           
             app.service.init();
             app.masterData.init();
            
     document.addEventListener("backbutton", backkeydown, true);
            function backkeydown() { };
            try {
                if (app.config.isSimulator)
                    app.user.deviceUUID = '#fdfdfsd453554';
                else
                    app.user.deviceUUID = device.uuid;
                window.localStorage.setItem("DeviceUUID", app.user.deviceUUID);
            }
            catch (err) {
                alert('UDID Error : ' + err)
            }
            kendo.bind($('.navigation-link-text'), app.navigation.viewModel);
        });
    };

    $(document).ready(function () {

        var navigationShowMoreView = $('#navigation-show-more-view').find('ul'),
            allItems = $('#navigation-container-more').find('a'),
            navigationShowMoreContent = '';

        allItems.each(function (index) {
            navigationShowMoreContent += '<li>' + allItems[index].outerHTML + '</li>';
        });

        navigationShowMoreView.html(navigationShowMoreContent);
        kendo.bind($('#navigation-show-more-view'), app.showMore.viewModel);

        app.notification = $("#notify");

    });

    app.listViewClick = function _listViewClick(item) {
        var tabstrip = app.mobileApp.view().footer.find('.km-tabstrip').data('kendoMobileTabStrip');
        tabstrip.clear();
    };

    app.showNotification = function (message, time) {
        var autoHideAfter = time ? time : 3000;
        app.notification.find('.notify-pop-up__content').html(message);
        app.notification.fadeIn("slow").delay(autoHideAfter).fadeOut("slow");
    };

    if (window.cordova) {
        document.addEventListener('deviceready', function () {
            if (navigator && navigator.splashscreen) {
                navigator.splashscreen.hide();
            }
            bootstrap();
        }, false);
    } else {
        bootstrap();
    }

    app.keepActiveState = function _keepActiveState(item) {
        var currentItem = item;
        $('#navigation-container li.active').removeClass('active');
        currentItem.addClass('active');
    };

    window.app = app;

    app.isOnline = function () {
        if (!navigator || !navigator.connection) {
            return true;
        } else {
            return navigator.connection.type !== 'none';
        }
    };

    app.openLink = function (url) {
        if (url.substring(0, 4) === 'geo:' && device.platform === 'iOS') {
            url = 'http://maps.apple.com/?ll=' + url.substring(4, url.length);
        }

        window.open(url, '_system');
        if (window.event) {
            window.event.preventDefault && window.event.preventDefault();
            window.event.returnValue = false;
        }
    };

    /// start appjs functions
    /// end appjs functions
    app.showFileUploadName = function (itemViewName) {
        $('.' + itemViewName).off('change', 'input[type=\'file\']').on('change', 'input[type=\'file\']', function (event) {
            var target = $(event.target),
                inputValue = target.val(),
                fileName = inputValue.substring(inputValue.lastIndexOf('\\') + 1, inputValue.length);

            $('#' + target.attr('id') + 'Name').text(fileName);
        });

    };

    app.clearFormDomData = function (formType) {
        $.each($('.' + formType).find('input:not([data-bind]), textarea:not([data-bind])'), function (key, value) {
            var domEl = $(value),
                inputType = domEl.attr('type');

            if (domEl.val().length) {

                if (inputType === 'file') {
                    $('#' + domEl.attr('id') + 'Name').text('');
                }

                domEl.val('');
            }
        });
    };

    /// start kendo binders
    kendo.data.binders.widget.buttonText = kendo.data.Binder.extend({
        init: function (widget, bindings, options) {
            kendo.data.Binder.fn.init.call(this, widget.element[0], bindings, options);
        },
        refresh: function () {
            var that = this,
                value = that.bindings["buttonText"].get();

            $(that.element).text(value);
        }
    });
    /// end kendo binders
}());



// START_CUSTOM_CODE_kendoUiMobileApp
// Add custom code here. For more information about custom code, see http://docs.telerik.com/platform/screenbuilder/troubleshooting/how-to-keep-custom-code-changes
function GoToPage(page) {
    $("#app-drawer").data("kendoMobileDrawer").hide();
    setTimeout(function () {
        app.mobileApp.navigate(page);
    }, 500);
}
var G_deviceHeight = 0;
var winHeight;
// END_CUSTOM_CODE_kendoUiMobileApp
