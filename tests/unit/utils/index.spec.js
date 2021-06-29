import {
  getColumnKeys,
  getColumnsFromQueryParams,
  getColumnsShown,
  getCSVContent,
  getCurrentSort,
  getPaginationNumber,
  handleRouteChange,
  joinArray,
  processRow,
  shouldPersistedFieldBeIncluded,
} from '../../../src/utils/functions';

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
    const context = {
      filteredData: [{ id: 1, firstName: 'david' }],
    };
    expect(getColumnsShown.bind(context)()).toEqual({
      id: true,
      firstName: true,
    });
  });
});

describe('getPaginationNumber', () => {
  const TEST_MAX_PAGINATION_NUMBER = 7;

  it('should return an array of size pagination count if pagination count is less than or equal to max pagination', () => {
    const context = {
      paginationCount: 6,
    };
    const result = getPaginationNumber.bind(context)(TEST_MAX_PAGINATION_NUMBER);
    expect(result).toEqual([1, 2, 3, 4, 5, 6]);
  });

  it('should not show left dots if active pagination is 1 and pagination count is 100', () => {
    const context = {
      paginationCount: 100,
      activePagination: 1,
    };
    const result = getPaginationNumber.bind(context)(TEST_MAX_PAGINATION_NUMBER);
    expect(result).toEqual([1, 2, 3, 4, 5, 6, '...', 100]);
  });

  it('should show left dots if active pagination is 99 and pagination count is 100', () => {
    const context = {
      paginationCount: 100,
      activePagination: 99,
    };
    const result = getPaginationNumber.bind(context)(TEST_MAX_PAGINATION_NUMBER);
    expect(result).toEqual([1, '...', 95, 96, 97, 98, 99, 100]);
  });

  it('should show left and right dots if active pagination is 50 and pagination count is 100', () => {
    const context = {
      paginationCount: 100,
      activePagination: 50,
    };
    const result = getPaginationNumber.bind(context)(TEST_MAX_PAGINATION_NUMBER);
    expect(result).toEqual([1, '...', 48, 49, 50, 51, 52, '...', 100]);
  });
});

describe('getCurrentSort', () => {
  it('should return current sort of query params', () => {
    const sort = [
      { key: 'firstName', order: 'asc' },
      { key: 'lastName', order: 'desc' },
    ];
    const context = {
      $route: {
        query: { sort: encodeURIComponent(JSON.stringify(sort)) },
      },
      columnKey: 'lastName',
    };
    const result = getCurrentSort.bind(context)();
    expect(result).toEqual([{ key: 'firstName', order: 'asc' }]);
  });

  it('should return an empty array if parsing query params fails', () => {
    const context = {
      $route: {
        query: { sort: '' },
      },
    };
    const result = getCurrentSort.bind(context)();
    expect(result).toEqual([]);
  });
});

describe('handleRouteChange', () => {
  let context;
  let testLimit = 10;
  let spyOnGetData;
  let spyOnUpdateData;

  beforeEach(() => {
    context = {
      model: {
        getData: jest.fn(),
      },
      updateData: jest.fn(),
    };
    spyOnGetData = jest.spyOn(context.model, 'getData');
    spyOnUpdateData = jest.spyOn(context, 'updateData');
  });

  it('should call getData with the correct arguments if offset changed', () => {
    const newRoute = {
      query: {
        offset: '2',
      },
    };
    const oldRoute = {
      query: {
        offset: '1',
      },
    };
    handleRouteChange.bind(context)(newRoute, oldRoute, testLimit);
    expect(spyOnGetData).toHaveBeenCalledTimes(1);
    expect(spyOnUpdateData).toHaveBeenCalledTimes(1);
    expect(spyOnGetData).toHaveBeenCalledWith({
      ...newRoute.query,
      offset: 10,
    });
  });

  it('should call getData with the correct arguments if search changed', () => {
    const newRoute = {
      query: {
        search: 'test1',
      },
    };
    const oldRoute = {
      query: {
        search: 'test2',
      },
    };
    handleRouteChange.bind(context)(newRoute, oldRoute, testLimit);
    expect(spyOnGetData).toHaveBeenCalledTimes(1);
    expect(spyOnUpdateData).toHaveBeenCalledTimes(1);
    expect(spyOnGetData).toHaveBeenCalledWith({
      ...newRoute.query,
      offset: 0,
    });
  });

  it('should not do anything if query params do not change', () => {
    const newRoute = {
      query: {
        search: 'test1',
      },
    };
    const oldRoute = {
      query: {
        search: 'test1',
      },
    };
    handleRouteChange.bind(context)(newRoute, oldRoute, testLimit);
    expect(spyOnGetData).not.toHaveBeenCalled();
    expect(spyOnUpdateData).not.toHaveBeenCalled();
  });

  it('should call getData with the correct arguments if columns changed', () => {
    const newRoute = {
      query: {
        columns: encodeURIComponent(JSON.stringify(['id'])),
      },
    };
    const oldRoute = {
      query: {
        columns: encodeURIComponent(JSON.stringify(['id', 'firstName'])),
      },
    };
    handleRouteChange.bind(context)(newRoute, oldRoute, testLimit);
    expect(spyOnGetData).toHaveBeenCalledTimes(1);
    expect(spyOnUpdateData).toHaveBeenCalledTimes(1);
    expect(spyOnGetData).toHaveBeenCalledWith({
      ...newRoute.query,
      offset: 0,
    });
  });

  it('should call getData with the correct arguments if unique values changed', () => {
    const newRoute = {
      query: {
        uniqueValues: encodeURIComponent(JSON.stringify({ key: 'id', values: ['test1'] })),
      },
    };
    const oldRoute = {
      query: {
        uniqueValues: encodeURIComponent(JSON.stringify({ key: 'id', values: ['test2'] })),
      },
    };
    handleRouteChange.bind(context)(newRoute, oldRoute, testLimit);
    expect(spyOnGetData).toHaveBeenCalledTimes(1);
    expect(spyOnUpdateData).toHaveBeenCalledTimes(1);
    expect(spyOnGetData).toHaveBeenCalledWith({
      ...newRoute.query,
      offset: 0,
    });
  });

  it('should call getData with the correct arguments if sort changed', () => {
    const newRoute = {
      query: {
        sort: encodeURIComponent(JSON.stringify([{ key: 'id', order: 'asc' }])),
      },
    };
    const oldRoute = {
      query: {
        sort: encodeURIComponent(
          JSON.stringify([
            { key: 'id', order: 'asc' },
            { key: 'firstName', order: 'desc' },
          ])
        ),
      },
    };
    handleRouteChange.bind(context)(newRoute, oldRoute, testLimit);
    expect(spyOnGetData).toHaveBeenCalledTimes(1);
    expect(spyOnUpdateData).toHaveBeenCalledTimes(1);
    expect(spyOnGetData).toHaveBeenCalledWith({
      ...newRoute.query,
      offset: 0,
    });
  });
});

describe('processRow', () => {
  let context = {
    columnsTypes: {
      id: Number,
      analysts: Array,
      createdAt: Date,
      name: String,
    },
  };

  it('should return "(blank)" if data is falsy', () => {
    expect(processRow.bind(context)(null, null)).toEqual('(blank)');
  });

  it('should return a string joined by commas if data is an array', () => {
    const result = processRow.bind(context)('analysts', ['andres', 'david']);
    expect(result).toEqual('andres, david');
  });

  it('should return "(blank)" if data is an empty array', () => {
    const result = processRow.bind(context)('analysts', []);
    expect(result).toEqual('(blank)');
  });

  it('should return a locale date string if data is a date', () => {
    const date = '2020-04-29T17:23:00';
    const result = processRow.bind(context)('createdAt', date);
    expect(result).toEqual(new Date(Date.parse(date)).toLocaleString());
  });

  it('should return a number converted to string if data is a number', () => {
    const result = processRow.bind(context)('id', 1);
    expect(result).toEqual('1');
  });

  it('should return data as is if it is a string', () => {
    const result = processRow.bind(context)('name', 'david');
    expect(result).toEqual('david');
  });

  it('should set ellipsis if string is too long', () => {
    const result = processRow.bind(context)('name', 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa', true);
    expect(result).toEqual('aaaaaaaaaaaaaaaaaaaa...');
  });
});

describe('getColumnsFromQueryParams', () => {
  it('should get the columns from the query params', () => {
    const columns = ['id', 'firstName'];
    const context = {
      $route: { query: { columns: encodeURIComponent(JSON.stringify(columns)) } },
    };
    const result = getColumnsFromQueryParams.bind(context)();
    expect(result).toEqual(columns);
  });

  it('should return an empty array if parsing the query params failed', () => {
    const result = getColumnsFromQueryParams.bind({})();
    expect(result).toEqual([]);
  });
});

describe('shouldPersistedFieldBeIncluded', () => {
  describe('when the column key is not in the persisted fields', () => {
    it('should check if the column key is in the columns shown', () => {
      const context = {
        persistedFields: {},
        columnsShown: {
          id: true,
          name: false,
        },
      };
      expect(shouldPersistedFieldBeIncluded.bind(context)('id')).toBe(true);
      expect(shouldPersistedFieldBeIncluded.bind(context)('name')).toBe(false);
    });
  });

  describe('when the column key is in the persisted fields', () => {
    it('should check if the column key is in the columns shown if the columns from query params is an empty array', () => {
      const context = {
        persistedFields: {
          id: true,
          name: true,
        },
        columnsShown: {
          id: true,
          name: false,
        },
      };
      expect(shouldPersistedFieldBeIncluded.bind(context)('id', [])).toBe(true);
      expect(shouldPersistedFieldBeIncluded.bind(context)('name', [])).toBe(false);
    });

    it('should check if the column key is in the columns from query params', () => {
      const context = {
        persistedFields: {
          id: true,
          name: true,
        },
      };
      expect(shouldPersistedFieldBeIncluded.bind(context)('id', ['id'])).toBe(true);
      expect(shouldPersistedFieldBeIncluded.bind(context)('name', ['id'])).toBe(false);
    });
  });
});
