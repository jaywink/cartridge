
function isReserved(date) {
    if (typeof reservedDays[date.getFullYear()] !== 'undefined' &&
            typeof reservedDays[date.getFullYear()][date.getMonth()+1] !== 'undefined' ){
        if (reservedDays[date.getFullYear()][date.getMonth()+1].indexOf(date.getDate()) != -1) {
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

function controlAddToCartButton() {
    if ($('input#id_from_date').val().length > 0 && $('input#id_to_date').val().length > 0) {
        $('.form-actions-wrap input[name="add_cart"]').attr('disabled', false);
    } else {
        $('.form-actions-wrap input[name="add_cart"]').attr('disabled', true);
    }
}

$(document).ready(function(){    
    
    $('.form-actions-wrap input[name="add_cart"]').attr('disabled', true);
    
    $("#datepicker-reservations").datepicker({
        beforeShowDay: isReserved,
        onSelect: function(selectedDate) {
            $(datepickerTarget).val(selectedDate);
            switchDatepickerTarget();
            controlAddToCartButton();
            //TODO validate date range and disable buy button if not ok
        },
        firstDay: 1,
        minDate: 0,
        maxDate: 120,
        dateFormat: "dd.mm.yy"
    });
    $("#datepicker-reservations").datepicker("show");
});
