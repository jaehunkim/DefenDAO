export const stringifyNestedObject = (obj: object): string => {
  return (
    "[" +
    Object.values(obj)
      .map((x) => {
        if (Array.isArray(x)) {
          return "[" + x.map((y) => stringifyNestedObject(y)).join(",") + "]";
        }
        if (typeof x === "object") {
          return stringifyNestedObject(x);
        }
        return `"${x}"`;
      })
      .join(",") +
    "]"
  );
};
