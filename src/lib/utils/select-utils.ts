

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function isString(value: unknown): value is string {
  return typeof value === "string";
}

export default function fromServerToOptions(data: unknown[]) {
  try {
    return data.flatMap((item) => {
      if (!isRecord(item)) return [];
      const { id, name } = item;
      if (!isString(id) || !isString(name)) return [];
      return [{ label: name, value: id }];
    });
  } catch (error) {
    return [];
  }
}