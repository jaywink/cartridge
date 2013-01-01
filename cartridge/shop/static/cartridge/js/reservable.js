
function isAvailable(date) {
    var curDate = new Date();
    if (datepickerTarget == '#id_to_date') {
        // allow selecting next day
        curDate.setDate(date.getDate() - 1);
    } else {
        curDate.setDate(date.getDate());
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

var datepickerTarget = '#id_from_date';

function switchDatepickerTarget() {
    if (datepickerTarget == '#id_from_date')
        datepickerTarget = '#id_to_date';
    else
        datepickerTarget = '#id_from_date';
}

function validateAddToCartButton(dates) {
    if ($('input#id_from_date').val().length > 0 && $('input#id_to_date').val().length > 0) {
        $('.form-actions-wrap input[name="add_cart"]').attr('disabled', false);
    } else {
        $('.form-actions-wrap input[name="add_cart"]').attr('disabled', true);
        return;
    }
    // to date cannot be earlier or same as from date
    if (dates[1] <= dates[0]) {
        $('.form-actions-wrap input[name="add_cart"]').attr('disabled', true);
        return;
    } else {
        $('.form-actions-wrap input[name="add_cart"]').attr('disabled', false);
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
        if (! isAvailable(curDay)[0]) {
            $('.form-actions-wrap input[name="add_cart"]').attr('disabled', true);
            return;
        }
    }
    $('.form-actions-wrap input[name="add_cart"]').attr('disabled', false);
}

function parseReservationDates() {
    var dateArr = [$('input#id_from_date').val().split('.'), $('input#id_to_date').val().split('.')];
    var fromDate = new Date(parseInt(dateArr[0][2]), parseInt(dateArr[0][1])-1, parseInt(dateArr[0][0]));
    var toDate = new Date(parseInt(dateArr[1][2]), parseInt(dateArr[1][1])-1, parseInt(dateArr[1][0]));
    return [fromDate, toDate];
}

$(document).ready(function(){    
    
    $('.form-actions-wrap input[name="add_cart"]').attr('disabled', true);
    
    $("#datepicker-reservations").datepicker({
        beforeShowDay: isAvailable,
        onSelect: function(selectedDate) {
            $(datepickerTarget).val(selectedDate);
            switchDatepickerTarget();
            var dates = parseReservationDates();
            validateAddToCartButton(dates);
        },
        firstDay: 1,
        minDate: 0,
        maxDate: 150,
        dateFormat: "dd.mm.yy"
    });
    $("#datepicker-reservations").datepicker("show");
});
