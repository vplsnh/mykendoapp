'use strict';
(function () {
    app.models.TwoWheelerNew = {
        init: function () {
            app.models.TwoWheelerNew = (function () {

                var viewModel = kendo.observable({
                    visibility: {
                        homeSuvidha: true,
                        tradeSuvidha: true,
                        ipf: true,
                        twoWheelerPolicy: true,
                        jantaSuraksha: true,
                        janSewaBimaYojana: true,
                        pcpCalculator: true,
                        healthInsurance: true,
                        punchAuthority: true,
                        meetingAuthority: true,
                        suprabhatVisibility: true
                    },
                    lang: app.strings.en,
                    menuLang: app.strings.en,
                    manufacturerName: '',
                    policyType: '',
                    // yearArray: [],
                    insuranceType: '',
                    selectedState: '',
                    selectedCity: '',
                    selectedTwoWheelerType: '',
                    selectedYear: '',
                    selectedVariant: '',
                    selectedPolicyPeriod: '',
                    selectedRegDate:'',
                    selectedInceptionDate:'',
                    selectedPolicyExpDate: '',
                    selectedDiscount:'',
                    inceptionDateModel: '',
                    twpVehicleDetails: {
                        ContractType: "TWP",
                        PolicyType: "Comprehensive",
                        InsuranceType: "NEW",
                        RegistrationState: "",
                        RegistrationCity: "",
                        Manufacturer: "",
                        Model: "",
                        Variant: "",
                        MakeCode: "",
                        ManufacturingYear: "",
                        DateofFirstRegistration: "",
                        PolicyInceptionDate: "",
                        PolicyExpirationDate: "",
                        PreviousPolicyExpirationDate: "",
                        PreviousPolicyClaim: "",
                        NCB: "0",
                        Discount: "0",
                        IDV: "",
                        //AAIDiscount: "No",
                        AAINumber: "",
                        AAIExpiryDate: "",
                        AAI: "No",
                        twoWheelerType: "",
                        policyPeriod: "",
                        ManufacturerList: [],
                        ModelList: [],
                        VariantList: [],
                        PreviousNCB: "",
                        quickQuoteId: "",
                        insuredName: "",
                        mobileNo: "",
                        emailId: "",
                        quickQuotePremium: "",
                        IsPrevPolicyExpDateReq: false, //Added on 31 May
                        isPreviousNCBDisabled: false
                    }
                });
                var updateVisibility = function (user) {

                    var suprabhatVisibility = false;
                    if (user.PunchAuthority == 'True' || user.MeetingAuthority == 'True') {
                        suprabhatVisibility = true;
                    }
                    viewModel.set('visibility', {
                        homeSuvidha: (user.HomeSuvidha == 'True'),
                        tradeSuvidha: (user.TradeSuvidha == 'True'),
                        ipf: (user.IndividualPersonalAccident == 'True'),
                        twoWheelerPolicy: (user.TwoWheelerPolicy == 'True'),
                        jantaSuraksha: (user.JantaSuraksha == 'True'),
                        janSewaBimaYojana: (user.JanSewaBimaYojana == 'True'),
                        pcpCalculator: (user.PCPCalculator == 'True'),
                        healthInsurance: (user.HealthInsurance == 'True'),
                        punchAuthority: (user.PunchAuthority == 'True'),
                        meetingAuthority: (user.MeetingAuthority == 'True'),
                        suprabhatVisibility: suprabhatVisibility
                    });
                }
                var suprabhatBack = function (e) {
                    e.preventDefault();
                    app.mobileApp.navigate("views/home.html");
                }
                var getModelList = function (manufacture) {
                    viewModel.manufacturerName = manufacture;
                    viewModel.twpVehicleDetails.Manufacturer = viewModel.manufacturerName
                    console.log("selected manuf", viewModel.manufacturerName);
                    // var modelList = [];
                    app.mobileApp.navigate("views/modelsList.html");
                };
                var getVarient = function (modelName) {
                    // var variantList = [];
                    viewModel.selectedModel = modelName;
                    viewModel.twpVehicleDetails.Model = viewModel.selectedModel;
                    console.log("selected model", viewModel.selectedModel);
                    app.mobileApp.navigate("views/variantList.html");
                };

                var getCityList = function (state) {
                    // var cityList = [];
                    viewModel.twpVehicleDetails.RegistrationState = '';
                    viewModel.selectedState = state;
                    viewModel.twpVehicleDetails.RegistrationState = viewModel.selectedState;
                    console.log("selected state", viewModel.selectedState);
                    app.mobileApp.navigate('views/cityList.html');
                };

                var getSelectedPolicy = function(period){
                    console.log("period is=>", period);
                    viewModel.selectedPolicyPeriod  = period;
                    viewModel.twpVehicleDetails.policyPeriod = viewModel.selectedPolicyPeriod;
                    console.log("selected period", viewModel.selectedPolicyPeriod);
                    app.mobileApp.navigate('views/policyDates.html');
                };
                var getPolicyPeriod = function(){
                    console.log("selected variant", viewModel.selectedPolicyPeriod);
                    // var policyPeriodList = [
                    //     {
                    //         name: "1 Year",
                    //         id: "1"
                    //     },
                    //     {
                    //         name: "2 Years",
                    //         id: "2"
                    //     },
                    //     {
                    //         name: "3 Years",
                    //         id: "3"
                    //     }
                    // ]
                    
                    // $("#policyPeriodList").kendoListView({
                    //     dataSource: policyPeriodList,
                    //     template: kendo.template($("#policyPeriodTemplate").html())
                    // });
                };

                var getPolicyType = function (type) {
                    viewModel.policyType = type;
                    viewModel.twpVehicleDetails.PolicyType = viewModel.policyType;
                    console.log("policy type", viewModel.policyType);
                    app.mobileApp.navigate('views/stateList.html');
                };

                var getInsuranceType = function (iType) {
                    viewModel.insuranceType = iType;
                    viewModel.twpVehicleDetails.InsuranceType = viewModel.insuranceType;
                    console.log("insurance type", viewModel.insuranceType);
                    app.mobileApp.navigate('views/policyType.html');
                };
                var filterStates = function(keyInput){
                    console.log("pressed", keyInput)
                    // viewModel.stateList.filter()
                };
                var getCityName = function(city){
                    viewModel.selectedCity = city;
                    viewModel.twpVehicleDetails.RegistrationCity = viewModel.selectedCity;
                    console.log("selected city", viewModel.selectedCity);
                    app.mobileApp.navigate('views/manufacturerList.html');
                };
                var getSelectedYear = function(yearIs){
                    viewModel.selectedYear = yearIs;
                    viewModel.twpVehicleDetails.ManufacturingYear = viewModel.selectedYear;
                    console.log("selected year", viewModel.selectedYear);
                    app.mobileApp.navigate('views/policyPeriodList.html');
                };
                var getTwoWheelerType = function(variant){
                    viewModel.selectedVariant = variant;
                    viewModel.twpVehicleDetails.Variant = viewModel.selectedVariant;
                    console.log("selected variant", viewModel.selectedVariant);
                    app.mobileApp.navigate('views/vehicleType.html');
                };
                var getYears = function (type) {
                    viewModel.selectedTwoWheelerType = type;
                    // viewModel.twpVehicleDetails
                    console.log("selected twt", viewModel.selectedTwoWheelerType);
                    app.mobileApp.navigate('views/mfYearList.html');

                };

                var getRegDate = function(selectedRegDate){

                    let date = new Date();

                    let period = +viewModel.selectedPolicyPeriod;
                    console.log("period=====>", period)
                    let startInception = new Date(date.getTime());
                    let endInception = new Date(date.getTime() + (365 * period * 24 * 60 * 60 * 1000));
                    // "0" + (dt.getMonth() + 1)).slice(-2) + "/" + ("0" + (dt.getDate())).slice(-2) + "/" + (dt.getFullYear()
                    // console.log("=>", start);
                    let yyyy = selectedRegDate.slice(0,4);
                    let mm = selectedRegDate.slice(5,7);
                    let dd = selectedRegDate.slice(8,11);
                    let formattedRegDate = mm+"/"+dd+"/"+yyyy;
                    console.log("sliced date", formattedRegDate);
                    viewModel.selectedRegDate = formattedRegDate;
                    viewModel.twpVehicleDetails.DateofFirstRegistration = viewModel.selectedRegDate;
                    console.log("reg date =>", viewModel.twpVehicleDetails.DateofFirstRegistration);
                };

                var getInceptionDate = function(inceptionDateIs){
                    let yyyy = inceptionDateIs.slice(0,4);
                    let mm = inceptionDateIs.slice(5,7);
                    let dd = inceptionDateIs.slice(8,11);
                    let formattedInceptionDate = mm+"/"+dd+"/"+yyyy;
                    console.log("sliced date", formattedInceptionDate);
                    viewModel.selectedInceptionDate = formattedInceptionDate;
                    viewModel.twpVehicleDetails.PolicyInceptionDate = viewModel.selectedInceptionDate;
                    console.log("reg date =>", viewModel.twpVehicleDetails.PolicyInceptionDate);

                };

                var getPolicyExpDate = function(policyExpdate){
                    let yyyy = policyExpdate.slice(0,4);
                    let mm = policyExpdate.slice(5,7);
                    let dd = policyExpdate.slice(8,11);
                    let formattedPolicyDate = mm+"/"+dd+"/"+yyyy;
                    console.log("sliced date", formattedPolicyDate);
                    viewModel.selectedPolicyExpDate = formattedPolicyDate;
                    viewModel.twpVehicleDetails.PolicyExpirationDate = viewModel.selectedPolicyExpDate;
                    console.log("reg date =>", viewModel.twpVehicleDetails.PolicyExpirationDate);

                };

                var getDiscount = function(discountVal){
                    viewModel.selectedDiscount = discountVal;
                    viewModel.twpVehicleDetails.Discount = viewModel.selectedDiscount;
                    console.log("reg date =>", viewModel.twpVehicleDetails.Discount);

                };

                var getQuickQuote = function () {
                    var makeCode;
                    var PPexpDate = '';
                    var currentdate = new Date();
                    var FormattedDate = ("0" + (currentdate.getMonth() + 1)).slice(-2) + "/" + ("0" + (currentdate.getDate())).slice(-2) + "/" + (currentdate.getFullYear());
                        var quickQuote = viewModel.twpVehicleDetails;
                        console.log("quick quote", quickQuote);
                                    if (quickQuote.quickQuoteId != '' && quickQuote.quickQuoteId != 'null') {
                                        app.db.transaction(function (tx) {
                                            tx.executeSql("Select MakeCode from MakeMaster Where Manufacturer = ? and Model =? and Variant=? Order By MakeCode", [quickQuote.Manufacturer, quickQuote.Model, quickQuote.Variant],
                                                function (tx, res) {
                                                    if (res.rows.length > 0) {
                                                        makeCode = res.rows.item(0).MakeCode;
                                                        tx.executeSql("Update TWPQuickQuote Set UserId =?,RegistrationState=?,RegistrationCity=?,RegistrationDate=?,Manufacturer=?,Model=?,MakeCode=?,Variant=?,NCB=?,Discount=?,UpdatedOn=?,PolicyPeriod=?,InsuredName=?,MobileNo=?,EmailId=?,InceptionDate=?,ExpirationDate=?,PolicyType=?,ManufacturingYear=?,PreviousPolicyExpDate=? Where Id=?", [app.user.id, quickQuote.RegistrationState, quickQuote.RegistrationCity, quickQuote.DateofFirstRegistration, quickQuote.Manufacturer, quickQuote.Model, makeCode, quickQuote.Variant, quickQuote.NCB, quickQuote.Discount, FormattedDate, quickQuote.policyPeriod, quickQuote.insuredName, quickQuote.mobileNo, quickQuote.emailId, formatDate(quickQuote.PolicyInceptionDate), formatDate(quickQuote.PolicyExpirationDate), quickQuote.PolicyType, quickQuote.ManufacturingYear, PPexpDate, quickQuote.quickQuoteId],
                                                            function (tx, res) {
                                                                app.loader.show("Submitting Data...Wait for a while."); //-----------------------------------
                                                                getQuickQuoteEstimatePremium(); //----------------------------------


                                                            },
                                                            function (tx, res) {
                                                                app.error.log('TWPQuickQuote', 'quickQuote', 'Update quickQuote', res.message);
                                                            });
                                                    }
                                                },
                                                function (tx, res) {
                                                    app.error.log('TWPQuickQuote', 'quickQuote', 'Update quickQuote', res.message);
                                                });
                                        });
                                    } else {
                                        app.db.transaction(function (tx) {
                                            tx.executeSql("Select MakeCode from MakeMaster Where Manufacturer = ? and Model =? and Variant=? Order By MakeCode", [quickQuote.Manufacturer, quickQuote.Model, quickQuote.Variant],
                                                function (tx, res) {
                                                    if (res.rows.length > 0) {
                                                        makeCode = res.rows.item(0).MakeCode;
                                                        tx.executeSql(
                                                            "INSERT INTO TWPQuickQuote (UserId,RegistrationState,RegistrationCity,RegistrationDate,Manufacturer,Model,MakeCode,Variant,NCB,Discount,CreatedOn,UpdatedOn,PolicyPeriod,InsuredName,MobileNo,EmailId,InceptionDate,ExpirationDate,PolicyType,ManufacturingYear,PreviousPolicyExpDate) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)", [app.user.id, quickQuote.RegistrationState, quickQuote.RegistrationCity, quickQuote.DateofFirstRegistration, quickQuote.Manufacturer, quickQuote.Model, makeCode, quickQuote.Variant, quickQuote.NCB, quickQuote.Discount, FormattedDate, 'null', quickQuote.policyPeriod, quickQuote.insuredName, quickQuote.mobileNo, quickQuote.emailId, quickQuote.PolicyInceptionDate, quickQuote.PolicyExpirationDate, quickQuote.PolicyType, quickQuote.ManufacturingYear, PPexpDate],
                                                            function (tx, res) {
                                                            },
                                                            function (tx, res) {
                                                                app.error.log('TWPQuickQuote', 'quickQuote', 'Insert quickQuote', res.message);
                                                            });
                                                        tx.executeSql("Select seq from sqlite_sequence Where Name = ?", ['TWPQuickQuote'],
                                                            function (tx, res) {
                                                                if (res.rows.length > 0) {
                                                                    app.models.TwoWheelerNew.viewModel.set('twpVehicleDetails.quickQuoteId', res.rows.item(0).seq);
                                                                    app.loader.show("Submitting Data...Wait for a while.");
                                                                    getQuickQuoteEstimatePremium();
                                                                }
                                                            },
                                                            function (tx, res) {
                                                                app.error.log('sqlite_sequence', 'quickQuote', 'Select seq id', res.message);
                                                            });
                                                    }
                                                },
                                                function (tx, res) {
                                                    app.error.log('TWPQuickQuote', 'quickQuote', 'Insert quickQuote', res.message);
                                                });
                                        });
                                    }
                }

               var getQuickQuoteEstimatePremium = function () {
                    var twpquoteData = {};
                    var qQid = app.models.TwoWheelerNew.viewModel.twpVehicleDetails.quickQuoteId;
                    app.db.transaction(function (t) {
                        t.executeSql("SELECT * FROM TWPQuickQuote WHERE Id = ?", [qQid],
                            function (transaction, result) {
                                if (result.rows.length > 0) {

                                    twpquoteData = result.rows.item(0);
                                    twpquoteData.make = result.rows.item(0).MakeCode

                                }
                                // console.log(twpquoteData);
                                var twpPostData = {
                                    twpVehicleDetails: {}
                                };
                                console.log("twpquotedata", twpquoteData);
                                twpPostData.twpVehicleDetails = twpquoteData;
                                twpPostData.twpVehicleDetails.motorPolicyType = "TWP";
                                twpPostData.twpVehicleDetails.nonElectricalAccessoriesValue = 0;
                                console.log('Quick Quote Request :' + JSON.stringify(twpPostData));
                                if (app.isOnline()) {
                                    app.service.post('CalculateMotorPremium', twpPostData).then(function (response) {
                                        // console.log(response);
                                        if (response.IsSuccess) {
                                            app.loader.hide();
                                            customAlert('Estimate Premium: Rs ' + response.motorPremium.pREMIUM_PAYBLEField);
                                            // app.models.TwoWheeler.twpInsuranceView.viewModel.twpVehicleDetails.set('quickQuotePremium', response.motorPremium.pREMIUM_PAYBLEField);
                                            // document.getElementById("vdnextbutton").style.display = 'block';
                                            // document.getElementById("vehiclequickquoteshare").style.display = 'block';
                                            // document.getElementById("vehicleQuickQuote").style.display = 'none';
                                            // document.getElementById("spEstimatePremium").style.display = 'block';
                                            // scrollToBottom();
                                            document.getElementById("shareButton").style.removeProperty('display');
                                            document.getElementById("nextButton").style.removeProperty('display');

                                            document.getElementById("shareButton").style.display = "block !important";
                                            document.getElementById("nextButton").style.display = "block !important";
                                        } else {
                                            app.loader.hide();
                                            customAlert(response.ErrorMessage);
                                        }
                                    }, function (response, err) {
                                        app.loader.hide();
                                        customAlert('Error ', err);
                                    });
                                } else {
                                    app.loader.hide();
                                    customAlert('No Internet Connection!');
                                }
                            },
                            function (transaction, err) {
                                app.loader.hide();
                                customAlert(err.message);
                            });
                    }); //transaction end                     
                }
                var NexttoAdditionalCoverages = function(){

                    app.mobileApp.navigate('views/additionalCoveragesNew.html');
                }

                var CheckPreviousPolicyInceptionDate = function (iDate, eDate) {
                    var PreviousPolicyExpirationDate = new Date(formatDate(eDate));
                    var PreviousPolicyInceptionDate = new Date(formatDate(iDate));
                    var dateDiff = Math.ceil((PreviousPolicyExpirationDate - PreviousPolicyInceptionDate) / (1000 * 3600 * 24));
                    console.log("difference:" + dateDiff);
                    if (dateDiff < 1) {
                        customAlert("Previous Policy Inception Date can not more than or equal to Previous Policy Expiration Date.");
                        viewModel.set('PreviousPolicyInceptionDateCheck', false);
                        return;
                    } else {
                        viewModel.set('PreviousPolicyInceptionDateCheck', true);
                        return;
                    }
                }
                
                return {
                    viewModel: viewModel,
                    updateVisibility: updateVisibility,
                    suprabhatBack: suprabhatBack,
                    'getCityList': getCityList,
                    'getModelList': getModelList,
                    'getVarient': getVarient,
                    'getYears': getYears,
                    'getPolicyType': getPolicyType,
                    'getInsuranceType': getInsuranceType,
                    'filterStates': filterStates,
                    'getCityName': getCityName,
                    'getTwoWheelerType': getTwoWheelerType,
                    'getSelectedYear': getSelectedYear,
                    'getPolicyPeriod': getPolicyPeriod,
                    'getSelectedPolicy': getSelectedPolicy,
                    'getQuickQuote': getQuickQuote,
                    'getQuickQuoteEstimatePremium' : getQuickQuoteEstimatePremium,
                    'getRegDate' : getRegDate,
                    'getInceptionDate' : getInceptionDate,
                    'getPolicyExpDate' : getPolicyExpDate,
                    'getDiscount' : getDiscount,
                    'NexttoAdditionalCoverages': NexttoAdditionalCoverages,
                    
                    onShow: function (e) {
                        // var stateNamelist = [];
                        // viewModel.stateList = [];
                        getPolicyPeriod();
                    },

                }
            })();
            app.models.TwoWheelerNew.policyType = (function (){
                var viewModel = kendo.observable({

                });
                
                return {
                    viewModel: viewModel,

                    onShow: function(){
                        console.log("i am inn");
                    }
                }

            })();
            app.models.TwoWheelerNew.regStates = (function (){
                var viewModel = kendo.observable({
                    stateList: [],
                    backupstateList: []
                });
                
                return {
                    viewModel: viewModel,

                    onShow: function(e){
                        console.log("stateList");
                        viewModel.stateList = [];
                        viewModel.stateList.push({
                            StateName: "ABCD",
                            StateId:"ABCD"
                        },
                        {
                            StateName: "AHSKLDHAKLSD",
                            StateId: "ABCD"
                        },
                        {
                            StateName: "KASHDIAS",
                            StateId: "ABCD"

                        });
                        $("#listView").kendoListView({
                                  dataSource: viewModel.stateList,
                                  template: kendo.template($("#template").html())
                         });
                        //app.db.transaction(function (t) {
                        //    t.executeSql("SELECT StateName,StateId FROM 'StateMaster' ORDER BY StateName", [],
                        //        function (transaction, results) {
                        //            if (results.rows.length > 0) {
                        //                for (var i = 0; i < results.rows.length; i++) {
                        //                    // stateNamelist.push(results.rows.item(i));
                        //                    viewModel.stateList.push(results.rows.item(i));
                        //                    if (i == results.rows.length - 1) {
                        //                        console.log("state list", viewModel.stateList);
                        //                        viewModel.backupstateList = viewModel.stateList;
                        //                        $("#listView").kendoListView({
                        //                            dataSource: viewModel.stateList,
                        //                            template: kendo.template($("#template").html())
                        //                        });
                        //                    }
                        //                }
                        //            }
                        //        })

                        //})

                        $("#filterState").on("click", function (e) {
                            window.onkeydown = function (event) {
                                    console.log("key pressed", event.key);
                                    let val = event.key;
                                    if(val && val.trim() != ''){

                                        if (event.key == "Backspace") {
                                            console.log("gotcha")
                                            viewModel.stateList = viewModel.backupstateList;
                                            console.log("gotcha---->", viewModel.stateList);
                                            $("#listView").kendoListView({
                                                dataSource: viewModel.stateList,
                                                template: kendo.template($("#template").html())
                                            });
                                          }else{
                                            viewModel.stateList = viewModel.stateList.filter(item =>{
                                                return item.StateName.toLowerCase().indexOf(val.toLowerCase()) > -1
                                            })
                                            $("#listView").kendoListView({
                                                dataSource: viewModel.stateList,
                                                template: kendo.template($("#template").html())
                                            });
                                            console.log("filtered list", viewModel.stateList);
                                          }

                                    }else{
                                        console.log("gotcha=>", viewModel.backupstateList);

                                        $("#listView").kendoListView({
                                            dataSource: viewModel.backupstateList,
                                            template: kendo.template($("#template").html())
                                        });
                                    }

                                }
                        });
                    }
                }
            })();
            app.models.TwoWheelerNew.regCities = (function (){
                var viewModel = kendo.observable({
                    cityList: [],
                    backupCityList: [],
                });
                
                return {
                    viewModel: viewModel,

                    onShow: function(e){
                        viewModel.cityList= []
                        viewModel.backupCityList= []
                        app.db.transaction(function (tx) {
                            tx.executeSql("SELECT CityName,CityId FROM 'RTOCityMaster' WHERE StateId='" + app.models.TwoWheelerNew.viewModel.twpVehicleDetails.RegistrationState + "'ORDER BY CityName", [],
                                function (transaction, results) {
                                    if (results.rows.length > 0) {
                                        for (var i = 0; i < results.rows.length; i++) {
                                            viewModel.cityList.push(results.rows.item(i));
                                            if (i == results.rows.length - 1) {
                                                viewModel.backupCityList = viewModel.cityList;
                                                console.log("city list result", viewModel.cityList);
                                                $("#listView1").kendoListView({
                                                    dataSource: viewModel.cityList,
                                                    template: kendo.template($("#template1").html())
                                                });
                                            }
                                        }
                                    }
                                }
                            )
                        })

                        $("#filterCity").on("click", function(e){
                            window.onkeydown = function (event){
                                console.log("key pressed", event.key);
                                let val = event.key;
                                if(val && val.trim() != ''){

                                    if (event.key == "Backspace") {
                                        console.log("gotcha")
                                        viewModel.cityList = viewModel.backupCityList;
                                        console.log("gotcha---->", viewModel.cityList);
                                        $("#listView1").kendoListView({
                                            dataSource: viewModel.cityList,
                                            template: kendo.template($("#template1").html())
                                        });
                                      }else{
                                        viewModel.cityList = viewModel.cityList.filter(item =>{
                                            return item.CityName.toLowerCase().indexOf(val.toLowerCase()) > -1
                                        })
                                        $("#listView1").kendoListView({
                                            dataSource: viewModel.cityList,
                                            template: kendo.template($("#template1").html())
                                        });
                                        console.log("filtered list", viewModel.cityList);
                                      }

                                }else{
                                    console.log("gotcha=>", viewModel.backupCityList);

                                    $("#listView1").kendoListView({
                                        dataSource: viewModel.backupCityList,
                                        template: kendo.template($("#template1").html())
                                    });
                                }
                            }
                        })
                    }
                }
            })();
            app.models.TwoWheelerNew.manufactures = (function (){
                var viewModel = kendo.observable({
                    manufacturersList: [],
                    backupManufacturerList: [],
                });

                return {
                    viewModel: viewModel,

                    onShow: function(e){
                        console.log("inside mf list");
                        viewModel.manufacturersList = [];
                        viewModel.backupManufacturerList = [];
                        viewModel.manufacturersList.push({
                            Id: 'Honda',
                            manufacturerName: 'Honda'
                        },
                {
                    Id: 'Hyundai',
                    manufacturerName: 'Hyundai'
                },
                {
                    Id: 'Mahindra',
                    manufacturerName: 'Mahindra'
                },
                {
                    Id: 'Suzuki',
                    manufacturerName: 'Suzuki'
                },
                {
                    Id: 'Toyota',
                    manufacturerName: 'Toyota'
                },
                {
                    Id: 'Tata',
                    manufacturerName: 'Tata'
                },
                {
                    Id: 'Chevrolet',
                    manufacturerName: 'Chevrolet'
                },
                {
                    Id: 'Ford',
                    manufacturerName: 'Ford'
                },
                {
                    Id: 'Skoda',
                    manufacturerName: 'Skoda'
                });
                        $("#listView2").kendoListView({
                            dataSource: viewModel.manufacturersList,
                            template: kendo.template($("#template2").html())
                        });
                   },
                     back: function (e) {
                            e.preventDefault();
                            app.mobileApp.navigate("views/home.html");
                        }
                }
            })();
            app.models.TwoWheelerNew.vehicleModels = (function (){
                var viewModel = kendo.observable({
                    modelList: [],
                    backupModelList: [],
                    manufacturename:[]
                });

                return {
                    viewModel: viewModel,

                    onShow: function(e){
                        viewModel.modelList = [];
                        viewModel.backupModelList = [];
                        viewModel.modelList.push(
                            {

                            Model:"AltoK10"
                         },
                        {
                            Model:"Baleno"
                        },
                        {
                            Model:"Alto800"

                        },
                        {

                            Model:"Alto"
                        },
                        {

                            Model: "Ritz"
                        },
                        {

                            Model: "Swift"
                        },
                        {

                            Model: "Swift Dzire"
                        },
                        {

                            Model: "WagonR"
                        },
                        {

                            Model: "Estilo"
                        }
                        );
                        $("#listView3").kendoListView({
                            dataSource: viewModel.modelList,
                            template: kendo.template($("#template3").html())
                        });
                        $("#stack").kendoListView({
                            dataSource: viewModel.manufacturename,
                            template: kendo.template($("#templatestack").html())
                        });

                        

                       
                    },
                    back: function (e) {
                        e.preventDefault();
                        viewModel.manufacturename = [];
                        app.mobileApp.navigate("views/manufacturerList.html");
                    }

                }

            })();
            app.models.TwoWheelerNew.modelVariants = (function (){
                var viewModel = kendo.observable({
                    variantList: [],
                    backupVariantList: []
                });

                return {
                    viewModel: viewModel,

                    onShow: function(e){
                        viewModel.variantList= [];
                        viewModel.backupVariantList = [];
                        viewModel.variantList.push({
                            Variant:"Petrol"
                        },
                        {
                            Variant: "Diesel"
                        },
                        {
                            Variant: "CNG"
                        });
                        $("#listView4").kendoListView({
                            dataSource: viewModel.variantList,
                            template: kendo.template($("#template4").html())
                        });
                       

                       
                    }
                }
            })();
            app.models.TwoWheelerNew.vehicleType = (function (){
                var viewModel = kendo.observable({
                    // variantList: [],
                    // backupVariantList: []
                });

                var getVehicleType = function(){
                    console.log("inside vehicle type");
                    var twoWheelerType = [
                        {type: "Electric Bike"},
                        {type: "Motor Cycle"},
                        {type: "Scooter"}
                    ]
                    
                    $("#wheelerTypeList").kendoListView({
                        dataSource: twoWheelerType,
                        template: kendo.template($("#twoWheelerTypeTemplate").html())
                    });
                };

                return {
                    viewModel: viewModel,
                    "getVehicleType": getVehicleType,

                    onShow: function(e){
                    console.log("inside type");
                        getVehicleType();
                    }
                }
            })();
            app.models.TwoWheelerNew.regYears = (function (){
                var viewModel = kendo.observable({
                    // variantList: [],
                    // backupVariantList: []
                    yearArray: []
                });

                var getYearList = function(){
                    console.log("inside vehicle type");
                    viewModel.yearArray = [];
                    var date = new Date();
                    var dateString = new Date(date.getTime());
                    var currentYear = dateString.getFullYear();
                    if (app.models.TwoWheelerNew.viewModel.twpVehicleDetails.policyType == "Comprehensive") {
                        for (var i = 0; i <= 10; i++) {
                            viewModel.yearArray.push({ year: dateString.getFullYear() - i });
                            if (i == 10) {
                                $("#yearList").kendoListView({
                                    dataSource: viewModel.yearArray,
                                    template: kendo.template($("#yearTemplate").html())
                                });
                            }
                        }
                    } else {
                        for (var i = 0; i <= 15; i++) {
                           viewModel.yearArray.push({ year: dateString.getFullYear() - i });
                            if (i == 15) {
                                $("#yearList").kendoListView({
                                    dataSource: viewModel.yearArray,
                                    template: kendo.template($("#yearTemplate").html())
                                });
                            }
                        }
                    }

                };

                return {
                    viewModel: viewModel,
                    "getYearList": getYearList,

                    onShow: function(e){
                    console.log("inside type");
                        getYearList();
                    }
                }
            })();
            app.models.TwoWheelerNew.policyPeriodData = (function (){
                var viewModel = kendo.observable({
                    // variantList: [],
                    // backupVariantList: []
                });

                var getPolicy = function(){
                    var policyPeriodList = [
                        {
                            name: "1 Year",
                            id: "1"
                        },
                        {
                            name: "2 Years",
                            id: "2"
                        },
                        {
                            name: "3 Years",
                            id: "3"
                        }
                    ]
                    
                    $("#policyPeriodList").kendoListView({
                        dataSource: policyPeriodList,
                        template: kendo.template($("#policyPeriodTemplate").html())
                    });
                };

                return {
                    viewModel: viewModel,
                    "getPolicy": getPolicy,

                    onShow: function(e){
                        getPolicy();
                    }
                }
            })();
            app.models.TwoWheelerNew.policyDates = ( function (){
                var viewModel = kendo.observable({

                });

                return {
                    viewModel: viewModel,

                    onShow: function(e){
                    }
                }
            })();

            app.models.TwoWheelerNew.twpadditionalCoverages = (function(){
                var viewModel = kendo.observable({
                    twpadditionalCoveragesModel: {
                        1: {
                            name: "Anti-Theft",
                            value: "N",
                            confirmation: "N"
                        },

                        2: {
                            name: "Voluntary Excess",
                            value: "",
                            confirmation: "N"
                        },

                        3: {
                            name: "Geographical Area",
                            value: "",
                            confirmation: "N",
                        },

                        4: {
                            name: "Electrical Accessories",
                            value: "",
                            confirmation: "N"
                        },

                        5: {
                            name: "Legal Liability to Driver",
                            value: "N",
                            confirmation: "N"
                        },

                        6: {
                            name: "PA to Passenger",
                            value: "",
                            confirmation: "N"
                        },
                        7: {
                            name: "CNG Kit",
                            value: "",
                            confirmation: "N"
                        },
                        8: {
                            name: "Legal Liability to Employee",
                            value: "",
                            confirmation: "N"
                        }
                    },
                    twpbasicCoveragesModel: {
                        1: {
                            name: "IDV Basic",
                            value: "",
                            confirmation: ""
                        },
                        2: {
                            name: "PA Owner / Driver",
                            value: "Y",
                            confirmation: "N"
                        }
                    },
                    twpNCBCoveragesModel: {
                        1: {
                            name: "No Claim Bonus",
                            value: ""
                        }
                    },
                    nonElectricalAccessories: {
                        confirmation: 'N',
                        value: ""
                    }
                });

                var getVexcess = function(atfValue){
                    let selectedRadio = atfValue;
                    // let selectedRadio = document.getElementById("atf").value;
                    console.log("====>", selectedRadio);
                    if(selectedRadio == "1"){
                        document.getElementById("amountDiv").style.removeProperty('display');

                        document.getElementById("amountDiv").style.display = "block";
                    }else{
                        document.getElementById("amountDiv").style.removeProperty('display');

                        document.getElementById("amountDiv").style.display = "none";
                    }
                }

                var getPaPassenger = function(paValue){
                    console.log("====>", paValue);
                    if(paValue == "1"){
                        document.getElementById("sumDiv").style.removeProperty('display');

                        document.getElementById("sumDiv").style.display = "block";
                    }else{
                        document.getElementById("sumDiv").style.removeProperty('display');

                        document.getElementById("sumDiv").style.display = "none";
                    }
                }

                var NexttoValueAutoCoverages = function(){
                    app.mobileApp.navigate('views/valueAutoCoveragesNew.html');
                }
                return {
                    viewModel: viewModel,
                    // "getArray": getArray,
                    "getVexcess": getVexcess,
                    "getPaPassenger": getPaPassenger,
                    "NexttoValueAutoCoverages": NexttoValueAutoCoverages,

                    onShow: function(){
                        console.log("i am inn");
                        document.getElementById("amountDiv").style.display = "none";
                        document.getElementById("sumDiv").style.display = "none";
                           var antiTheftList = [
                               {
                                   name: "Yes",
                                   id: "1"
                               },
                               {
                                   name: "No",
                                   id: "0"
                               }
                           ]
                           
                           $("#atList").kendoListView({
                               dataSource: antiTheftList,
                               template: kendo.template($("#antiTheft").html())
                           });

                           var voluntaryList = [
                               {
                                    name: "Yes",
                                    id: "1"
                               },
                               {
                                    name: "No",
                                    id: "0"
                               }
                           ]

                           $("#vList").kendoListView({
                               dataSource: voluntaryList,
                               template: kendo.template($("#vlList").html())
                           });

                           var liabilityList = [
                               {
                                    name: "Yes",
                                    id: "1"
                               },
                               {
                                    name: "No",
                                    id: "0"
                               }
                           ]

                           $("#lList").kendoListView({
                               dataSource: liabilityList,
                               template: kendo.template($("#llList").html())
                           })

                        var paList = [
                            {
                                name: "Yes",
                                id: "1"
                            },
                            {
                                name: "No",
                                id: "0"
                            }
                        ]

                        $("#pList").kendoListView({
                            dataSource: paList,
                            template: kendo.template($("#paList").html())
                        })

                        var amountList = [
                                    { value: "500", 
                                        text: "500" 
                                    },
                                    { value: "750", 
                                        text: "750" 
                                    },
                                    { value: "1000", 
                                        text: "1000" 
                                    },
                                    { value: "1500", 
                                        text: "1500" 
                                    },
                                    { value: "3000", 
                                        text: "3000" 
                                    }
                        ]

                        $("#amount").kendoListView({
                            dataSource: amountList,
                            template: kendo.template($("#amountList").html())
                        })

                        var insuredSumList = [
                            { value: "10000", text: "10000" },
                            { value: "20000", text: "20000" },
                            { value: "30000", text: "30000" },
                            { value: "40000", text: "40000" },
                            { value: "50000", text: "50000" },
                            { value: "60000", text: "60000" },
                            { value: "70000", text: "70000" },
                            { value: "80000", text: "80000" },
                            { value: "90000", text: "90000" },
                            { value: "100000", text: "100000" },
                            { value: "110000", text: "110000" },
                            { value: "120000", text: "120000" },
                            { value: "130000", text: "130000" },
                            { value: "140000", text: "140000" },
                            { value: "150000", text: "150000" },
                            { value: "160000", text: "160000" },
                            { value: "170000", text: "170000" },
                            { value: "180000", text: "180000" },
                            { value: "190000", text: "190000" },
                            { value: "200000", text: "200000" }
                        ]

                        $("#insuredPp").kendoListView({
                            dataSource: insuredSumList,
                            template: kendo.template($("#insuredtList").html())
                        })
                    }
                }
            })();

            app.models.TwoWheelerNew.twpvalueAutoCoverages = (function(){ 
                var viewModel = kendo.observable({

                })   

                var getMedicalSumInsured = function(selectedRadio){
                    if(selectedRadio == "1"){
                        document.getElementById("sumInsuredDiv").style.removeProperty('display');

                        document.getElementById("sumInsuredDiv").style.display = "block";
                    }else{
                        document.getElementById("sumInsuredDiv").style.removeProperty('display');

                        document.getElementById("sumInsuredDiv").style.display = "none";
                    }
                }

                var getPaSumInsured = function(selectedRadio){
                    if(selectedRadio == "1"){
                        document.getElementById("paSumInsuredDiv").style.removeProperty('display');

                        document.getElementById("paSumInsuredDiv").style.display = "block";
                    }else{
                        document.getElementById("paSumInsuredDiv").style.removeProperty('display');

                        document.getElementById("paSumInsuredDiv").style.display = "none";
                    }
                }

                var getMedSumInsured = function(selectedRadio){
                    if(selectedRadio == "1"){
                        document.getElementById("medSumInsured").style.removeProperty('display');

                        document.getElementById("medSumInsured").style.display = "block";
                    }else{
                        document.getElementById("medSumInsured").style.removeProperty('display');

                        document.getElementById("medSumInsured").style.display = "none";
                    }
                }

                var getPebSumInsured = function(selectedRadio){
                    if(selectedRadio == "1"){
                        document.getElementById("pebSumInsured").style.removeProperty('display');

                        document.getElementById("pebSumInsured").style.display = "block";
                    }else{
                        document.getElementById("pebSumInsured").style.removeProperty('display');
                        
                        document.getElementById("pebSumInsured").style.display = "none";
                    }
                }

                var getIpdSumInsured = function(selectedRadio){
                    if(selectedRadio == "1"){
                        document.getElementById("ipdSumInsured").style.removeProperty('display');

                        document.getElementById("ipdSumInsured").style.display = "block";
                    }else{
                        document.getElementById("ipdSumInsured").style.removeProperty('display');

                        document.getElementById("ipdSumInsured").style.display = "none";
                    }
                }

                var getTowingSumInsured = function(selectedRadio){
                    if(selectedRadio == "1"){
                        document.getElementById("towingSumInsured").style.removeProperty('display');

                        document.getElementById("towingSumInsured").style.display = "block";
                    }else{
                        document.getElementById("towingSumInsured").style.removeProperty('display');

                        document.getElementById("towingSumInsured").style.display = "none";
                    }
                }

                return {
                    viewModel: viewModel,
                    'getMedicalSumInsured': getMedicalSumInsured,
                    'getPaSumInsured': getPaSumInsured,
                    'getMedSumInsured': getMedSumInsured,
                    'getPebSumInsured': getPebSumInsured,
                    'getIpdSumInsured': getIpdSumInsured,
                    "getTowingSumInsured" : getTowingSumInsured,
                    onShow: function(){
                        document.getElementById("sumInsuredDiv").style.display = "none";
                        document.getElementById("paSumInsuredDiv").style.display = "none";
                        document.getElementById("medSumInsured").style.display = "none";

                        var optionList = [
                            {
                                name: "Yes",
                                id: "1"
                            },
                            {
                                name: "No",
                                id: "0"
                            }
                        ]

                        var sumList = [
                            {
                                name: "25000",
                                id: "25000"
                            },
                            {
                                name: "50000",
                                id: "50000"
                            },
                            {
                                name: "75000",
                                id: "75000"
                            },
                            {
                                name: "100000",
                                id: "100000"
                            },
                            {
                                name: "125000",
                                id: "125000"
                            },
                            {
                                name: "150000",
                                id: "150000"
                            },
                            {
                                name: "175000",
                                id: "175000"
                            },
                            {
                                name: "200000",
                                id: "200000"
                            },
                        ]
                        
                        $("#dWaiverList").kendoListView({
                            dataSource: optionList,
                            template: kendo.template($("#dWaiverTemplate").html())
                        });

                        $("#wreckageList").kendoListView({
                            dataSource: optionList,
                            template: kendo.template($("#wreckageTemplate").html())
                        });

                        $("#pebList").kendoListView({
                            dataSource: optionList,
                            template: kendo.template($("#pebTemplate").html())
                        })

                        $("#paoList").kendoListView({
                            dataSource: optionList,
                            template: kendo.template($("#paoTemplate").html())
                        })

                        $("#medicalExpensesList").kendoListView({
                            dataSource: optionList,
                            template: kendo.template($("#medicalExpensesTemplate").html())
                        })

                        $("#paiList").kendoListView({
                            dataSource: optionList,
                            template: kendo.template($("#paiTemplate").html())
                        })

                        $("#propertyDamageList").kendoListView({
                            dataSource: optionList,
                            template: kendo.template($("#propertyDamageTemplate").html())
                        })

                        $("#towingRelatedList").kendoListView({
                            dataSource: optionList,
                            template: kendo.template($("#towingRelatedTemplate").html())
                        })

                        $("#transportList").kendoListView({
                            dataSource: optionList,
                            template: kendo.template($("#transportTemplate").html())
                        })

                        $("#medicalSumInsuredList").kendoListView({
                            dataSource: sumList,
                            template: kendo.template($("#medicalSumInsuredTemplate").html())
                        })

                        $("#paSumInsuredList").kendoListView({
                            dataSource: sumList,
                            template: kendo.template($("#paSumInsuredTemplate").html())
                        })

                        $("#paiSumInsuredList").kendoListView({
                            dataSource: sumList,
                            template: kendo.template($("#paiSumInsuredTemplate").html())
                        })
                    }
                }           
            })();
        }
    };
})();