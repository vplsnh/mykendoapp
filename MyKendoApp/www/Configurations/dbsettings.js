'use strict';
var migrations = [];

(function () {
    app.db = {
        init: function () {
            app.db = (function () {
                var db = null;

                try {
                    if (app.config.isSimulator==true) {

                        db = openDatabase("vip26db", "0.1", "A Database of ITGI App", 2 * 1024 * 1024);
                    }
                    else {
                        db = window.sqlitePlugin.openDatabase({
                            name: "IFFCOTokioDB",
                            location: "default"
                        });
                    }

                } catch (err) {
                    alert(err.message);
                }

               if (db !== null) {
                        var App_Versioncreationflag = 0;
                        console.log("DB Created");
                        db.transaction(function (t) {

                            t.executeSql("CREATE TABLE IF NOT EXISTS 'App_Version' (	\
                            'Version' INTEGER PRIMARY KEY,\
                            'CreatedOn' TIMESTAMP DEFAULT (DATETIME(CURRENT_TIMESTAMP, 'LOCALTIME')) \
                             );", [],
                                     function (transaction, results) {
                                         App_Versioncreationflag = 1;
                                         console.log("App_Version created");
                                     },
                                     function (transaction, err) {
                                         console.log("App_Version Error  " + err.message);
                                     }
                                 );

                            t.executeSql("SELECT Version FROM App_Version ORDER BY Version DESC LIMIT 1", [],
                                function (transaction, results) {
                                    var version;
                                    if (results.rows.length > 0) {
                                        version = results.rows.item(0).Version;
                                        console.log("Version fetched " + version);

                                    }
                                    else {
                                        version = 0;
                                        console.log("Version 0 fetched");
                                    }

                                    kickOffMigration(version, transaction);

                                },
                                function (transaction, err) {
                                    //app.error.log('dbsettings', 'init', 'create StateMaster table', err.message);
                                    console.log("Version could not be fetched  " + err.message);
                                }
                            );



                        });
                    }
                
                return db;

            })();
        },
    };
})();

function kickOffMigration(version, transaction) {
    if (migrations[version] && typeof migrations[version] === 'function') {
        migrations[version](transaction);
    }
}
migrations[0] = function (t) {
    var nextVersion = 1;
    t.executeSql("CREATE TABLE IF NOT EXISTS 'Record1' (\
                             'Id' INTEGER,\
                            'Name' TEXT,\
                            'Address' TEXT,\
                            'InvNo' INTEGER,\
                            'MobNo' INTEGER,\
                             'DateCreated' TEXT\
                             );", [],
                             function (transaction, results) {
                                 console.log("Record Table created");
                                 
                             },
                             function (tranasation, err) {
                                 alert("Error:"+err.message)

                             }
                             );
    t.executeSql("CREATE TABLE IF NOT EXISTS 'Photos' (\
                            'Id' INTEGER,\
                             'CategoryId' INTEGER,\
                              'CategoryName' TEXT,\
                            'FileBase64' TEXT\
				    );", [],
		function (transaction, results) {
		    console.log("PhotosDB created");
		},
		function (transaction, err) {
		    alert("PhotosDB" + err.message);
		}
	);



    }