'use strict';
(function () {
    app.models.PasswordRecovery = {
        init: function () {
            app.models.PasswordRecovery = (function () {
                var viewModel = kendo.observable({
                    RecoverFrom: {
                        Username: "",
                        MobileNo: ""
                    }
                });

                return {
                    viewModel: viewModel,
                    onShow: function () {
                        $("#txtMobileNo").css("border-color", "");
                    },
                    onsubmit: function () {
                        var validatable = $("#userPasswordRecovery").kendoValidator().data("kendoValidator");
                        if (validatable.validate()) {

                            var RecoverPasswordParam = {
                                UsenameForRecovery: '',
                                MobileNoForRecovery: ''
                            }
                            RecoverPasswordParam.UsenameForRecovery = app.models.PasswordRecovery.viewModel.RecoverFrom.Username;
                            RecoverPasswordParam.MobileNoForRecovery = app.models.PasswordRecovery.viewModel.RecoverFrom.MobileNo;
                            if (app.isOnline()) {
                                app.loader.show('Please Wait...');
                                var CurrentVersion = window.localStorage.getItem("CurrentVersion");
                                var CredentialsString = "abc:abc:" + "G_Device#fjdslfj" + ":" + "fjdslfj" + ":" + app.user.id + ":" + app.user.deviceIMEINo + ":NoAuthRequired:" + CurrentVersion;
                                CredentialsString = $.base64.btoa(CredentialsString);
                                CredentialsString = "Basic " + CredentialsString;

                                app.service.post('GetPasswordRecovery', RecoverPasswordParam, CredentialsString).then(function (response) {
                                    if (response.IsSuccess) {
                                        app.loader.hide();
                                        alert('A new password has been sent to you by Email/SMS.');
                                        app.models.PasswordRecovery.viewModel.set('RecoverFrom', {
                                            Username: "",
                                            MobileNo: ""
                                        });
                                        app.mobileApp.navigate('views/common/Login.html');
                                    } else if (response.ErrorMessage) {
                                        app.loader.hide();
                                        alert(response.ErrorMessage);

                                    }
                                },
                                function (response, err) {
                                    alert('error' + response.statusText);
                                });
                            }
                            else {
                                alert('No Internet Connection is Available!');
                            }
                        }
                        else {
                            alert('Please Fill the Required Field.')
                        }

                    },

                    back: function () {
                        app.models.PasswordRecovery.viewModel.set('RecoverFrom', {
                            Username: "",
                            MobileNo: ""

                        });
                    }
                    ,
                    onHide: function () {

                    }
                };
            })();
        }
    }

})();