
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

$(document).ready(function(){    

    $("#datepicker-reservations").datepicker({
        beforeShowDay: isReserved,
        onSelect: function(selectedDate) {
            $("#id_from_date").val(selectedDate);
        },
        firstDay: 1,
        minDate: 0,
        maxDate: 120,
        
    });
    $("#datepicker-reservations").datepicker("show");
});
