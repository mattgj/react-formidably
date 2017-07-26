function getValueForKey(data, templateKey) {
  const keySplit = templateKey.split('.');
  let current = data;
  try {
    keySplit.forEach(key => (current = current[key]));
  } catch (ex) {
    return undefined;
  }

  return current;
}

function setValueForKey(data, templateKey, value, arrayIndex = null) {
  const keySplit = templateKey.split('.');
  // Get the last key which will hold the value
  const lastKey = keySplit.splice(keySplit.length - 1);
  let current = data;

  // Get the last object which holds the lastKey property
  keySplit.forEach((key) => {
    if (!Object.prototype.hasOwnProperty.call(current, key)) {
      current[key] = {};
    }

    current = current[key];
  });

  if (arrayIndex !== null) {
    current[lastKey][arrayIndex] = value;
  } else {
    current[lastKey] = value;
  }
}

export { getValueForKey, setValueForKey };
