const capitalize = (string) => {
  return string.charAt(0).toUpperCase() + string.slice(1)
}

const isEmptyString = (string) => {
  return string === undefined || string === null || string === ''
}

export {
  capitalize, isEmptyString
}