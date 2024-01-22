// eslint-disable-next-line @typescript-eslint/no-explicit-any
const normalize = (source: undefined|any[], fieldName = "id") => {
  if (!Array.isArray(source)) {
    return {};
  }

  return source.reduce((acc, item) => {
    const key = item[fieldName];
    acc[key] = item;
    return acc;
  }, {});
};

export { normalize };
