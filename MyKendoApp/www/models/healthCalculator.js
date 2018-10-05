'use strict';
(function () {
    app.models.healthCalculator = {
        init: function () {
            app.models.healthCalculator = function () {
                var viewModel = kendo.observable({
                    lang: app.strings.en,
                    selectedProduct: 'FHP',
                    title: 'FHP',
                    inceptionDate:'',
                    expirationDate: '',
                    sumInsured: 0,
                    premiumZone: '',
                    visibleAccToProduct: true,
                    criticalIllnessCover: 'No',
                    roomRentWaiver: 'No',
                    buttontxt: '',
                    allmembers: [],
                    isAddingMembers: false,
                    member: {
                        name: '',
                        dateOfBirth: '',
                        sumInsured: 0
                    },
                    buttonMode: 'calculatePremium',
                    isEditingMember: false,
                    indexToEdit: -1,
                    otherLoyaltyDiscount: 'No',
                    groupLoyaltyDiscount: 'none',
                    staffDiscount: 'No',
                    familyDiscount: 0,
                    totalDiscount: 0,
                    uncappedDiscount: 0,
                    minMemberCount: 2,
                    criticalIllnessNoteVisibility:false,
                    roomRentWaiverNoteVisibility: false,
                    roomrentWaiverTxt: '',
                    criticalIllnessTxt:'',
                    userId: '',
                    PremiumModel: {},
                    premiumDetailsVisibility: false,
                    displayedPremiumDetails: {
                        BasePremium:'',
                        CriticalIllnessRiderPremium: '',
                        RoomRentRiderPremium: '',
                        Discounts: '',
                        TotalAmount: '',
                        GSTAmount: '',
                        NetPremiumPayable: '',
                    },
                    roomRentWaiverLimit: 500000,
                    serviceFunction: 'CalculateIHPPremium',
                    premiumZoneNoteVisibility: false
                });
                var onProductChange = function (product) {
                    viewModel.set('selectedProduct', product);
                    var langProduct="";
                    switch(product){
                        case "IHP":{
                            langProduct = viewModel.lang.healthCalculator.ihp;
                            viewModel.set('visibleAccToProduct', false);
                            viewModel.set('minMemberCount', 1);
                            viewModel.set('roomrentWaiverTxt', viewModel.lang.healthCalculator.roomRentWaiverIHPNote);
                            viewModel.set('roomRentWaiverLimit', 500000);
                            viewModel.set('serviceFunction', 'CalculateIHPPremium');
                            break;
                        }
                        case "FHP":{
                            langProduct = viewModel.lang.healthCalculator.fhp;
                            viewModel.set('visibleAccToProduct', true);
                            viewModel.set('minMemberCount', 2);
                            viewModel.set('roomrentWaiverTxt', viewModel.lang.healthCalculator.roomRentWaiverFHPNote);
                            viewModel.set('roomRentWaiverLimit', 700000);
                            viewModel.set('serviceFunction', 'CalculateFHPPremium');
                            break;
                        }
                    }
                    
                    viewModel.set('title', langProduct);
                    app.mobileApp.navigate('views/HealthCalculator/healthCalculator.html');
                };
                var onShow = function () {
                    viewModel.set('userId',app.user.id);
                    viewModel.set('buttontxt', viewModel.lang.calculatePremium);
                    viewModel.set('criticalIllnessTxt', viewModel.lang.healthCalculator.criticalIllnessNote);
                    setDefaultInceptionAndExpirationDates();
                    setMinMaxAttributeOfDates();
                }
                var addMember = function () {
                    //$("#foo").data("kendoMobileModalView").open();

                    if (viewModel.member.name == '') {
                        customAlert('Please enter Member\'s Name. ');
                        return;
                    } else if (!validateName()) {
                        return;
                    } else if (!validateDOB()) {//!validateDOB()
                        //alert("Age cannot be greater than 55 years.");
                        return;
                    } else if (viewModel.member.dateOfBirth == '') {
                        customAlert('Please enter Member\'s Date Of Birth. ');
                        return;
                    } else if (viewModel.member.sumInsured == 0 && viewModel.selectedProduct == 'IHP') {
                        customAlert('Please select Member\'s Sum Insured. ');
                        return;
                    }

                    var dob = viewModel.member.dateOfBirth;
                    if (dob != undefined && dob.toString().length > 15) {
                        dob = dob.toString().slice(4, 15);
                    }
                    viewModel.set('member.dateOfBirth', dob);
                    if (viewModel.isEditingMember)
                    {
                        var items = viewModel.get('allmembers');
                        var items = $.grep(items, function (item, index) {
                            if (index == viewModel.indexToEdit) {
                                item.name = viewModel.member.name;
                                item.dateOfBirth = viewModel.member.dateOfBirth;
                                if (viewModel.selectedProduct == 'IHP') {
                                    var oldSI = viewModel.sumInsured;
                                    viewModel.set('sumInsured', parseInt(viewModel.sumInsured) - parseInt(item.sumInsured) + parseInt(viewModel.member.sumInsured));
                                    //if (viewModel.groupLoyaltyDiscount == 'Yes') {
                                    //    onGroupLoyaltyDiscountSelection(viewModel.groupLoyaltyDiscount,oldSI,viewModel.sumInsured);
                                    //}
                                }
                                item.sumInsured = viewModel.member.sumInsured;
                            }
                            return item;
                        });
                        viewModel.set("allmembers", items);
                        //viewModel.set("allmembers[" + viewModel.indexToEdit + "]", viewModel.member);
                        viewModel.set('isEditingMember', false);
                        viewModel.set('indexToEdit',-1);
                    }
                    else
                    {
                        viewModel.allmembers.push(viewModel.member);
                        if (viewModel.selectedProduct == 'IHP') {
                            var oldSI = viewModel.sumInsured;
                            viewModel.set('sumInsured', parseInt(viewModel.sumInsured) + parseInt(viewModel.member.sumInsured));
                            //if (viewModel.groupLoyaltyDiscount=='Yes') {
                            //    onGroupLoyaltyDiscountSelection(viewModel.groupLoyaltyDiscount, oldSI, viewModel.sumInsured);
                            //}
                            autoApplyFamilyDiscount('addingMember');
                        }
                    }

                    //if (viewModel.selectedProduct == 'IHP' && viewModel.groupLoyaltyDiscount == 'Yes')
                    //{
                    //    app.models.healthCalculator.onGroupLoyaltyDiscountSelection(viewModel.groupLoyaltyDiscount,viewModel.sumInsured)
                    //}

                    viewModel.set('member', {
                        name: '',
                        dateOfBirth: '',
                        sumInsured:0
                    });

                    navigatePage();
                }
                var deleteMember = function (e) {
                    clearPremiumDetails();
                    var index = viewModel.allmembers.indexOf(e.data);
                    if (viewModel.selectedProduct == 'IHP') {
                        var oldSI = viewModel.sumInsured;
                        viewModel.set('sumInsured', parseInt(viewModel.sumInsured) - parseInt(viewModel.allmembers[index].sumInsured));
                        //if (viewModel.groupLoyaltyDiscount == 'Yes') {
                        //    onGroupLoyaltyDiscountSelection(viewModel.groupLoyaltyDiscount, oldSI, viewModel.sumInsured);
                        //}
                    }
                    viewModel.allmembers.splice(index, 1);
                    if(viewModel.selectedProduct=='IHP')
                    autoApplyFamilyDiscount('deleteingMember');
                }
                var editMember = function (e) {
                    clearPremiumDetails();
                    var index = viewModel.allmembers.indexOf(e.data);
                    var currentMember = jQuery.extend({}, viewModel.allmembers[index]);
                    viewModel.set("member", currentMember);
                    viewModel.set("isEditingMember", true);
                    viewModel.set('indexToEdit', index);
                    var dateofbirth = new Date(viewModel.allmembers[viewModel.indexToEdit].dateOfBirth);
                    var dob = "";
                    dob += (dateofbirth.getFullYear()) + "-" + ("0" + (dateofbirth.getMonth() + 1)).slice(-2) + "-" + ("0" + (dateofbirth.getDate())).slice(-2);
                    document.getElementById("healthMemberDateOfBirth").value = dob;
                    navigatePage();
                }
                var onNavbarClick = function () {
                    switch (viewModel.buttonMode) {
                        case "calculatePremium": {
                            if (viewModel.inceptionDate == "" || viewModel.inceptionDate == null) {
                                customAlert('Please enter Inception Date. ');
                            }else if (viewModel.sumInsured == 0 && viewModel.selectedProduct == 'FHP') {
                                customAlert('Please select Sum Insured. ');
                            }
                            else if (viewModel.premiumZone == '' && viewModel.selectedProduct == 'IHP') {
                                customAlert('Please select Premium Zone. ');
                            }
                            else if (viewModel.allmembers.length < viewModel.minMemberCount)
                            {
                                customAlert('Please add at least '+ viewModel.minMemberCount + ' members. ');
                            }
                            else
                            {
                                //alert('Sum Insured = ' + viewModel.sumInsured);
                                postData();
                            }
                            break;
                        }
                        case "addMember": {
                            addMember();
                            break;
                        }
                        case "navigateHome": { break;}
                    }
                }
                var navigatePage = function () {
                    switch (viewModel.buttonMode) {
                        case "calculatePremium": {
                            if (viewModel.premiumZone == '' && viewModel.selectedProduct == 'IHP') {
                                customAlert('Please select Premium Zone.');
                            } else if (viewModel.inceptionDate == "" || viewModel.inceptionDate == null) {
                                customAlert('Please enter Inception Date. ');
                            } else {
                                viewModel.set('buttontxt', viewModel.lang.healthCalculator.save);
                                viewModel.set('isAddingMembers', true);
                                viewModel.set('buttonMode', 'addMember');
                            }
                            break;
                        }
                        case "addMember": {
                            viewModel.set('buttontxt', viewModel.lang.calculatePremium);
                            viewModel.set('isAddingMembers', false);
                            viewModel.set('buttonMode', 'calculatePremium');
                            break;
                        }
                    }
                }
                var setDefaultInceptionAndExpirationDates = function () {
                    if (viewModel.inceptionDate != "")
                    { policyexpirationdatechange(viewModel.inceptionDate, "healthExpirationDate"); }
                    else {
                        var pid = new Date();
                        var date1 = "";
                        pid.setDate(pid.getDate());
                        date1 += (pid.getFullYear()) + "-" + ("0" + (pid.getMonth() + 1)).slice(-2) + "-" + ("0" + (pid.getDate())).slice(-2);
                        viewModel.set('inceptionDate', date1);
                        policyexpirationdatechange(viewModel.inceptionDate, "healthExpirationDate");
                    }
                }
                var back = function (e) {
                    e.preventDefault();
                    switch (viewModel.buttonMode) {
                        case "calculatePremium": {
                            clearData();
                            app.mobileApp.navigate('views/HealthCalculator/healthCalculatorProductSelection.html');
                            break;
                        }
                        case "addMember": {
                            customConfirmBox("Member has not been saved. Continue without member addition?", function (selection) {
                                if (selection == 1) {
                                    viewModel.set("member", {
                                        name: '',
                                        dateOfBirth: '',
                                        sumInsured:0
                                    });
                                    navigatePage();
                                } else {
                                    addMember();
                                }
                            });
                            break;
                        }
                    }
                }
                var productSelectionBack = function (e) {
                    e.preventDefault();
                    app.mobileApp.navigate('views/home.html');
                }
                var inceptionDateCheck = function (value) {
                    if (value == "") {
                        customAlert('Please enter Inception Date. ');
                        return;
                    }
                    var currentdate = new Date();
                    var inceptionDate = new Date(value);
                    var noOfDaysInYear = 365;
                    if (currentdate.getFullYear() % 4 == 0) {
                        noOfDaysInYear = 366;
                    } else {
                        noOfDaysInYear = 365;
                    }
                    var dateDiff = (inceptionDate - currentdate) / (1000 * 3600 * 24);
                    var diffDays = 0;
                    if (dateDiff < 0) {
                        diffDays = Math.floor(dateDiff);
                    } else {
                        diffDays = Math.ceil(dateDiff);
                    }
                    //var diffDays = Math.ceil((inceptionDate - currentdate) / (1000 * 3600 * 24));
                    if (diffDays >= noOfDaysInYear) {
                        viewModel.set('inceptionDate', '');
                        setDefaultInceptionAndExpirationDates();
                        customAlert('Inception Date cannot be more than 1 year from current date.');
                    } else {
                        var date1="";
                        date1 += (inceptionDate.getFullYear()) + "-" + ("0" + (inceptionDate.getMonth() + 1)).slice(-2) + "-" + ("0" + (inceptionDate.getDate())).slice(-2);
                        viewModel.set('inceptionDate', date1);
                        policyexpirationdatechange(value, 'healthExpirationDate');
                    }
                }
                var clearData = function () {
                    viewModel.set('selectedProduct', 'FHP');
                    viewModel.set('title', 'F.H.P');
                    viewModel.set('inceptionDate', '');
                    viewModel.set('expirationDate','');
                    viewModel.set('sumInsured',0);
                    viewModel.set('premiumZone','');
                    viewModel.set('visibleAccToProduct',true);
                    viewModel.set('criticalIllnessCover','No');
                    viewModel.set('roomRentWaiver', 'No');
                    viewModel.set('buttontxt','');
                    viewModel.set('allmembers',[]);
                    viewModel.set('isAddingMembers',false);
                    viewModel.set('member',{
                                name: '',
                                dateOfBirth: '',
                                sumInsured: 0
                            });
                    viewModel.set('buttonMode', 'calculatePremium');
                    viewModel.set('isEditingMember', false);
                    viewModel.set('indexToEdit',-1);
                    viewModel.set('otherLoyaltyDiscount', 'No');
                    viewModel.set('groupLoyaltyDiscount', 'none');
                    viewModel.set('staffDiscount', 'No');
                    viewModel.set('familyDiscount', 0);
                    viewModel.set('totalDiscount', 0);
                    viewModel.set('uncappedDiscount',0);
                    viewModel.set('minMemberCount', 2);
                    viewModel.set('criticalIllnessNoteVisibility',false);
                    viewModel.set('roomRentWaiverNoteVisibility', false);
                    viewModel.set('roomrentWaiverTxt', '');
                    viewModel.set('criticalIllnessTxt', '');
                    viewModel.set('PremiumModel', {});
                    viewModel.set('premiumDetailsVisibility', false);
                    viewModel.set('displayedPremiumDetails', {
                        BasePremium:'',
                        CriticalIllnessRiderPremium: '',
                        RoomRentRiderPremium: '',
                        Discounts: '',
                        TotalAmount: '',
                        GSTAmount: '',
                        NetPremiumPayable: '',
                        });
                    viewModel.set('roomRentWaiverLimit', 500000);
                    viewModel.set('serviceFunction', 'CalculateIHPPremium');
                    viewModel.set('premiumZoneNoteVisibility', false);
                    viewModel.set('userId','');
                    $("#roomRentWaiverYes").attr('disabled', false);
                    $("#roomRentWaiverNo").attr('disabled', false);
                    $("#roomRentWaiverYes").attr('style', 'color:black');
                    $("#roomRentWaiverNo").attr('style', 'color:black');
                }
                var onOtherLoyaltyDiscountSelection = function (value) {
                    //if (value == 'Yes'&& viewModel.otherLoyaltyDiscount=='No') {
                    //    viewModel.set('uncappedDiscount', parseInt(viewModel.uncappedDiscount) + 10);
                    //} else if (value == 'No' && viewModel.otherLoyaltyDiscount=='Yes') {
                    //    viewModel.set('uncappedDiscount', parseInt(viewModel.uncappedDiscount) - 10);
                    //}
                    calculateDiscount(value, viewModel.groupLoyaltyDiscount, viewModel.staffDiscount);
                    capDiscount();
                }
                var onGroupLoyaltyDiscountSelection = function (value) {
                    //if (value == 'Yes' && viewModel.groupLoyaltyDiscount == 'No') {
                    //    if (viewModel.sumInsured <= 200000) {
                    //        viewModel.set('uncappedDiscount', parseInt(viewModel.uncappedDiscount) + 10);
                    //    } else {
                    //        viewModel.set('uncappedDiscount', parseInt(viewModel.uncappedDiscount) + 20);
                    //    }
                    //} else if (value == 'No' && viewModel.groupLoyaltyDiscount == 'Yes') {
                    //    if (viewModel.sumInsured <= 200000) {
                    //        viewModel.set('uncappedDiscount', parseInt(viewModel.uncappedDiscount) - 10);
                    //    } else {
                    //        viewModel.set('uncappedDiscount', parseInt(viewModel.uncappedDiscount) - 20);
                    //    }
                    //} else if (value == 'Yes' && viewModel.groupLoyaltyDiscount == 'Yes') {
                    //    if (newSI <= 200000 && originalSI > 200000) {
                    //        viewModel.set('uncappedDiscount', parseInt(viewModel.uncappedDiscount) - 10);
                    //    } else if (newSI > 200000 && originalSI <= 200000) {
                    //        viewModel.set('uncappedDiscount', parseInt(viewModel.uncappedDiscount) + 10);
                    //    }
                    //}
                    //if (viewModel.groupLoyaltyDiscount.length == 0) {
                    //    viewModel.set('groupLoyaltyDiscount',['']);
                    //}
                    //if (value == 'greaterThan2L' && viewModel.groupLoyaltyDiscount[0] == 'lessThan2L') {
                    //    viewModel.set('uncappedDiscount', parseInt(viewModel.uncappedDiscount) + 10);
                    //    viewModel.set('groupLoyaltyDiscount', []);
                    //} else if (value == 'greaterThan2L' && viewModel.groupLoyaltyDiscount[0] == '') {
                    //    viewModel.set('uncappedDiscount', parseInt(viewModel.uncappedDiscount) + 20);
                    //    viewModel.set('groupLoyaltyDiscount', []);
                    //} else if (value == 'greaterThan2L' && viewModel.groupLoyaltyDiscount[0] == 'greaterThan2L') {
                    //    viewModel.set('uncappedDiscount', parseInt(viewModel.uncappedDiscount) - 20);
                    //    //viewModel.set('groupLoyaltyDiscount', ['']);
                    //}else if (value == 'lessThan2L' && viewModel.groupLoyaltyDiscount[0] == 'greaterThan2L') {
                    //    viewModel.set('uncappedDiscount', parseInt(viewModel.uncappedDiscount) - 10);
                    //    viewModel.set('groupLoyaltyDiscount', []);
                    //} else if (value == 'lessThan2L' && viewModel.groupLoyaltyDiscount[0] == '') {
                    //    viewModel.set('uncappedDiscount', parseInt(viewModel.uncappedDiscount) + 10);
                    //    viewModel.set('groupLoyaltyDiscount', []);
                    //} else if (value == 'lessThan2L' && viewModel.groupLoyaltyDiscount[0] == 'lessThan2L') {
                    //    viewModel.set('uncappedDiscount', parseInt(viewModel.uncappedDiscount) - 10);
                    //    //viewModel.set('groupLoyaltyDiscount', ['']);
                    //}
                    calculateDiscount(viewModel.otherLoyaltyDiscount, value, viewModel.staffDiscount);
                    capDiscount();
                }
                var onStaffDiscountSelection = function (value) {
                    //if (value == 'Yes' && viewModel.staffDiscount == 'No') {
                    //    viewModel.set('uncappedDiscount', parseInt(viewModel.uncappedDiscount) + 20);
                    //} else if (value == 'No' && viewModel.staffDiscount == 'Yes') {
                    //    viewModel.set('uncappedDiscount', parseInt(viewModel.uncappedDiscount) - 20);
                    //}
                    calculateDiscount(viewModel.otherLoyaltyDiscount, viewModel.groupLoyaltyDiscount, value);
                    capDiscount();
                }
                var autoApplyFamilyDiscount = function (mode) {
                    //if (viewModel.allmembers.length == 2 && mode == 'addingMember') {
                    //    viewModel.set('uncappedDiscount', parseInt(viewModel.uncappedDiscount) + 5);
                    //    viewModel.set('familyDiscount', parseInt(viewModel.familyDiscount) + 5);
                    //} else if (viewModel.allmembers.length == 1 && mode == 'deleteingMember') {
                    //    viewModel.set('uncappedDiscount', parseInt(viewModel.uncappedDiscount) - 5);
                    //    viewModel.set('familyDiscount', parseInt(viewModel.familyDiscount) - 5);
                    //} else if (viewModel.allmembers.length == 3 && mode == 'addingMember') {
                    //    viewModel.set('uncappedDiscount', parseInt(viewModel.uncappedDiscount) + 5);
                    //    viewModel.set('familyDiscount', parseInt(viewModel.familyDiscount) + 5);
                    //} else if (viewModel.allmembers.length == 2 && mode == 'deleteingMember') {
                    //    viewModel.set('uncappedDiscount', parseInt(viewModel.uncappedDiscount) - 5);
                    //    viewModel.set('familyDiscount', parseInt(viewModel.familyDiscount) - 5);
                    //}
                    calculateDiscount(viewModel.otherLoyaltyDiscount, viewModel.groupLoyaltyDiscount, viewModel.staffDiscount);
                    capDiscount();
                }
                var capDiscount = function () {
                    if (viewModel.uncappedDiscount > 25) {
                        viewModel.set('totalDiscount', 25);
                    } else {
                        viewModel.set('totalDiscount', viewModel.uncappedDiscount);
                    }
                }
                var calculateDiscount = function (otherLoyaltyDiscount, groupLoyaltyDiscount, staffDiscount) {
                    var otherLoyaltyDiscountPCT=0, groupLoyaltyDiscountPCT=0, staffDiscountPCT=0,familyDiscountPCT=0;
                    if (otherLoyaltyDiscount == "Yes") {
                        otherLoyaltyDiscountPCT = 10;
                    } else {
                        otherLoyaltyDiscountPCT = 0;
                    }
                    if (groupLoyaltyDiscount == "greaterThan2L") {
                        groupLoyaltyDiscountPCT = 20;
                    } else if (groupLoyaltyDiscount == "lessThan2L") {
                        groupLoyaltyDiscountPCT = 10;
                    } else {
                        groupLoyaltyDiscountPCT = 0;
                    }
                    if (staffDiscount == "Yes") {
                        staffDiscountPCT = 20;
                    } else {
                        staffDiscountPCT = 0;
                    }
                    if (viewModel.allmembers.length == 2 && viewModel.selectedProduct == 'IHP') {
                        familyDiscountPCT = 5;
                        viewModel.set('familyDiscount',5);
                    } else if (viewModel.allmembers.length > 2 && viewModel.selectedProduct == 'IHP') {
                        familyDiscountPCT = 10;
                        viewModel.set('familyDiscount', 10);
                    } else {
                        familyDiscountPCT = 0;
                        viewModel.set('familyDiscount', 0);
                    }
                    var uncappedDiscount=parseInt(otherLoyaltyDiscountPCT)+parseInt(groupLoyaltyDiscountPCT)+parseInt(staffDiscountPCT)+parseInt(familyDiscountPCT);
                    viewModel.set('uncappedDiscount', uncappedDiscount);
                }
                var postData = function () {
                    inceptionDateCheck(viewModel.inceptionDate);
                    //if(viewModel.roomRentWaiver=='Yes')
                    //{
                    //    crossCheckRoomRentWaiverLimit();
                    //}
                    var data = jQuery.extend({}, viewModel);;
                    var lst = viewModel.allmembers;
                    var memberDetails = $.map(lst, function (val, index) {
                        var str = lst[index].name + "-" + lst[index].dateOfBirth + "-" + lst[index].sumInsured;
                        return str;
                    }).join(",");
                    data.allmembers = memberDetails;
                    app.loader.show('Please Wait...');
                    app.service.post(viewModel.serviceFunction, data.toJSON()).then(function (response) {
                        if (response.IsSuccess) {
                            viewModel.set('PremiumModel', response.HealthCalculatorResponse);
                            setIHPPremiumDetails();
                            app.loader.hide();
                            customAlert('Estimated Premium : Rs. ' + viewModel.PremiumModel.nET_PREMIUM_PAYABLEField);
                        } else {
                            app.loader.hide();
                            customAlert("Error in calculating premium : " + response.ErrorMessage);
                        }
                    });
                }
                var setIHPPremiumDetails = function () {
                    var premiumModel = viewModel.get('PremiumModel');
                    var memberCount = viewModel.allmembers.length;
                    var basePremium=0, criticalIllnessPremium=0, roomRentWaiverPremium=0, discount=0, totalPremium=0, tax=0, netPremiumPayable=0;
                        while (memberCount > 0) {
                            basePremium = parseFloat(basePremium) + parseFloat(premiumModel.iNSURED_DETAILSField[memberCount - 1].bASE_PREMIUMField);
                            criticalIllnessPremium = parseFloat(criticalIllnessPremium) + parseFloat(premiumModel.iNSURED_DETAILSField[memberCount - 1].cI_PREMIUMField);
                            roomRentWaiverPremium = parseFloat(roomRentWaiverPremium) + parseFloat(premiumModel.iNSURED_DETAILSField[memberCount - 1].rR_WAIVER_PREMIUMField);
                            if (viewModel.selectedProduct == "IHP") {
                                discount = parseFloat(discount) + parseFloat(premiumModel.iNSURED_DETAILSField[memberCount - 1].tOTAL_DISC_AMOUNTField);
                            } else if (viewModel.selectedProduct == "FHP") {
                                discount = parseFloat(discount) + parseFloat(premiumModel.iNSURED_DETAILSField[memberCount - 1].tOTAL_DISCOUNTField);
                            }
                            //totalPremium += premiumModel.iNSURED_DETAILSField[memberCount-1].tOTAL_PREMIUMField;
                            memberCount--;
                        }
                        basePremium = basePremium.toFixed(2);
                        criticalIllnessPremium = criticalIllnessPremium.toFixed(2);
                        roomRentWaiverPremium = roomRentWaiverPremium.toFixed(2);
                        discount = discount.toFixed(2);
                        totalPremium = parseFloat(premiumModel.pREMIUM_AFTER_DISCField);
                        totalPremium = (totalPremium).toFixed(2);
                        tax = parseFloat(premiumModel.tOTAL_GST_AMOUNTField);
                        tax = (tax).toFixed(2);
                        netPremiumPayable = parseFloat(premiumModel.nET_PREMIUM_PAYABLEField);
                        netPremiumPayable = (netPremiumPayable).toFixed(2);
                    viewModel.set('displayedPremiumDetails', {
                        BasePremium: basePremium,
                        CriticalIllnessRiderPremium: criticalIllnessPremium,
                        RoomRentRiderPremium: roomRentWaiverPremium,
                        Discounts: discount,
                        TotalAmount: totalPremium,
                        GSTAmount: tax,
                        NetPremiumPayable: netPremiumPayable,
                    });
                    viewModel.set('premiumDetailsVisibility', true);
                    scrollToBottom();
                }
                var clearPremiumDetails = function () {
                    viewModel.set('premiumDetailsVisibility',false);
                    viewModel.set('PremiumDetails', '');
                    viewModel.set('displayedPremiumDetails', {
                        BasePremium: '',
                        CriticalIllnessRiderPremium: '',
                        RoomRentRiderPremium: '',
                        Discounts: '',
                        TotalAmount: '',
                        GSTAmount: '',
                        NetPremiumPayable: '',
                    });
                }
                var shareHealthQuote = function () {
                    var onSuccess = function (result) {
                        console.log("Share completed? " + result.completed);
                        console.log("Shared to app: " + result.app);
                    }
                    var onError = function (msg) {
                        console.log("Sharing failed with message: " + msg);
                    }
                    var data, subject;
                    data = app.HealthShareMessage(), subject = 'Premium Estimate of '+ viewModel.selectedProduct + '.';
                    window.plugins.socialsharing.share(data, subject, null, null, onSuccess, onError);
                }
                var navigateHome = function () {
                    clearData();
                    app.mobileApp.navigate('views/home.html');
                }
                var crossCheckRoomRentWaiverLimit = function (sumInsured) {
                    if (sumInsured >= viewModel.roomRentWaiverLimit && viewModel.selectedProduct == 'FHP') {
                        customAlert("There is no need to opt for room rent waiver rider cover because as per policy wording there is no Room rent limit for sum insured of " + viewModel.roomRentWaiverLimit + " and above. ");
                        viewModel.set('roomRentWaiver', 'Yes');
                        viewModel.set('roomRentWaiverNoteVisibility', true);
                        $("#roomRentWaiverYes").attr('disabled', true);
                        $("#roomRentWaiverNo").attr('disabled', true);
                        $("#roomRentWaiverYes").attr('style', 'color:gray');
                        $("#roomRentWaiverNo").attr('style', 'color:gray');
                    } else {
                        $("#roomRentWaiverYes").attr('disabled', false);
                        $("#roomRentWaiverNo").attr('disabled', false);
                        $("#roomRentWaiverYes").attr('style', 'color:black');
                        $("#roomRentWaiverNo").attr('style', 'color:black');
                    }
                }
                var validateName = function () {
                    var regex = /^[a-zA-Z]*$/;
                    //regex.test(value[length - 1]);
                    if (!regex.test(viewModel.member.name)) {
                        customAlert("Special Characters not allowed in name. ");
                        return false;
                    }
                    return true;
                }
                var validateDOB = function () {
                    var result = true;
                    if (viewModel.member.dateOfBirth == "" || viewModel.member.dateOfBirth == null) {
                        customAlert("Please enter Member's Date Of Birth. ");
                        return false;
                    }
                    //var maxAge = app.config.healthPolicyMaxAge;
                    //var today = new Date(viewModel.inceptionDate);
                    //var birthDate = new Date(viewModel.member.dateOfBirth);
                    //var age = (today.getFullYear() - birthDate.getFullYear());
                    /////////////////////////MIN 3 Months DOB Check/////////////////////////
                    //var diffDays = Math.ceil((today - birthDate) / (1000 * 3600 * 24));
                    //if (diffDays < 90) {
                    //    customAlert('Age cannot be less than 3 months.');
                    //    return;
                    //}
                    /////////////////////////MIN 3 Months DOB Check/////////////////////////

                    /////////////////////////MAX 55 Years DOB Check/////////////////////////
                    //if (today.getMonth() < birthDate.getMonth() ||today.getMonth() == birthDate.getMonth() && today.getDate() < birthDate.getDate()) {
                    //    age--;
                    //}
                    //if (age <= maxAge) {
                    //    result = true;
                    //} else {
                    //    customAlert("Age cannot be greater than 55 years.");
                    //    result = false;
                    //}
                    /////////////////////////MAX 55 Years DOB Check/////////////////////////
                    return result;
                }
                var setMinMaxAttributeOfDates = function () {
                    var currentDate = new Date();
                    var maxDOB = currentDate.getFullYear()+ "-" + ("0" + (parseInt(currentDate.getMonth()) + 1)).slice(-2) + "-" + ("0" + currentDate.getDate()).slice(-2);
                    var maxInceptionDate = currentDate.getFullYear()+1 + "-" + ("0" + (parseInt(currentDate.getMonth()) + 1)).slice(-2) + "-" + ("0" + currentDate.getDate()).slice(-2);
                    var currentYear = currentDate.getFullYear();
                    var minYear = currentYear - app.config.healthPolicyMaxAge;
                    var minDOB = minYear + "-" + ("0" + (parseInt(currentDate.getMonth()) + 1)).slice(-2) + "-" + ("0" + currentDate.getDate()).slice(-2);
                    //$('#healthMemberDateOfBirth').attr('min', minDOB);
                    $('#healthMemberDateOfBirth').attr('max', maxDOB);
                    $('#healthInceptionDate').attr('max', maxInceptionDate);
                }
                var onFHPSIChange = function (value) {
                    //if (viewModel.groupLoyaltyDiscount == 'Yes')
                    //{onGroupLoyaltyDiscountSelection('Yes', viewModel.sumInsured, value); }
                    clearPremiumDetails();
                    crossCheckRoomRentWaiverLimit(value);
                }
                var onpremiumZoneSelection = function (selection) {
                    clearPremiumDetails();
                    if (selection == 'gujarat')
                    {
                        viewModel.set('premiumZoneNoteVisibility', true);
                    }
                    else {
                        viewModel.set('premiumZoneNoteVisibility', false);
                    }
                }
                return {
                    viewModel: viewModel,
                    onProductChange: onProductChange,
                    onShow: onShow,
                    addMember: addMember,
                    onNavbarClick: onNavbarClick,
                    navigatePage: navigatePage,
                    setDefaultInceptionAndExpirationDates: setDefaultInceptionAndExpirationDates,
                    back: back,
                    deleteMember: deleteMember,
                    editMember: editMember,
                    productSelectionBack: productSelectionBack,
                    inceptionDateCheck: inceptionDateCheck,
                    clearData: clearData,
                    onOtherLoyaltyDiscountSelection: onOtherLoyaltyDiscountSelection,
                    onGroupLoyaltyDiscountSelection: onGroupLoyaltyDiscountSelection,
                    onStaffDiscountSelection: onStaffDiscountSelection,
                    autoApplyFamilyDiscount: autoApplyFamilyDiscount,
                    capDiscount: capDiscount,
                    postData: postData,
                    setIHPPremiumDetails: setIHPPremiumDetails,
                    clearPremiumDetails: clearPremiumDetails,
                    shareHealthQuote: shareHealthQuote,
                    navigateHome:navigateHome,
                    crossCheckRoomRentWaiverLimit: crossCheckRoomRentWaiverLimit,
                    validateName: validateName,
                    validateDOB: validateDOB,
                    onFHPSIChange: onFHPSIChange,
                    onpremiumZoneSelection: onpremiumZoneSelection
                }
            }()
        }
    }
})();