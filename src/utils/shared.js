import { LIMIT } from './constants';

export function handleRouteChange(newRoute, oldRoute) {
  const offsetChanged = newRoute.query.offset !== oldRoute.query.offset;
  const searchChanged = newRoute.query.search !== oldRoute.query.search;
  const columnsChanged = newRoute.query.columns !== oldRoute.query.columns;
  const sortChanged = newRoute.query.sort !== oldRoute.query.sort;
  const uniqueValuesChanged = newRoute.query.uniqueValues !== oldRoute.query.uniqueValues;

  if (offsetChanged || columnsChanged || sortChanged || uniqueValuesChanged) {
    const offset = parseInt(newRoute.query.offset) || 1;
    const newData = this.model.getData({
      ...newRoute.query,
      offset: LIMIT * (offset - 1),
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
