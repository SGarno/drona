export function viewToJSON(view) {
    var rows = [];
    var col_count = view.Axes[0].Cardinality;
    var row_count = view.Axes[1].Cardinality;
    var cell_count = view.Cells.length;
    var row_dims = view.Axes[1].Hierarchies;
    var col_tuples = view.Axes[0].Tuples;
    var row_tuples = view.Axes[1].Tuples;
    var row_headers = row_dims.length;
    var row = {};

    // --- Populate rowset data
    var cell_index = 0;
    var col_index = 0;
    var row_index = 0;
    var col_name = "";
    view.Cells.forEach(function (cell) {
      if (col_index == 0) {
        if (cell_index > 0) rows.push(row);
        row = {};
        for (dim_index = 0; dim_index < row_headers; dim_index++) {
          col_name = row_dims[dim_index].Name;
          value = row_tuples[row_index].Members[dim_index].Attributes.Caption;
          row[col_name] = value;
          //console.log( 'row[' + col_name + '] = "' + cell.Value + '"')
        }
      }

      col_name = col_tuples[col_index].Members.map(function (member) {
        return member.Attributes.Caption;
      }).join('`');
      row[col_name] = cell.Value;
      cell_index++;
      col_index = cell_index % col_count;
      row_index = Math.floor(cell_index / (col_count + 1));
    });
    rows.push(row);
    return rows;
}