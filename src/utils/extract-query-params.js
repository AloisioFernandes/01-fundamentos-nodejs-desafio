export function extractQueryParams(query) {
  return query
    .substring(1) // Remove the leading '?'
    .split("&") // Split by '&' to get each key-value pair
    .reduce((queryParams, param) => {
      const [key, value] = param.split("="); // Split each pair by '='
      queryParams[key] = value;
      return queryParams;
    }, {});
}
