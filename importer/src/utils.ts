import { FieldTypes, type Codec } from "./types";

/**
 * Contain transformers for all field types.
 * Throw critical error if value have invalid type.
 */
export const FieldTransformers: Record<
  FieldTypes,
  (str: string) => string | number | Date | { amount: number; currency: string }
> = {
  [FieldTypes.string]: (str) => str.trim(),
  [FieldTypes.number]: (str) => {
    const numb = Number(str);
    if (isNaN(numb)) {
      throw new Error("Invalid number");
    }
    return numb;
  },
  [FieldTypes.date]: (str) => {
    const date = new Date(str);
    if (!isFinite(Number(date)) && isNaN(Number(date))) {
      throw new Error("Invalid date");
    }
    return date;
  },
  [FieldTypes.numberWithCurrency]: (str) => {
    const [amount, currency] = str.split(" ");
    const result = {
      amount: Number(amount),
      currency: currency.trim(),
    };
    if (isNaN(result.amount)) {
      throw new Error("Invalid amount");
    }
    if (!result.currency.length) {
      throw new Error("Invalid currency");
    }
    return result;
  },
};

/**
 * Parse field string to separated key value.
 * Throw critical error if key or value is absent or empty strings.
 * @param field: string in form 'key: value'
 * @returns [key: string, value: string]
 */
export const parseField = (field: string): [string, string] => {
  const fieldDelimiter = ": ";
  const [k, v] = field.trim().split(fieldDelimiter);
  if (!k?.trim().length) {
    throw new Error(`Can't parse field. Empty key is not allowed.`);
  }
  if (!v?.trim().length) {
    throw new Error(`Can't parse field. Empty value is not allowed.`);
  }
  return [k.trim(), v.trim()];
};

/**
 * Parse array of fields to object with transformed values by Codec.
 * Throw critical error if transformer not found for field key.
 * @param fields Array of fields
 * @param codec Codec
 * @returns parsed object
 */
export const transformFieldsToObject = (fields: Array<[string, string]>, codec: Codec): object => {
  return fields.reduce((acc, [k, v]) => {
    const transformer = FieldTransformers[codec[k]];
    if (!transformer) {
      throw new Error("Invalid field!");
    }
    return { ...acc, [k]: transformer(v) };
  }, {});
};

/**
 * Filter predicate to remove empty strings.
 * @param str string to filter
 * @returns boolean mean if string is not empty
 */
export const filterEmptyString = (str: string): boolean => str.trim().length > 0;
