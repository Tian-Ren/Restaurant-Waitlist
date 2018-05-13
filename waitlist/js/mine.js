$(function () {
    $(document).ready(listWaitlist);
    const requestUrl = 'https://47fvyl9f19.execute-api.us-east-1.amazonaws.com/wl/waitlist';

    /***************************Function Start**************************************************/
    $("#submit").on("click", function () {
        var waitList = document.getElementById("waitlist");
        var idx = waitList.rows.length;
        var opts = document.getElementById("tableSize");
        var selectedSize = opts.options[opts.selectedIndex].value;
        var fName = $("#firstName").val();
        var lName = $("#lastName").val();
        var phoneNum = $("#phone").val();
        document.getElementById("myForm").reset();
        if (fName && lName && phoneNum && selectedSize) {
            var addParam = {
                mode: 'cors',
                method: 'POST',
                headers: {
                    'content-type': 'application/json'
                },
                body: JSON.stringify({
                    "firstName": fName,
                    "lastName": lName,
                    "tableSize": selectedSize,
                    "phone": phoneNum
                })
            };

            fetch(requestUrl, addParam).then(
                function (response) {
                    if (response.status !== 200) {
                        console.log(response.status);
                        console.log('Looks like there was a problem. Status Code: ' +
                            response.status);
                        return;
                    }

                    var newRow = waitList.insertRow();
                    var num = newRow.insertCell();
                    var name = newRow.insertCell();
                    var size = newRow.insertCell();
                    var phone = newRow.insertCell();
                    var status = newRow.insertCell();
                    num.innerHTML = idx.toString();
                    $("#waitCount").text(idx);
                    name.innerHTML = fName + " " + lName;
                    size.innerHTML = selectedSize;
                    phone.innerHTML = phoneNum;
                    var options = {
                        hour: "2-digit", minute: "2-digit",year: "numeric", month: "numeric",
                        day: "numeric"
                    };
                    status.innerHTML = new Date().toLocaleTimeString("en-us", options);
                    status.setAttribute("align" , "right");
                }
            ).catch(function (err) {
                console.log('Fetch Error :-S', err);
            });

        }
    })
    /***************************Function End**************************************************************************************/


    /***************************DELETE Function Start**************************************************/
    $(document).on('click', '.doneBtn', function () {

        const sizeCell = this.parentNode.previousSibling;
        const tbNumCell = sizeCell.previousSibling;
        const tableSize = sizeCell.innerHTML;
        const tableNum = tbNumCell.innerHTML;

        const tbList = document.getElementById("tableList");
        const removeCell = document.getElementById("tableNum" + tableNum);
        const removeIdx = removeCell.parentNode.rowIndex;
        var waitCnt = document.getElementById("waitCount").innerText;
        var avaiCnt = parseInt(document.getElementById("available").innerText);
        var inUseCnt = parseInt(document.getElementById("inUse").innerText);
        var doneCnt = parseInt(document.getElementById("doneCount").innerText);
        tbList.deleteRow(removeIdx);
        for (var i = removeIdx; i < tbList.rows.length; i++) {
            tbList.rows[i].firstChild.innerHTML = i;
        }

        // remove from waitlist
        var wtList = document.getElementById("waitlist");
        var wlName;
        var idx;
        var noticePhoneNum;
        for (idx = 0; idx < wtList.rows.length; idx++) {
            if (wtList.rows[idx].cells[2].innerHTML == tableSize) {
                wlName = wtList.rows[idx].cells[1].innerHTML;
                noticePhoneNum = wtList.rows[idx].cells[3].innerHTML
                wtList.deleteRow(idx);
                break;
            }
        }
        for (var j = idx; j < wtList.rows.length; j++) {
            wtList.rows[j].firstChild.innerHTML = j;
        }

        if (wlName) {
            var newRow = tbList.insertRow();
            var num = newRow.insertCell();
            var name = newRow.insertCell();
            var tbNum = newRow.insertCell();
            var size = newRow.insertCell();
            var done = newRow.insertCell();

            num.innerHTML = (tbList.rows.length - 1).toString();
            name.innerHTML = wlName;
            tbNum.innerHTML = tableNum;
            tbNum.setAttribute("id", "tableNum" + tableNum);
            size.innerHTML = tableSize;
            done.setAttribute("align" , "right");
            done.innerHTML = "<button id='removeBtn' class='doneBtn badge badge-info'>Done</button>";
            document.getElementById("waitCount").innerText = (waitCnt - 1).toString();
        } else {
            document.getElementById("available").innerText = (avaiCnt + 1).toString();
            document.getElementById("inUse").innerText = (inUseCnt-1).toString();
        }

        document.getElementById("doneCount").innerText = (doneCnt+1).toString();

        var delParam = {
            mode: 'cors',
            method: 'DELETE',
            headers: {
                'content-type': 'application/json'
            },
            body: JSON.stringify({
                "tableNum": tableNum,
                "tableSize": tableSize,
                "phone" : noticePhoneNum
            })
        };

        fetch(requestUrl, delParam).then(
            function (response) {
                if (response.status !== 200) {
                    console.log(response.status);
                    console.log('Looks like there was a problem. Status Code: ' +
                        response.status);
                    return;
                }

    }).catch(function (err) {
        console.log('Fetch Error :-S', err);
    });

})
/***************************Function End**************************************************************************************/


/***************************Function Start**************************************************/
var listParam = {
    mode: 'cors',
    method: 'get',
    headers: {
        'content-type': 'application/json'
    }
};

function listWaitlist() {
    fetch(requestUrl, listParam).then(
        function (response) {
            if (response.status !== 200) {
                console.log(response.status);
                console.log('Looks like there was a problem. Status Code: ' +
                    response.status);
                return;
            }
            // Examine the text in the response
            response.json().then(function (data) {
                var tableCount = 0;
                var waitCount = 0;
                var options = {
                    hour: "2-digit", minute: "2-digit",year: "numeric", month: "numeric",
                    day: "numeric"
                };
                for (var i = 0; i < data.Items.length; i++) {
                    // if (data.Items[i].AssignedTable) {
                    //     $("#tableList").append("<tr><td>" + (tableCount + 1) + "</td><td>" + data.Items[i].First + " " + data.Items[i].Last + "</td><td id='tableNum" + data.Items[i].AssignedTable + "'>" + data.Items[i].AssignedTable + "</td><td>" + data.Items[i].Size + "</td><td><button id='doneBtn' class='doneBtn badge badge-info'>Done</button></td></tr>");
                    //     tableCount++;
                    // } else {
                    //     $("#waitlist").append("<tr><td>" + (waitCount + 1) + "</td><td>" + data.Items[i].First + " " + data.Items[i].Last + "</td><td>" + data.Items[i].Size + "</td><td>" + data.Items[i].Phone + "</td><td><button id='removeBtn" + (tableCount + 1) + "' class='doneBtn badge badge-success'>Remove</button></td></tr>");
                    //     waitCount++;
                    // }

                    if (data.Items[i].AssignedTable) {
                        $("#tableList").append("<tr><td>" + (tableCount + 1) + "</td><td>" + data.Items[i].First + " " + data.Items[i].Last + "</td><td id='tableNum" + data.Items[i].AssignedTable + "'>" + data.Items[i].AssignedTable + "</td><td>" + data.Items[i].Size + "</td><td><button id='doneBtn' class='doneBtn badge badge-info'>Done</button></td></tr>");
                        tableCount++;
                    } else {
                        $("#waitlist").append("<tr><td>" + (waitCount + 1) + "</td><td>" + data.Items[i].First + " " + data.Items[i].Last + "</td><td>" + data.Items[i].Size + "</td><td>" + data.Items[i].Phone + "</td><td>"+ new Date(data.Items[i].WaitlistId).toLocaleTimeString("en-us", options)+"</td></tr>");
                        waitCount++;
                    }
                }
                $("#waitCount").text(waitCount);
                $("#inUse").text(tableCount);
                $("#available").text(8 - tableCount);
            });

        }).catch(function (err) {
        console.log('Fetch Error :-S', err);
    });


}

/***************************Function End**************************************************************************************/


})
;