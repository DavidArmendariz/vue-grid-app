import { COLUMNS_MAP } from './mappings';
import { MAX_PAGINATION } from './constants';

export default class Utils {
  static getColumnKeys(data) {
    return Object.keys(data[0]);
  }

  static getEncodedCSVContent(data) {
    let csvContent = 'data:text/csv;charset=utf-8,';
    csvContent += [this.getColumnKeys(data).join(';'), ...data.map((row) => Object.values(row).join(';'))]
      .join('\n')
      .replace(/(^\[)|(\]$)/gm, '');
    return encodeURI(csvContent);
  }
}

export { COLUMNS_MAP, MAX_PAGINATION };
