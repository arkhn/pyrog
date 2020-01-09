import { History, Location } from 'history';
import * as QueryString from 'query-string';

// This function updates the current url with new information.
// Before: url/pathname?attr1=value1
// After: url/pathname?attr1=value1&key=value
export const updateLocationParams = (
  history: History<any>,
  location: Location<any>,
  key: string,
  value: string
) => {
  const qs = QueryString.stringify({
    ...QueryString.parse(location.search),
    [key]: value
  });

  history.push({ search: qs });
};

export const deleteLocationParams = (
  history: History<any>,
  location: Location<any>,
  keys: string[]
) => {
  const qs = { ...QueryString.parse(location.search) };
  keys.forEach(key => delete qs[key]);

  history.push({ search: QueryString.stringify(qs) });
};
