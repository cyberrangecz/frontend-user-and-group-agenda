export class StringNormalizer {
  static normalizeDiacritics(str: string): string {
    const result = str.normalize('NFD').replace(/[\u0300-\u036f]/g, ''); // split to declaration and return because of packagr issue
    return result;
  }
}
