// eslint-disable-next-line @typescript-eslint/no-explicit-any
const isForm = (data: any): data is FormData => {
  return data instanceof FormData;
}

export { isForm };
