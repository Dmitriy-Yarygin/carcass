function getObjEnabledFields(obj, enabledFields) {
  const result = {};
  enabledFields.forEach(key => {
    if (obj[key]) {
      result[key] = obj[key];
    }
  });
  return result;
}

function objectClone(original) {
  if (original === null) return null;
  if (typeof original !== 'object') return original;

  let copy;
  if (Array.isArray(original)) {
    copy = [];
    for (let i = 0; i < original.length; i++)
      copy.push(objectClone(original[i]));
    return copy;
  }
  copy = {};
  for (let key in original) copy[key] = objectClone(original[key]);
  return copy;
}

module.exports = { getObjEnabledFields, objectClone };
