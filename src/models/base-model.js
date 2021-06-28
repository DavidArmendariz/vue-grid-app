import * as Utils from '../utils';

export default class BaseModel {
  constructor(limit, columnsTypes) {
    this.fetchOptions = {};
    this.limit = limit;
    this.columnsTypes = columnsTypes;
    this.columns = this.buildColumnsMap();
  }

  buildColumnsMap(flag = true) {
    return Object.keys(this.columnsTypes).reduce((result, columnKey) => {
      result[columnKey] = flag;
      return result;
    }, {});
  }

  setFetchOptions(options) {
    const { offset, columns, search, sort, all = false } = options;

    let processedOffset = 0;
    let processedColumns = [];
    let processedSearch = '';
    let processedSort = [];

    if (offset) {
      processedOffset = parseInt(offset);
    }

    if (columns) {
      try {
        processedColumns = JSON.parse(decodeURIComponent(columns));
      } catch (err) {
        console.error('Something went wrong when parsing columns fetch option: ', err);
      }
    }

    if (search) {
      processedSearch = decodeURIComponent(search);
    }

    if (sort) {
      try {
        processedSort = JSON.parse(decodeURIComponent(sort));
      } catch (err) {
        console.error('Something went wrong when parsing columns fetch option:', err);
      }
    }

    const fetchOptions = {
      offset: processedOffset,
      columns: processedColumns,
      search: processedSearch,
      sort: processedSort,
      all,
    };

    this.fetchOptions = fetchOptions;
  }

  buildHashMap(key, idKey) {
    const attributeData = this.data[key] || [];
    return attributeData.reduce((result, row) => {
      const id = row[idKey];
      result[id] = row;
      return result;
    }, {});
  }

  getUniqueValuesForColumn(columnKey) {
    const { data } = this.getData({ all: true });
    return [...new Set(data.map((row) => row[columnKey]))];
  }

  getMainTableData() {
    return this.mainTableData;
  }

  limitData(data) {
    const { offset, all } = this.fetchOptions;
    return all ? data : data.slice(offset, offset + this.limit);
  }

  filterRowsBySearchString(data) {
    const { search } = this.fetchOptions;

    if (!search) {
      return data;
    }

    const loweredSearchString = search.toLowerCase();
    return data.filter((row) => {
      let containsSearchString = false;
      for (const [columnKey, value] of Object.entries(row)) {
        if (!value) {
          continue;
        }

        if (this.columnsTypes[columnKey] === String) {
          containsSearchString = value.toLowerCase().includes(loweredSearchString);
        }

        if (this.columnsTypes[columnKey] === Array && value.every((x) => typeof x === 'string')) {
          const string = Utils.joinArray(value);
          containsSearchString = string.toLowerCase().includes(loweredSearchString);
        }

        if (containsSearchString) {
          break;
        }
      }
      return containsSearchString;
    });
  }

  getTotal(data) {
    return Math.min(data.length, this.getMainTableData().length);
  }

  getPaginationCount(data) {
    const total = this.getTotal(data);
    const division = Math.ceil(total / this.limit);
    return total && total % this.limit === 0 ? division - 1 : division;
  }

  setColumnsToDisplay() {
    const { columns } = this.fetchOptions;

    if (!columns.length) {
      this.columns = this.buildColumnsMap();
      return;
    }

    this.columns = this.buildColumnsMap(false);

    columns.forEach((columnToDisplay) => {
      this.columns[columnToDisplay] = true;
    });
  }

  sortData(data) {
    const { sort } = this.fetchOptions;

    if (!sort.length) {
      return data;
    }

    return data.sort((a, b) => {
      let result;
      sort.forEach((column) => {
        const { key, order } = column;
        let multiplier = order.toLowerCase() === 'asc' ? 1 : -1;

        if (this.columnsTypes[key] === String) {
          result = result || (a[key] || '').localeCompare(b[key] || '') * multiplier;
        }

        if (this.columnsTypes[key] === Number) {
          result = result || (a - b) * multiplier;
        }
      });
      return result;
    });
  }
}
