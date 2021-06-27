import Utils from '../utils';

export default class BaseModel {
  constructor(limit, columnsTypes) {
    this.fetchOptions = {};
    this.limit = limit;
    this.columnsTypes = columnsTypes;
  }

  setFetchOptions(options) {
    this.fetchOptions = options;
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
    const allData = this.getData();
    return [...new Set(allData.map((row) => row[columnKey]))];
  }

  getmainTableData() {
    return this.mainTableData;
  }

  limitData(data) {
    const { offset = 0 } = this.fetchOptions;
    return data.slice(offset, offset + this.limit);
  }

  filterRowsBySearchString(data) {
    const loweredSearchString = decodeURIComponent(this.fetchOptions.search).toLowerCase();
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
    return Math.min(data.length, this.getmainTableData().length);
  }

  getPaginationCount(data) {
    const total = this.getTotal(data);
    const division = Math.ceil(total / this.limit);
    return total && total % this.limit === 0 ? division - 1 : division;
  }
}
