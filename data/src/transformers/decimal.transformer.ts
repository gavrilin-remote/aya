import { type ValueTransformer } from "typeorm";

export class DecimalTransformer implements ValueTransformer {
  from(value: string): number | undefined {
    if (value === undefined || value === null) return undefined;
    return parseFloat(value);
  }

  to(value: number): string | null {
    if (value === undefined || value === null) return null;
    return value.toString();
  }
}
