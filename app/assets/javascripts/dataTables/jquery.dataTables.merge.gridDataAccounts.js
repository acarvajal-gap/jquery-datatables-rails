/**
 * Datatable custom helpers for grouping --acarvajal 07/19/14
 *
 * 1. Rowspan
 * 2. Delete repeated
 *
 */

/** Main function for merge cells **/

function mergeCells(id){
    equalClassesTable(id);
    groupTable($(id+" tr:has(td)"), 0, 3);
    removeFromTable(id);
    removeAsterisk(id);
}

/** Merge the html cells, modifying the rowspan attribute **/
function groupTable($rows, startIndex, total){
    if (total === 0){
        return;
    }
    var i , currentIndex = startIndex, count=1, lst=[];
    var tds = $rows.find('td:eq('+ currentIndex +')');
    var next_tds = $rows.find('td:eq('+ (currentIndex+1) +')');
    var ctrl = $(tds[0]);
    var next_ctrl = $(next_tds[0]);
    lst.push($rows[0]);
    for (i=1;i<=tds.length;i++){
        if (ctrl.hasClass('mergeable') && !(ctrl.text().indexOf("*") >= 0)) {
            if ((ctrl.text() == $(tds[i]).text()) && (next_ctrl.text()==$(next_tds[i]).text())){
                count++;
                $(tds[i]).addClass('deleted');
                lst.push($rows[i]);
            } else {
                if (count>1){
                    ctrl.attr('rowspan',count);
                    groupTable($(lst),startIndex+1,total-1)
                }
                count=1;
                lst = [];
                ctrl=$(tds[i]);
                next_ctrl = $(next_tds[i]);
                lst.push($rows[i]);
            }
        }
        else {
            if (ctrl.text() ==  $(tds[i]).text()){
                count++;
                $(tds[i]).addClass('deleted');
                lst.push($rows[i]);
            }
            else{
                if (count>1){
                    ctrl.attr('rowspan',count);
                    groupTable($(lst),startIndex+1,total-1)
                }
                count=1;
                lst = [];
                ctrl=$(tds[i]);
                next_ctrl = $(next_tds[i]);
                lst.push($rows[i]);
            }
        }
    }
}

/** Remove the repeated cells **/
function removeFromTable(id){
    $(id+" .deleted").remove();
}

function equalClassesTable(table_name){
    var trs = getTrsArrayFromTable(table_name);
    for(var x = 1; x < trs.length; x++){
        tds_aux = splitTrtoArrayStrings(trs[x]);
        name = tds_aux[0].replace(/\s+/g,"") + tds_aux[1];
        name = name.replace('*',"");
        $(trs[x]).addClass(name + "-hover");
        $(trs[x]).addClass("hightligthTR");
    }
}

function getTrsArrayFromTable(table){
    return $(table + " tr");
}

function splitTrtoArrayStrings(tr){
    var array = $(tr).find("td");
    for(var i = 0; i < array.length; i++){
        array[i] = $(array[i]).text()
    }
    return array;
}

/** Remove the asterisk from parents **/
function removeAsterisk(id){
    $.each($(id+" .mergeable"), function( i, val ) {
        $(val).text($(val).text().replace('*',""));
    });
}