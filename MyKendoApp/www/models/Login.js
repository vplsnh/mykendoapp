'use strict';

(function () {
    app.models.Login = {
        init: function () {
            app.models.Login = (function () {
                return {
                    onShow: function (e) {
                        var settings = JSON.parse(window.localStorage.getItem('AppSettings'));
                        if (settings === null) {
                            settings = {};
                            settings.isSaveToAlbumSet = true;
                            app.models.settings.viewModel.set('saveToPhotoAlbum', settings.isSaveToAlbumSet);
                            window.localStorage.setItem("AppSettings", JSON.stringify(settings));
                        }
                        var appVersion = '';
                        var CurrentVersion = window.localStorage.getItem("CurrentVersion");
                        if (CurrentVersion != null) {
                            appVersion = 'App Version: ' + CurrentVersion;
                        }
                        $('#appVersion').text(appVersion);
                    },
                    onHide: function () {

                    }
                };
            })();
            app.models.Login.LoginView = (function () {
                var viewModel = kendo.observable({
                    user: {
                        userName: "",
                        password: "",
                        error: "",
                        action: ''
                    },
                    lang: app.strings.en
                });
                return {
                    viewModel: viewModel,
                    login: function () {
                        var user = viewModel.get('user');
                        //app.user.id = 1;
                       
                        //var APP_ID = app.config.appId;
                        //var feedbackOptions = {
                        //    enableShake: true
                        //};
                        //window.feedback.initialize(
                        //   APP_ID,
                        //   feedbackOptions
                        // );

                        
                        app.loader.show(app.loaderMessage.login);
                        if (user.userName.trim() == '' || user.password.trim() == '') {
                            viewModel.set("user.error", "Both fields are required.");
                            app.loader.hide();
                            return;
                            //app.mobileApp.navigate('views/home.html');
                        }

                        app.user.isLoggedIn = false;
                        app.loader.show('Logging in offline...');
                        if (user.userName=="vipul" && user.password=="pass"){
                            app.user.isLoggedIn = true;
                            app.loader.hide();
                            app.mobileApp.navigate('views/Home.html');
                            app.masterData.downloadMasterData();

                           
                            
                        }
                        else 
                        {
                            app.loader.hide();
                            alert("Wrong Credentials!!!!!!!");
                            viewModel.set("user.password", "");
                        }
                                   
            
},
                        
                       logout: function () {
                        //app.config.isSaved = false;
                        //app.user.isLoggedIn = false;
                        //app.models.login.loginView.viewModel.set('user.action', 'logout');
                        //app.models.login.loginView.saveLoginHistory();
                        $("#app-drawer").data("kendoMobileDrawer").hide();
                        setTimeout(function () {
                            app.mobileApp.navigate('views/common/Login.html');
                        }, 500);
                    },
                    deletedb: function () {
                        app.deletedb.clean();
                    }
                };
            })();
        }
    };
})();