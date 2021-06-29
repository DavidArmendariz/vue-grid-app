import BaseModel from '../../../src/models/base-model';

const LIMIT = 2;
const COLUMN_TYPES = {
  id: Number,
  firstName: String,
  lastName: String,
};

describe('BaseModel', () => {
  let baseModel;

  beforeEach(() => {
    baseModel = new BaseModel(LIMIT, COLUMN_TYPES);
  });

  describe('buildColumnsMap', () => {
    it('should build a map where the keys are the columns and the values are either true or false', () => {
      expect(baseModel.buildColumnsMap()).toEqual({
        id: true,
        firstName: true,
        lastName: true,
      });
      expect(baseModel.buildColumnsMap(false)).toEqual({
        id: false,
        firstName: false,
        lastName: false,
      });
    });
  });

  describe('setFetchOptions', () => {
    it('should set default values correctly if no options is passed', () => {
      baseModel.setFetchOptions();
      expect(baseModel.fetchOptions).toEqual({
        offset: 0,
        columns: [],
        search: '',
        sort: [],
        uniqueValues: [],
        all: false,
        isExport: false,
      });
    });

    it('should parse offset as an integer', () => {
      const filters = { offset: 2 };
      baseModel.setFetchOptions(JSON.stringify(filters));
      expect(baseModel.fetchOptions).toMatchObject({
        offset: 2,
      });
    });

    it('should parse columns into an array of strings', () => {
      const columnsArray = ['id', 'firstName'];
      const filters = { columns: columnsArray };
      baseModel.setFetchOptions(JSON.stringify(filters));
      expect(baseModel.fetchOptions).toMatchObject({
        columns: columnsArray,
      });
    });

    it('should decode search string', () => {
      const searchString = 'test!!!%%%';
      const filters = { search: searchString };
      baseModel.setFetchOptions(JSON.stringify(filters));
      expect(baseModel.fetchOptions).toMatchObject({
        search: searchString,
      });
    });

    it('should parse sort into an array of objects', () => {
      const sortArray = [{ key: 'id', order: 'asc' }];
      const filters = { sort: sortArray };
      baseModel.setFetchOptions(JSON.stringify(filters));
      expect(baseModel.fetchOptions).toMatchObject({
        sort: sortArray,
      });
    });

    it('should parse uniqueValues into an object', () => {
      const uniqueValuesArray = [{ key: 'firstName', values: ['david', 'adrian'] }];
      const filters = { uniqueValues: uniqueValuesArray };
      baseModel.setFetchOptions(JSON.stringify(filters));
      expect(baseModel.fetchOptions).toMatchObject({
        uniqueValues: uniqueValuesArray,
      });
    });
  });

  describe('buildHashMap', () => {
    it('should return an empty object if key is not present in data', () => {
      baseModel.data = {};
      expect(baseModel.buildHashMap('people', 'id')).toEqual({});
    });

    it('should build a hash map from an array of objects containing an id', () => {
      const data = {
        people: [
          { id: 1, firstName: 'david' },
          { id: 2, firstName: 'adrian' },
        ],
      };
      baseModel.data = data;
      const map = baseModel.buildHashMap('people', 'id');
      expect(map).toEqual({
        1: {
          id: 1,
          firstName: 'david',
        },
        2: {
          id: 2,
          firstName: 'adrian',
        },
      });
    });
  });

  describe('getTotal', () => {
    it('should get the data length if it is less than the main table data', () => {
      const mainTableData = [
        { id: 1, firstName: 'david' },
        { id: 2, firstName: 'adrian' },
        { id: 3, firstName: 'andres' },
      ];
      const data = mainTableData.slice(0, 2);
      baseModel.mainTableData = mainTableData;
      expect(baseModel.getTotal(data)).toEqual(2);
    });

    it('should get the main table data length if data length is the same as main table data length', () => {
      const mainTableData = [
        { id: 1, firstName: 'david' },
        { id: 2, firstName: 'adrian' },
        { id: 3, firstName: 'andres' },
      ];
      const data = [...mainTableData];
      baseModel.mainTableData = mainTableData;
      expect(baseModel.getTotal(data)).toEqual(3);
    });
  });

  describe('getPaginationCount', () => {
    it('should return 0 if data length is zero', () => {
      const mainTableData = [
        { id: 1, firstName: 'david' },
        { id: 2, firstName: 'adrian' },
        { id: 3, firstName: 'andres' },
      ];
      const data = [];
      baseModel.mainTableData = mainTableData;
      expect(baseModel.getPaginationCount(data)).toEqual(0);
    });

    it('should return 1 if data length is less than the limit set', () => {
      const mainTableData = [
        { id: 1, firstName: 'david' },
        { id: 2, firstName: 'adrian' },
        { id: 3, firstName: 'andres' },
      ];
      const data = mainTableData.slice(0, 1);
      baseModel.mainTableData = mainTableData;
      expect(baseModel.getPaginationCount(data)).toEqual(1);
    });

    it('should return 2 if data length is equal to main table data length', () => {
      const mainTableData = [
        { id: 1, firstName: 'david' },
        { id: 2, firstName: 'adrian' },
        { id: 3, firstName: 'andres' },
      ];
      const data = [...mainTableData];
      baseModel.mainTableData = mainTableData;
      expect(baseModel.getPaginationCount(data)).toEqual(2);
    });
  });

  describe('limitData', () => {
    it('should limit data if "all" fetch option is not set', () => {
      const data = [
        { id: 1, firstName: 'david' },
        { id: 2, firstName: 'adrian' },
        { id: 3, firstName: 'andres' },
      ];
      baseModel.setFetchOptions();
      expect(baseModel.limitData(data)).toEqual(data.slice(0, 2));
    });

    it('should not limit data if "all" fetch option is set to true', () => {
      const data = [
        { id: 1, firstName: 'david' },
        { id: 2, firstName: 'adrian' },
        { id: 3, firstName: 'andres' },
      ];
      const filters = { all: true };
      baseModel.setFetchOptions(JSON.stringify(filters));
      expect(baseModel.limitData(data)).toEqual(data);
    });
  });

  describe('setColumnsToDisplay', () => {
    it('should display all columns if columns is an empty array', () => {
      baseModel.setFetchOptions();
      baseModel.setColumnsToDisplay();
      expect(baseModel.columns).toEqual({
        id: true,
        firstName: true,
        lastName: true,
      });
    });

    it('should set the columns correctly', () => {
      const filters = { columns: ['id'] };
      baseModel.setFetchOptions(JSON.stringify(filters));
      baseModel.setColumnsToDisplay();
      expect(baseModel.columns).toEqual({
        id: true,
        firstName: false,
        lastName: false,
      });
    });
  });

  describe('filterRowsBySearchString', () => {
    it('should return data if search is not defined', () => {
      const data = [
        { id: 1, firstName: 'david' },
        { id: 2, firstName: 'andres' },
      ];
      baseModel.setFetchOptions();
      expect(baseModel.filterRowsBySearchString(data)).toEqual(data);
    });

    it('should return empty array if search is in data but column that contains it is not displayed', () => {
      const data = [
        { id: 1, firstName: 'david' },
        { id: 2, firstName: 'andres' },
      ];
      const filters = { columns: ['id'], search: 'david' };
      baseModel.setFetchOptions(JSON.stringify(filters));
      baseModel.setColumnsToDisplay();
      expect(baseModel.filterRowsBySearchString(data)).toEqual([]);
    });

    it('should return filtered data by search string', () => {
      const data = [
        { id: 1, firstName: 'david' },
        { id: 2, firstName: 'andres' },
      ];
      baseModel.setFetchOptions(JSON.stringify({ search: 'david' }));
      expect(baseModel.filterRowsBySearchString(data)).toEqual([{ id: 1, firstName: 'david' }]);
      baseModel.setFetchOptions(JSON.stringify({ search: 'DAVID' }));
      expect(baseModel.filterRowsBySearchString(data)).toEqual([{ id: 1, firstName: 'david' }]);
      baseModel.setFetchOptions(JSON.stringify({ search: 'vid' }));
      expect(baseModel.filterRowsBySearchString(data)).toEqual([{ id: 1, firstName: 'david' }]);
    });
  });

  describe('filterByUniqueValues', () => {
    it('should return data if unique values is not defined', () => {
      const data = [
        { id: 1, firstName: 'david' },
        { id: 2, firstName: 'andres' },
      ];
      baseModel.setFetchOptions();
      expect(baseModel.filterByUniqueValues(data)).toEqual(data);
    });

    it('should return data if unique values is not defined', () => {
      const data = [
        { id: 1, firstName: 'david' },
        { id: 2, firstName: 'andres' },
      ];
      const uniqueValues = [{ key: 'firstName', values: ['david'] }];
      baseModel.setFetchOptions(JSON.stringify({ uniqueValues }));
      expect(baseModel.filterByUniqueValues(data)).toEqual([{ id: 1, firstName: 'david' }]);
    });
  });
});
