'use strict';
(function () {
    app.models.changePassword = {
        init: function () {
            app.models.changePassword = (function () {
                return {
                    onShow: function (e) {

                    },
                    onHide: function () {

                    }
                };
            })();
            app.models.changePassword.changePasswordView = (function () {
                var viewModel = kendo.observable({
                    passwordModel: {
                        currentPassword: "",
                        newPassword: "",
                        retypePassword: ""
                    }
                });
                return {
                    viewModel: viewModel,
                    onSubmit: function () {
                        var validatable = $("#changePasswordform").kendoValidator().data("kendoValidator");
                        if (validatable.validate()) {
                            var getPasswordModel = app.models.changePassword.changePasswordView.viewModel.get('passwordModel');
                            var CurrentPassword = CryptoJS.MD5(getPasswordModel.currentPassword);
                            var SavedPassword = window.localStorage.getItem("CurrentPassword");
                            var getUsername = window.localStorage.getItem("Username");
                            if (CurrentPassword == SavedPassword) {
                                var newPassword = getPasswordModel.newPassword;
                                var retypePassword = getPasswordModel.retypePassword;
                                if (newPassword == retypePassword) {
                                    var passwordData = {
                                        Username: getUsername,
                                        Password: newPassword
                                    };
                                    app.service.post('ChangePassword', passwordData).then(function (response) {
                                        if (response.IsSuccess) {
                                            alert("Password Changed Successfully.");
                                            // window.localStorage.setItem("CurrentPassword", newPassword);
                                            //window.localStorage.setItem("Username", getUsername);
                                            app.models.Login.LoginView.viewModel.user.set('userName', getUsername);
                                            app.models.Login.LoginView.viewModel.user.set('password', newPassword);
                                            app.models.Login.LoginView.login();
                                        } else if (response.ErrorMessage) {
                                            alert(response.ErrorMessage);
                                        }
                                    },
                                function (response, err) {
                                    alert('error' + response.statusText);
                                });
                                }
                                else {
                                    alert('New Password and Re-Type Password does not matched.')
                                }
                            } else {
                                alert('Current Password is Incorrect.');
                            }
                        }
                    },
                    back: function () {
                        app.models.changePassword.changePasswordView.viewModel.set('passwordModel', {})
                    },
                    onChangePasswordShow: function () {
                        app.models.changePassword.changePasswordView.viewModel.set('passwordModel', {})
                    }

                };
            })();
        }
    };
})();