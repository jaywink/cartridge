
function checkIsAvailable(curDate) {
    if (avails.length) {
        var available = false;
        for (var i=0; i<avails.length; i++) {
            if (curDate <= avails[i].to_date && curDate >= avails[i].from_date) {
                available = true;
            }
        }
        if (available == false) {
            return [false, "not available"];
        }
    }
    if (typeof reservedDays[curDate.getFullYear()] !== 'undefined' &&
            typeof reservedDays[curDate.getFullYear()][curDate.getMonth()+1] !== 'undefined' ){
        if (reservedDays[curDate.getFullYear()][curDate.getMonth()+1].indexOf(curDate.getDate()) > -1) {
            return [false, "reserved"];
        } else {
            return [true];
        }
    } else {
        return [true];
    }
}

function isAvailableFrom(date) {
    var curDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    curDate.setDate(date.getDate());
    return checkIsAvailable(curDate);
}

function isAvailableTo(date) {
    var curDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    var fromInput = $('input#id_from_date').val().split('.');
    var fromDate = new Date(parseInt(fromInput[2]), parseInt(fromInput[1])-1, parseInt(fromInput[0]));
    curDate.setDate(date.getDate() - 1);
    if (curDate < fromDate) {
        return [false, "end date must be after start"];
    }
    return checkIsAvailable(curDate);
}

var avails = [];

function validateAddToCartButton(dates) {
    if ($('input#id_from_date').val().length > 0 && $('input#id_to_date').val().length > 0) {
        $('.form-actions input[name="add_cart"]').attr('disabled', false);
    } else {
        $('.form-actions input[name="add_cart"]').attr('disabled', true);
        $("#chosen-dates-container").hide();
        return;
    }
    // to date cannot be earlier or same as from date
    if (dates[1] <= dates[0]) {
        $('.form-actions input[name="add_cart"]').attr('disabled', true);
        $("#chosen-dates-container").hide();
        return;
    } else {
        $('.form-actions input[name="add_cart"]').attr('disabled', false);
    }
    // make sure no reservations between dates
    curDay = dates[0];
    var lastDay = new Date();
    lastDay.setDate(dates[1].getDate() -1);
    while (true) {
        curDay.setDate(curDay.getDate() + 1);
        if (curDay >= lastDay) {
            break;
        }
        if (! isAvailableFrom(curDay)[0]) {
            $('.form-actions input[name="add_cart"]').attr('disabled', true);
            $("#chosen-dates-container").hide();
            return;
        }
    }
    $('.form-actions input[name="add_cart"]').attr('disabled', false);
    $("#chosen-dates").html($('input#id_from_date').val() + " - " + $('input#id_to_date').val())
    $("#chosen-dates-container").show(200);
}

function parseReservationDates() {
    var dateArr = [$('input#id_from_date').val().split('.'), $('input#id_to_date').val().split('.')];
    var fromDate = new Date(parseInt(dateArr[0][2]), parseInt(dateArr[0][1])-1, parseInt(dateArr[0][0]));
    var toDate = new Date(parseInt(dateArr[1][2]), parseInt(dateArr[1][1])-1, parseInt(dateArr[1][0]));
    return [fromDate, toDate];
}

$(document).ready(function(){

    $('.form-actions input[name="add_cart"]').attr('disabled', true);

    for (var i=0; i<availabilities.length; i++) {
        // parse availability json to dates
        var a = availabilities[i];
        var from = new Date(a.from_date[0], a.from_date[1]-1, a.from_date[2]);
        var to = new Date(a.to_date[0], a.to_date[1]-1, a.to_date[2]);
        avails.push({ from_date: from, to_date: to });
    }

    // Make sure date inputs are empty on page load
    $("#id_from_date").val("");
    $("#id_to_date").val("");

    var datepickerOpts = {
        minDate: 0,
        numberOfMonths: 1,
        // copied finnish localization from jquery language file here - couldn't get it to work otherwise :P
        closeText: 'Sulje',
        prevText: '&#xAB;Edellinen',
        nextText: 'Seuraava&#xBB;',
        currentText: 'Tänään',
        monthNames: ['Tammikuu','Helmikuu','Maaliskuu','Huhtikuu','Toukokuu','Kesäkuu',
        'Heinäkuu','Elokuu','Syyskuu','Lokakuu','Marraskuu','Joulukuu'],
        monthNamesShort: ['Tammi','Helmi','Maalis','Huhti','Touko','Kesä',
        'Heinä','Elo','Syys','Loka','Marras','Joulu'],
        dayNamesShort: ['Su','Ma','Ti','Ke','To','Pe','La'],
        dayNames: ['Sunnuntai','Maanantai','Tiistai','Keskiviikko','Torstai','Perjantai','Lauantai'],
        dayNamesMin: ['Su','Ma','Ti','Ke','To','Pe','La'],
        weekHeader: 'Vk',
        dateFormat: 'dd.mm.yy',
        firstDay: 1,
        isRTL: false,
        showMonthAfterYear: false,
        yearSuffix: ''
    }
    $("#datepicker-from").datepicker($.extend({}, {
        beforeShowDay: isAvailableFrom,
        onSelect: function(selectedDate) {
            $("#id_from_date").val(selectedDate);
            var dates = parseReservationDates();
            validateAddToCartButton(dates);
            $("#datepicker-to").datepicker("refresh");
        }
    }, datepickerOpts));
    $("#datepicker-to").datepicker($.extend({}, {
        beforeShowDay: isAvailableTo,
        onSelect: function(selectedDate) {
            $("#id_to_date").val(selectedDate);
            var dates = parseReservationDates();
            validateAddToCartButton(dates);
        }
    }, datepickerOpts));
});
