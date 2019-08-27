export function optionsToGetParams(optionObj = {}) {
  let result = [];
  for (let key in optionObj) {
    if (optionObj[key]) {
      result.push(`${key}=${optionObj[key]}`);
    }
  }
  if (result.length) {
    return `?${result.join('&')}`;
  } else {
    return '';
  }
}

export const fetchAndCatch = (...theArgs) => {
  return fetch(...theArgs)
    .then(response => {
      if (response.status !== 200) {
        throw response.statusText;
      }
      return response.json();
    })
    .catch(e => {
      console.error(e);
      return false;
    });
};
