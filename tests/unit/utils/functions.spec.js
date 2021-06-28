import { getColumnKeys, getColumnsShown, getCSVContent, joinArray } from '../../../src/utils/functions';

describe('functions', () => {
  describe('getColumnKeys', () => {
    it('should return column keys', () => {
      const data = [{ id: 1, firstName: 'david' }];
      expect(getColumnKeys(data)).toEqual(['id', 'firstName']);
    });

    it('should return an empty array if data is empty', () => {
      const data = [];
      expect(getColumnKeys(data)).toEqual([]);
    });
  });

  describe('getCSVContent', () => {
    it('should parse a JSON into a CSV', () => {
      const data = [{ id: 1, firstName: 'david' }];
      expect(getCSVContent(data)).toEqual('id;firstName\r\n1;david');
    });
  });

  describe('joinArray', () => {
    it('should join an array of strings by commas', () => {
      const array = ['david', 'adrian'];
      expect(joinArray(array)).toEqual('david, adrian');
    });
  });

  describe('getColumnsShown', () => {
    it('should build an object where the keys are the columns shown', () => {
      const bind = {
        filteredData: [{ id: 1, firstName: 'david' }],
      };
      expect(getColumnsShown.bind(bind)()).toEqual({
        id: true,
        firstName: true,
      });
    });
  });
});
