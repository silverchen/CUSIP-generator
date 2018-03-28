let counter = 2;

$(document).ready(function() {
    $("#addRow").on("click", addRow);

    $("table.order-list").on("click", ".ibtnDel", function() {
        $(this).closest("tr").remove();
        counter -= 1
    });

    $(document).on("input", "input[name=ticket]", function() {
        var resultElement = $("#cusip-" + $(this).attr('id'));
        if ($(this).val() != undefined && $(this).val() != null && $(this).val().length > 0) {
            generateResult(resultElement, $(this).val());
        } else {
            resultElement.html("");
            resultElement.css('border-color', '');
        }
    });

    $("#uploadFile").on("change", function(event) {
        var fileInput = event.target;
        var fileName = $(this).val();
        var err;

        if (fileName == undefined || fileName == null || fileName.length == 0) {
            console.error('No file selected');
            return;
        }

        if ('files' in fileInput) {
            if (fileInput.files.length == 0) {
                err = 'No file selected';
            } else {
                var file = fileInput.files[0];

                if (file) {
                    var reader = new FileReader();
                    reader.readAsText(file, 'UTF-8');
                    reader.onload = (event) => {
                        var tickets = event.target.result.split(/\r?\n/);
                        var emptyFields = [];
                        var tickerId;

                        for (var i = 0; i < tickets.length; i++) {
                            emptyFields = $('input:text').filter(function() { return $(this).val() == ""; });

                            if (emptyFields.length > 0) {
                                tickerId = emptyFields[0].id;
                            } else {
                                tickerId = addRow();
                            }

                            $("#" + tickerId).val(tickets[i]); 
                            generateResult($("#cusip-" + tickerId), tickets[i]);
                        }
                    }
                    reader.onerror = (event) => {
                        err = 'Error reading file';
                    }
                }
            }
        } else {
            err = 'No file selected';
        }

        if (err != undefined && err != null) {
            console.error(err);
        }
    });
});

function generateResult(resultElement, tickerVal) {
    try {
        if (tickerVal != undefined && tickerVal != null && tickerVal.length > 0) {
            resultElement.html(generateCUSIP(tickerVal));
        }

        resultElement.css('border-color', ''); 
    } catch (e) {
        resultElement.html(e);
        resultElement.css('border-color', 'red'); 
        console.error(e);
    }
}

function addRow() {
    var newRow = $("<tr>");
    var cols = "";
    var tickerId = "ticket" + counter;

    cols += '<td class="col-sm-5"><input id="' + tickerId + '" type="text" name="ticket" class="form-control" /></td>';
    cols += '<td class="col-sm-5"><div id="cusip-' + tickerId + '" name="cusip" class="form-control disabled"></div></td>';
    cols += '<td class="col-sm-2"><input type="button" class="ibtnDel btn btn-md btn-danger" value="Delete"></td>';
    
    newRow.append(cols);
    $("table.order-list").append(newRow);
    counter++;

    return tickerId;
}