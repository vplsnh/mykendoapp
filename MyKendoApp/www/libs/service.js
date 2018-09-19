'use strict';
(function () {
    app.service = {
        init: function () {
            app.service = (function () {
                return {
                    auth: '',
                    auth2: '',
                    get: function (methodName, data, auth, asyncRequest) {
                        if (auth === undefined || auth === null)
                            auth = app.service.auth;
                        if (asyncRequest === undefined)
                            asyncRequest = false;

                        if (os.ios === undefined) {
                            asyncRequest = true;
                        }
                        return $.ajax({
                            headers: {
                                Authorization: auth
                            },
                            data: data,
                            async: asyncRequest,
                            type: "Get",
                            url: app.config.cloudServiceURL + methodName,
                            success: function (content) {
                                //console.log("success :" + content.IsSuccess);                              
                            },
                            error: function (msg, url, line) {
                                app.loader.hide();
                                if (msg.statusText == "Unauthorized" || msg.statusText == "Upgrade Required" || msg.statusText == 'AuthenticateFailed') {
                                    switch (msg.statusText) {
                                        case 'Unauthorized':
                                            alert("Unauthorized");
                                            break;
                                        case 'Upgrade Required':
                                            alert("Outdated App Version. Please Update.");
                                            break;
                                        case 'AuthenticateFailed':
                                            alert("Invalid Username and/or Password.");
                                            break;
                                    }
                                }
                                if (msg.statusText == "error") {
                                    alert("Can't Connect To Server.");
                                }
                                app.loader.hide();
                            }
                        });
                    },
                    post: function (methodName, data, auth, asyncRequest) {
                        if (auth === undefined || auth === null)
                            auth = app.service.auth;
                        if (asyncRequest === undefined)
                            asyncRequest = false;
                        if (os.ios === undefined) {
                            asyncRequest = true;
                        }
                        asyncRequest = true;

                        return $.ajax({
                            headers: {
                                Authorization: auth
                            },
                            data: data,
                            async: asyncRequest,
                            type: "Post",
                            url: app.config.cloudServiceURL + methodName,
                            success: function (content) {
                                //console.log(content.IsSuccess);
                            },
                            error: function (msg, url, line) {
                                app.loader.hide();
                                if (msg.statusText == "Unauthorized" || msg.statusText == "Upgrade Required" || msg.statusText == 'AuthenticateFailed') {
                                    switch (msg.statusText) {
                                        case 'Unauthorized':
                                            alert("Unauthorized");
                                            break;
                                        case 'Upgrade Required':
                                            alert("Outdated App Version. Please Update.");
                                            break;
                                        case 'AuthenticateFailed':
                                            alert("Invalid Username and/or Password.");
                                            break;
                                    }
                                }
                                if (msg.statusText == "error") {
                                    alert("Can't Connect To Server.");
                                }
                                
                                app.loader.hide();
                            }
                        });
                    }
                };
            })();
        }
    };
})();