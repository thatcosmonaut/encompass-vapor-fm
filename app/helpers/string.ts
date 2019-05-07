export class StringHelper {
    public static nthOccurrence(string: string, m: string, i: number) {
        return string.split(m, i).join(m).length;
    }

    public static countOccurrences(string: string, value: string) {
        return (string.match(new RegExp(value, "gi")) || []).length;
    }
}
