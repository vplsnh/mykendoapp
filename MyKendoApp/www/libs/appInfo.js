(function (global) {
    var appInformationViewModel,
        app = global.app = global.app || {};

    appInformationViewModel = kendo.data.ObservableObject.extend({

        getVersion: function () {
            if (!app.config.isSimulator) {
                cordova.getAppVersion(function (value) {
                    window.localStorage.setItem("CurrentVersion", value);
                });
            }
        },

        getPackageName: function () {
            if (!app.config.isSimulator) {
                cordova.getAppVersion.getPackageName(function (value) {
                    alert(value);
                });
            }
        },

        getAppName: function () {
            if (!app.config.isSimulator) {
                cordova.getAppVersion.getAppName(function (value) {
                    alert(value);
                });
            }
        },

        getVersionNumber: function () {
            if (!app.config.isSimulator) {
                cordova.getAppVersion.getVersionNumber(function (value) {
                    alert(value);
                });
            }
        },

        getVersionCode: function () {
            if (!app.config.isSimulator) {
                cordova.getAppVersion.getVersionCode(function (value) {
                    alert(value);
                });
            }
        },

        checkSimulator: function () {
            if (app.config.isSimulator === true) {
                alert('This plugin is not available in the simulator.');
                return true;
            } else if (cordova.getAppVersion === undefined) {
                alert('Plugin not found. Maybe you are running in AppBuilder Companion app which currently does not support this plugin.');
                return true;
            } else {
                return false;
            }
        }
    });

    app.infoService = {
        viewModel: new appInformationViewModel()
    };
})(window);