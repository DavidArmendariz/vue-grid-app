import Papa from 'papaparse';

export function getColumnKeys(data) {
  return Object.keys(data[0] || {});
}

export function getCSVContent(data) {
  return Papa.unparse(data, { delimiter: ';' });
}

export function joinArray(arr, sep = ',') {
  return arr.join(sep + ' ');
}

export function getColumnsShown() {
  return getColumnKeys(this.filteredData).reduce((result, columnKey) => {
    result[columnKey] = true;
    return result;
  }, {});
}

export function getCurrentSort() {
  const existingQueryParams = this.$route.query;
  let existingSort;
  try {
    existingSort = JSON.parse(decodeURIComponent(existingQueryParams.sort));
  } catch {
    existingSort = [];
  }
  return existingSort.filter((sortEntry) => sortEntry.key !== this.columnKey);
}
