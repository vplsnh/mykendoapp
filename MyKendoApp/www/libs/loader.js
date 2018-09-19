'use strict';
(function () {
    app.loader = (function () {
        var show = function (message) {
            /// <summary>To show loader with message</summary>
            /// <param name="message" type="String">Message to show on loader</param>
            //if (message == app.loaderMessage.onUploadToCloud && app.sync.autoSync)
            //    return;
            if (message.toLowerCase() == 'no')
                return;
            if (message === undefined)
                message = 'Loading...';
            app.loader.currentMessage = message;
            $('#loader-bg').show();
            $('#loader').show();
            $('#loader').find('h2').html(message);
            $('#loader').css('top', (winHeight / 2 - $('#loader').height() / 2));
            app.loader.lastShowedFrom = 'show';
        };
        //var showDownloadPercentage = function (type, total, completed) {
        //    /// <summary>To show loader with percentage message</summary>
        //    /// <param name="type" type="String">Message type(appraisals, parts or docuemnttype)</param>
        //    /// <param name="total" type="Number">Total items</param>
        //    /// <param name="completed" type="Number">Completed items</param>
        //    var perc = GetProgressPercent(total, completed);
        //    var template = '';
            
        //    if (type == 'appraisals') { 
        //        if (app.loaderMessage.downloadingAppraisals.toLowerCase() == 'no')
        //            return;
                
        //        app.loader.showAppraisalPerc = true;
        //        app.loader.AppraisalPerc = perc;
        //        template += '<span>' + app.loaderMessage.downloadingAppraisals + ' ' + app.loader.AppraisalPerc + '%</span>';
        //        if (app.loader.showDocumentTypePerc)
        //            template += '<span>' + app.loaderMessage.downloadingDocumentType + ' ' + app.loader.DocumentTypePerc + '%</span>';
        //        if (app.loader.showPartMasterPerc)
        //            template += '<span>' + app.loaderMessage.downloadingParts + ' ' + app.loader.PartPerc + '%</span>';
        //    }
        //    if (type == 'parts') {
        //        if (app.loaderMessage.downloadingParts.toLowerCase() == 'no')
        //            return;
        //        app.loader.showPartMasterPerc = true;
        //        app.loader.PartPerc = perc;
        //        if (app.loader.showAppraisalPerc)
        //            template += '<span>' + app.loaderMessage.downloadingAppraisals + ' ' + app.loader.AppraisalPerc + '%</span>';
        //        if (app.loader.showDocumentTypePerc)
        //            template += '<span>' + app.loaderMessage.downloadingDocumentType + ' ' + app.loader.DocumentTypePerc + '%</span>';
        //        template += '<span>' + app.loaderMessage.downloadingParts + ' ' + app.loader.PartPerc + '%</span>';
        //    }
        //    if (type == 'documenttype') {
        //        if (app.loaderMessage.downloadingDocumentType.toLowerCase() == 'no')
        //            return;
        //        app.loader.showDocumentTypePerc = true;
        //        app.loader.DocumentTypePerc = perc;
        //        if (app.loader.showAppraisalPerc)
        //            template += '<span>' + app.loaderMessage.downloadingAppraisals + ' ' + app.loader.AppraisalPerc + '%</span>';
        //        template += '<span>' + app.loaderMessage.downloadingDocumentType + ' ' + app.loader.DocumentTypePerc + '%</span>';
        //        if (app.loader.showPartMasterPerc)
        //            template += '<span>' + app.loaderMessage.downloadingParts + ' ' + app.loader.PartPerc + '%</span>';
                
        //    }
            
        //    $('#loader-bg').show();
        //    $('#loader').show();
        //    $('#loader').find('h2').html(template);
        //    if (completed == 0 || app.loader.lastShowedFrom == 'show')
        //        $('#loader').css('top', (winHeight / 2 - $('#loader').height() / 2));

        //    if (app.loader.showAppraisalPerc && app.loader.showPartMasterPerc && app.loader.showDocumentTypePerc) {
        //        if (app.loader.AppraisalPerc == 100 && app.loader.PartPerc == 100 && app.loader.DocumentTypePerc == 100) {
        //            app.loader.showPartMasterPerc = false;
        //            app.loader.showAppraisalPerc = false;
        //            app.loader.showDocumentTypePerc = false;
        //            app.loader.PartPerc = 0;
        //            app.loader.AppraisalPerc = 0;
        //            app.loader.DocumentTypePerc = 0;
        //            app.loader.hide();
        //        }
        //    }
        //    else if (app.loader.showAppraisalPerc && app.loader.AppraisalPerc == 100) {
        //        app.loader.showAppraisalPerc = false;
        //        app.loader.AppraisalPerc = 0;
        //        app.loader.hide();
        //    }
        //    else if (app.loader.showPartMasterPerc && app.loader.PartPerc == 100) {
        //        app.loader.showPartMasterPerc = false;
        //        app.loader.PartPerc = 0;
        //        app.loader.hide();
        //    }
        //    else if (app.loader.showDocumentTypePerc && app.loader.DocumentTypePerc == 100) {
        //        app.loader.showDocumentTypePerc = false;
        //        app.loader.DocumentTypePerc = 0;
        //        app.loader.hide();
        //    }
        //    app.loader.lastShowedFrom = 'showDownloadPercentage';
        //};
        var hide = function () {
            app.loader.currentMessage = '';
            $('#loader-bg').hide();
            $('#loader').hide();
        };
        return {
            'show': show,
            'currentMessage':'',
            'lastShowedFrom':'',
            'showDownloadPercentage':'',
            'hide': hide,
            'showAppraisalPerc': false,
            'showPartMasterPerc': false,
            'showDocumentTypePerc': false,
            'AppraisalPerc': 0,
            'PartPerc': 0,
            'DocumentTypePerc': 0
        }
    })();
})();