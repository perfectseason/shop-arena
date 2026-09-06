type ClassValue =
  | string
  | number
  | boolean
  | null
  | undefined
  | ClassValue[]
  | { [key: string]: unknown };

export function cn(...inputs: ClassValue[]) {
  return inputs.reduce<string[]>((classes, input) => {
    if (!input) {
      return classes;
    }

    if (typeof input === "string" || typeof input === "number") {
      classes.push(String(input));
      return classes;
    }

    if (Array.isArray(input)) {
      input.forEach((item) => {
        if (item) {
          classes.push(String(item));
        }
      });
      return classes;
    }

    if (typeof input === "object") {
      Object.entries(input).forEach(([key, value]) => {
        if (value) {
          classes.push(key);
        }
      });
    }

    return classes;
  }, []).join(" ");
}
