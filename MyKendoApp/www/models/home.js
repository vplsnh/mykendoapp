'use strict';
(function () {
    app.models.home = {
        init: function () {
            app.models.home = (function () {
                var viewModel = kendo.observable({
                    cnt: {
                        draft: "",
                        pending: "",
                        submitted: ""
                    }
                });
                return {                                       
                    onShow: function () {
                        app.db.transaction(function (tx) {
                            var query = "SELECT\
                                (SELECT COUNT(*) FROM Record1 where  IsSaved='Y' AND IsSubmitted='N') as draft,\
                                (SELECT COUNT(*) FROM Record1 where  IsSaved='Y' AND IsSubmitted='Y' AND IsSynced='" + false + "') as pending,\
                                (SELECT COUNT(*) FROM Record1 where  IsSaved='Y' AND IsSubmitted='Y' AND IsSynced='" + true + "') as submitted ";
                            tx.executeSql(query, [],
                                function (transaction, results) {

                                    viewModel.set('cnt.draft', results.rows.item(0).draft);
                                    viewModel.set('cnt.pending', results.rows.item(0).pending);
                                    viewModel.set('cnt.submitted', results.rows.item(0).submitted);
                                    alert(viewModel.cnt.draft +""+ viewModel.cnt.pending +""+ viewModel.cnt.submitted);
                                    
                                    app.loader.hide();
                                },
                            function (transaction, error) {
                                app.loader.hide();
                                alert('Error in Sup Query : ' + error.message);
                            });
                        });
          
                    }
                }
            })();
        }
    }
})();

