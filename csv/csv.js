
function convert(){
	let using_headers = document.getElementById('use_headers').checked;
	let using_latex_row_lines = document.getElementById('latex-row-lines').checked;
	let converted_data = $.csv.toArrays($('#csv_input').val());
	
	/*ASCII TABLE*/
	//find the required length of each column
	col_lengths = Array(converted_data[0].length).fill(0);
	$(converted_data).each((y, row) =>
		$(row).each((x, val) => {
			col_lengths[x] = Math.max(col_lengths[x], val.length);
		})
	);
	$('#ascii_results_box').val(
		ascii_separator(col_lengths) + //top line
		ascii_line(converted_data[0], col_lengths) + //header line
		(using_headers ? ascii_separator(col_lengths) : '') + //header separator line
		$(converted_data.slice(1))
			.map((i, j) => ascii_line(j, col_lengths)).get().join('') + //subsequent rows
		ascii_separator(col_lengths) //bottom line
	);

	/*HTML TABLE*/
	let html_result = '<table>\n' +
		$(converted_data).map((i, v) =>
			html_line(v, i == 0 ? using_headers : false)
		).get().join('') +
		'</table>';
	//write result to HTML results & source areas
	$('#html_results_box').html(html_result);
	$('#html_source_box').val(html_result);

	/*LATEX TABLE*/
	$('#latex_source_box').val(
		latex_begin(converted_data[0].length) +
		latex_line(converted_data[0], using_headers, using_latex_row_lines) + //first line
		$(converted_data.slice(1)).map((i, j) => 
			latex_line(j, false, using_latex_row_lines)
		).get().join('') +
		(using_latex_row_lines ? '' : '\\hline\n') +
		'\\end{tabular}'
	);

	/*MARKDOWN TABLE*/
	//each line of the MD table uses the same format as the ASCII table, so we
	//only need a custom function for the separator between the header and
	//data, if applicable
	$('#md_results_box').val(
		ascii_line(converted_data[0], col_lengths) + //header line
		(using_headers ? md_separator(col_lengths) : '') + //header separator line
		$(converted_data.slice(1))
			.map((i, j) => ascii_line(j, col_lengths)).get().join('') //subsequent rows
	);

	show_hidden_items();
}

/*
	Generates a horizontal line of an ASCII art table.

	Inputs:
		lengths - Array of column widths
	
	Sample Input:
		([3, 4, 2])
	Sample Output:
		'+-----+------+----+'
*/
function ascii_separator(lengths){
	return '+' + $(lengths).map((i, length) => '-'.repeat(length + 2)).get().join('+') + '+\n';
}

/*
	Generates one line of cells for an ASCII art table.

	Inputs:
		data    - Array of cell contents
		lengths - Array of column widths
	
	Sample Input:
		(['a', 'b', 'c'], [3, 4, 2])
	Sample Output:
		'| a   | b    | c  |'
*/
function ascii_line(data, lengths){
	return '| ' +
		$(data).map((i, text) => 
			text.padEnd(lengths[i], ' ')
		).get().join(' | ') +
		' |\n';
}

/*
	Generates the HTML for one row of an HTML table.

	Inputs:
		data     - Array of cell contents
		isHeader - Boolean indicating whether this row is a header row
	
	Sample Input:
		(['a', 'b', 'c'], true)
	Sample Output:
		'\t<tr>\n\t\t<th>a</th>\n\t\t<th>b</th>\n\t\t<th>c</th>\n\t</tr>\n'
*/
function html_line(data, isHeader){
	let tag = isHeader ? 'th' : 'td';
	return '\t<tr>\n' +
		$(data).map((i, text) =>
			'\t\t<' + tag + '>' + text + '</' + tag + '>\n'
		).get().join('') +
		'\t</tr>\n';
}

function latex_begin(numCols){
	return '\\begin{tabular}{' +
		'|c'.repeat(numCols) +
		'|}\n\\hline\n';
}

function latex_line(data, isHeader, rowLines){
	return (isHeader ?
			'\\textbf{' + data.join('} & \\textbf{') + '}' :
			data.join(' & ')
		) +
		'\\\\\n' +
		((isHeader || rowLines) ? '\\hline\n' : '');
}

function md_separator(lengths){
	return '| ' + $(lengths).map((i, length) => '-'.repeat(length)).get().join(' | ') + ' |\n';
}

function show_hidden_items(){
	$('.result_wrapper').css('display', 'inline-block');
}

function toggle_options(){
	let panel = $('#options');
	let button = $('#toggle_options');

	if (panel.css('display') == 'none'){
		panel.css('display', 'inline-block');
		button.innerText('Hide Options');
	}
	else{
		panel.css('display', 'none');
		button.innerText('Show Options');
	}
}

function reset(){
	$('.result_wrapper').css('display', 'none');
	$('#csv_input').val('');
}
