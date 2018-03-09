var ascii_results_area = document.getElementById("ascii_results_box");
var html_results_area = document.getElementById("html_results_box");
var html_source_area = document.getElementById("html_source_box");
var latex_results_area = document.getElementById("latex_source_box");

function convert(){
	var csv_input = document.getElementById("csv_input").value;
	var using_headers = document.getElementById("use_headers").checked;
	var using_latex_row_lines = document.getElementById("latex-row-lines").checked;
	var converted_data = $.csv.toArrays(csv_input);
	var ascii_result = "";
	
	/*ASCII TABLE*/
	//find the required length of each column
	var col_lengths = [];
	for (var col=0; col<converted_data[0].length; col++){
		var max = 0;
		for (var row=0; row<converted_data.length; row++){
			if (converted_data[row][col].length > max){
				max = converted_data[row][col].length;
			}
		}
		col_lengths.push(max);
	}
	//generate top line
	ascii_result += ascii_separator(col_lengths);
	//add Headings
	ascii_result += ascii_line(converted_data[0], col_lengths);
	//generate separator below header, if applicable
	if(using_headers){
		ascii_result += ascii_separator(col_lengths);
	}
	//add subsequent rows
	for (var i=1; i<converted_data.length; i++){
		ascii_result += ascii_line(converted_data[i], col_lengths);
	}
	//generate bottom line
	ascii_result += ascii_separator(col_lengths);
	//write result to ASCII result area
	ascii_results_area.value = ascii_result;

	/*HTML TABLE*/
	var html_result = "<table>\n";
	//write first line, as a header if applicable
	html_result += html_line(converted_data[0], using_headers);
	//write subsequent lines
	for (var i=1; i<converted_data.length; i++){
		html_result += html_line(converted_data[i], false);
	}
	html_result += "</table>";
	//write result to HTML results & source areas
	html_results_area.innerHTML = html_result;
	html_source_area.innerHTML = html_result;

	/*LATEX TABLE*/
	var latex_result = latex_begin(converted_data[0].length);
	//write first line, as a header if applicable
	latex_result += latex_line(converted_data[0], using_headers, using_latex_row_lines);
	for (var i=1; i<converted_data.length; i++){
		latex_result += latex_line(converted_data[i], false, using_latex_row_lines);
	}
	if (!using_latex_row_lines){
		latex_result += "\\hline\n";
	}
	latex_result += "\\end{tabular}";
	latex_results_area.innerHTML = latex_result;

	show_hidden_items();
}

function ascii_separator(lengths){
	var tmp = "";
	for (var i=0; i<lengths.length; i++){
		tmp += "+";
		for (var j=0; j<lengths[i]+2; j++){
			tmp += "-";
		}
	}
	//tmp += "+<br/>";
	tmp += "+\n";
	return tmp;
}

function ascii_line(data, lengths){
	var tmp = "";
	for (var i=0; i<data.length; i++){
		var lengthOfCell = lengths[i]+2;
		//tmp += "|&nbsp;";
		tmp += "| ";
		tmp += data[i];
		var currentLength = data[i].length + 1;
		while (currentLength < lengthOfCell){
			//tmp += "&nbsp;";
			tmp += " ";
			currentLength++;
		}
	}
	//tmp += "|<br/>";
	tmp += "|\n";
	return tmp;
}

function html_line(data, isHeader){
	var tmp = "";
	tmp += "\t<tr>\n";
	for (var i=0; i<data.length; i++){
		if (isHeader){
			tmp += ("\t\t<th>" + data[i] + "</th>\n");
		}
		else{
			tmp += ("\t\t<td>" + data[i] + "</td>\n");
		}
	}
	tmp += "\t</tr>\n";
	return tmp;
}

function latex_begin(numCols){
	var tmp = "\\begin{tabular}{";
	for (var i=0; i<numCols; i++){
		tmp += "|c";
	}
	tmp += "|}\n\\hline\n";
	return tmp;
}

function latex_line(data, isHeader, rowLines){
	var tmp = "";
	//first column is not preceeded by a &:
	if (isHeader){
		tmp += (" \\textbf{" + data[0] + "}");
	}
	else{
		tmp += data[0]
	}
	//subsequent columns are:
	for (var i=1; i<data.length; i++){
		if (isHeader){
			tmp += (" & \\textbf{" + data[i] + "}");
		}
		else{
			tmp += (" & " + data[i]);
		}
	}
	tmp += "\\\\\n";
	if (isHeader || rowLines){
		tmp += "\\hline\n";
	}
	return tmp;
}

function show_hidden_items(){
	var items = document.getElementsByClassName('result_wrapper');
	for (var i=0; i<items.length; i++){
		items[i].style.display="inline-block";
	}
}

function toggle_options(){
	var options_panel = document.getElementById("options");
	var options_link = document.getElementById("toggle_options");
	if (options_panel.style.display == "none"){
		options_panel.style.display = "inline-block";
		options_link.innerHTML = "Hide Options";
	}
	else{
		options_panel.style.display = "none";
		options_link.innerHTML = "Show Options";
	}
}

function reset(){
	var items = document.getElementsByClassName("result_wrapper");
	for (var i=0; i<items.length; i++){
		items[i].style.display="none";
	}
	document.getElementById("csv_input").value = "\n\n";
}









