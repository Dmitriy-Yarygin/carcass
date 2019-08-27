function getObjEnabledFields(obj, enabledFields) {
  const result = {};
  enabledFields.forEach(key => {
    if (obj[key]) {
      result[key] = obj[key];
    }
  });
  return result;
}

module.exports = { getObjEnabledFields };
