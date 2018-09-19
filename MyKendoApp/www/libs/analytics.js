(function () {
    var version,
        projectKey = "a937919289ff4a96b652b233d9216de2"; // Replace with your own key

    window.analytics = {
        start: function () {
            var factory = window.plugins.EqatecAnalytics.Factory,
                monitor = window.plugins.EqatecAnalytics.Monitor,
                settings = factory.CreateSettings(projectKey, version);

            settings.LoggingInterface = factory.CreateTraceLogger();
            factory.CreateMonitorWithSettings(settings,
                function () {
                    monitor.Start(function () {
                        console.log("Monitor started");
                    });
                },
                function (msg) {
                    console.log("Error creating monitor: " + msg);
                });
        },
        stop: function () {
            var monitor = window.plugins.EqatecAnalytics.Monitor;
            monitor.Stop();
        },
        monitor: function () {
            return window.plugins.EqatecAnalytics.Monitor;
        }
    };

    // Guard against the AppBuilder simulator
    // See tip #9 from http://developer.telerik.com/featured/20-kendo-ui-mobile-telerik-appbuilder-tips-tricks/
    if (navigator.simulator) {
       //return;
   }

    document.addEventListener("deviceready", function () {
        cordova.getAppVersion(function (appVersion) {
            version = appVersion;
            window.analytics.start();
            document.addEventListener("pause", function () {
                window.analytics.stop();
            });
            document.addEventListener("resume", function () {
                window.analytics.start();
            });
        });
    });
    window.onerror = function (message, url, lineNumber, columnNumber, error) {
        window.analytics.monitor().TrackExceptionMessage(error, message);
    };
}());