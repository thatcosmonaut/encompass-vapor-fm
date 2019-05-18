export class MathHelper {
    public static getRandomArbitrary(min: number, max: number): number {
        return Math.random() * (max - min) + min;
      }
}
