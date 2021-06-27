import { DEALS_COLUMNS_MAP, DEALS_COLUMNS_TYPES, DOCS_COLUMNS_MAP, DOCS_COLUMNS_TYPES } from './mappings';
import { MAX_PAGINATION, LIMIT } from './constants';
import Papa from 'papaparse';

export default class Utils {
  static getColumnKeys(data) {
    return Object.keys(data[0] || {});
  }

  static getCSVContent(data) {
    return Papa.unparse(data, { delimiter: ';' });
  }

  static joinArray(arr, sep = ',') {
    return arr.join(sep + ' ');
  }
}

export { DEALS_COLUMNS_MAP, MAX_PAGINATION, LIMIT, DEALS_COLUMNS_TYPES, DOCS_COLUMNS_MAP, DOCS_COLUMNS_TYPES };
