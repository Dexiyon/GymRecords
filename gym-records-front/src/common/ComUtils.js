const capitalize = (p_string) => {
  return p_string.charAt(0).toUpperCase() + p_string.slice(1)
}

const formatDate = (p_date, p_format) => {
  if (p_format === 'fullDateWithWeekday') {
    return new Date(p_date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  }
  return p_date;
}

const isEmptyArray = (p_array) => {
  return p_array === undefined || p_array.length === 0;
}

const isEmptyObject = (p_object) => {
  return p_object === undefined || p_object === null || Object.keys(p_object).length === 0
}

const isEmptyString = (p_string) => {
  return p_string === undefined || p_string === null || p_string === ''
}

export {
  capitalize, formatDate, isEmptyArray, isEmptyObject, isEmptyString
}