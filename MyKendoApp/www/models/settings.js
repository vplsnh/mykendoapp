'use strict';
(function () {
    app.models.settings = {
        init: function () {
            app.models.settings = (function () {
                var viewModel = kendo.observable({
                    saveToPhotoAlbum :""
                });
                var onShow = function () {
                    var settings = JSON.parse(window.localStorage.getItem('AppSettings'));
                    if (settings !== null) {
                        if (settings.isSaveToAlbumSet !== undefined) {                            
                            $("#savephototogallerySwitch").data("kendoMobileSwitch").check(settings.isSaveToAlbumSet);
                            viewModel.set('saveToPhotoAlbum', settings.isSaveToAlbumSet);
                        }
                    }
                };
                var onChange = function (e) {
                    var settings = JSON.parse(window.localStorage.getItem('AppSettings'));
                    settings.isSaveToAlbumSet = $("#savephototogallerySwitch").data("kendoMobileSwitch").check();
                    window.localStorage.setItem("AppSettings", JSON.stringify(settings));
                    if (settings.isSaveToAlbumSet) {
                        var autoSet = JSON.parse(window.localStorage.getItem('saveToAlbum'))
                        window.localStorage.setItem("saveToAlbum", JSON.stringify(autoSet));
                        viewModel.set('saveToPhotoAlbum', settings.isSaveToAlbumSet);
                    } else {
                        viewModel.set('saveToPhotoAlbum', settings.isSaveToAlbumSet);
                        window.localStorage.removeItem("saveToAlbum");
                    }
                };
                return {
                    viewModel:viewModel,
                    onShow: onShow,
                    onChange: onChange                    
                }
            })();
        }
    }
})();

