const capitalize = (string) => {
  return string.charAt(0).toUpperCase() + string.slice(1)
}

const isEmptyArray = (array) => {
  return array === undefined || array.length === 0;
}

const isEmptyString = (string) => {
  return string === undefined || string === null || string === ''
}

export {
  capitalize, isEmptyArray, isEmptyString
}