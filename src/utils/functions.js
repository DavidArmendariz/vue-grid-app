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

export function getPaginationNumber(maxPagination) {
  if (this.paginationCount <= maxPagination) {
    return Array.from(Array(this.paginationCount), (_, index) => index + 1);
  }

  let i = 1;
  const leftNumbers = [];
  const rightNumbers = [];
  while (leftNumbers.length + rightNumbers.length + 1 < maxPagination) {
    const left = this.activePagination - i;
    const right = this.activePagination + i;
    if (left >= 1) {
      leftNumbers.push(left);
    }
    if (right <= this.paginationCount) {
      rightNumbers.push(right);
    }
    i++;
  }
  leftNumbers.reverse();
  const paginationNumbers = [...leftNumbers, this.activePagination, ...rightNumbers];
  paginationNumbers[0] = 1;
  paginationNumbers[maxPagination - 1] = this.paginationCount;
  if (paginationNumbers[1] - paginationNumbers[0] !== 1) {
    paginationNumbers.splice(1, 0, '...');
  }
  if (paginationNumbers[paginationNumbers.length - 1] - paginationNumbers[paginationNumbers.length - 2] !== 1) {
    paginationNumbers.splice(paginationNumbers.length - 1, 0, '...');
  }
  return paginationNumbers;
}

export function handleRouteChange(newRoute, oldRoute, limit) {
  const offsetChanged = newRoute.query.offset !== oldRoute.query.offset;
  const searchChanged = newRoute.query.search !== oldRoute.query.search;
  const columnsChanged = newRoute.query.columns !== oldRoute.query.columns;
  const sortChanged = newRoute.query.sort !== oldRoute.query.sort;
  const uniqueValuesChanged = newRoute.query.uniqueValues !== oldRoute.query.uniqueValues;

  if (offsetChanged || columnsChanged || sortChanged || uniqueValuesChanged) {
    const offset = parseInt(newRoute.query.offset) || 1;
    const newData = this.model.getData({
      ...newRoute.query,
      offset: limit * (offset - 1),
    });
    this.updateData(newData);
    return;
  }

  if (searchChanged) {
    const newData = this.model.getData({
      ...newRoute.query,
      offset: 0,
    });
    this.updateData(newData);
  }
}

export function shouldPersistedFieldBeIncluded(columnKey, getColumnsFromQueryParams) {
  if (this.persistedFields[columnKey] && getColumnsFromQueryParams.length) {
    return getColumnsFromQueryParams.includes(columnKey);
  }
  return !!this.columnsShown[columnKey];
}

export function getColumnsFromQueryParams() {
  let columnsInQueryParams;

  try {
    columnsInQueryParams = JSON.parse(decodeURIComponent(this.$route.query.columns));
  } catch {
    columnsInQueryParams = [];
  }

  return columnsInQueryParams;
}

export function processRow(columnKey, row, ellipsis = false) {
  if (!row) {
    return '(blank)';
  }

  let rowContent;

  switch (this.columnsTypes[columnKey]) {
    case Array:
      rowContent = row.join(', ') || '(blank)';
      break;
    case Date:
      rowContent = new Date(Date.parse(row)).toLocaleString();
      break;
    case Number:
      rowContent = row.toString();
      break;
    default:
      rowContent = row;
  }

  if (rowContent.length > 20 && ellipsis) {
    rowContent = (rowContent + '').slice(0, 20) + '...';
  }

  return rowContent;
}

export function getUniqueValues() {
  const uniqueValues = this.model.getUniqueValuesForColumn(this.columnKey, { all: 'true' });
  const columnsTypes = this.columnsTypes;
  return uniqueValues.reduce((result, currentValue) => {
    let name = currentValue || '(blank)';

    switch (columnsTypes[this.columnKey]) {
      case Array:
        name = currentValue.join(', ');
        break;
    }

    const entry = {
      value: currentValue,
      checked: true,
      name,
    };
    result.push(entry);
    return result;
  }, []);
}

export function handleFilterChange(filterType, value, limit) {
  let filters = window.localStorage.getItem('filters');

  try {
    filters = JSON.parse(filters) || {};
  } catch {
    filters = {};
  }

  const storedValue = filters[filterType];
  const filterChanged = storedValue !== value;

  if (filterChanged) {
    filters[filterType] = value;
    let offset;

    if (filterType === 'search') {
      offset = 1;
    } else {
      offset = parseInt(filters.offset) || 1;
    }

    const newData = this.model.getData(
      JSON.stringify({
        ...filters,
        offset: limit * (offset - 1),
      })
    );
    window.localStorage.setItem('filters', JSON.stringify(filters));
    this.updateData(newData);
  }
}

export function getItemFromLocalStorage(key) {
  try {
    let keys = key.split('.');
    let item = JSON.parse(window.localStorage.getItem(keys[0]));
    keys = keys.slice(1);
    for (const key of keys) {
      item = item[key];
      if (!item) {
        return null;
      }
    }
    return item;
  } catch (err) {
    console.error('Something went wrong: ', err);
    return null;
  }
}
