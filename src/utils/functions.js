import Papa from 'papaparse';
import { LIMIT } from './constants';

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

  if (offsetChanged) {
    const offset = parseInt(newRoute.query.offset) || 1;
    const filters = getItemFromLocalStorage('filters', {});
    const newData = this.model.getData({
      ...filters,
      offset: limit * (offset - 1),
    });
    this.updateData(newData);
    return;
  }
}

export function shouldPersistedFieldBeIncluded(columnKey, storedColumns) {
  if (this.persistedFields[columnKey] && storedColumns.length) {
    return storedColumns.includes(columnKey);
  }
  return !!this.columnsShown[columnKey];
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
  const existingFilters = getItemFromLocalStorage('filters', {});
  const filters = JSON.stringify({ ...existingFilters, all: true });
  const uniqueValues = this.model.getUniqueValuesForColumn(this.columnKey, filters);
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

export function handleFilterChange(filterType, value, limit = LIMIT) {
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

    if (filterType === 'search') {
      filters.offset = 1;
    } else {
      filters.offset = filters.offset || 1;
    }

    const newData = this.model.getData(getFormattedFilters(filters, limit));
    window.localStorage.setItem('filters', JSON.stringify(filters));
    this.updateData(newData);
  }
}

export function getItemFromLocalStorage(key, defaultValue = null) {
  try {
    let keys = key.split('.');
    let item = JSON.parse(window.localStorage.getItem(keys[0]));

    keys = keys.slice(1);

    if (!item && !keys.length) {
      return defaultValue;
    }

    for (const key of keys) {
      item = item[key];
      if (!item) {
        return defaultValue;
      }
    }

    return item;
  } catch (err) {
    return defaultValue;
  }
}

export function getFormattedFilters(filters, limit = LIMIT) {
  return JSON.stringify({
    ...filters,
    offset: limit * (filters.offset - 1),
  });
}
