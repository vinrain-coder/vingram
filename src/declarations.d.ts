declare module "@node-rs/argon2" {
  export function hash(data: string, options?: any): Promise<string>;
  export function verify(
    hashed: string,
    data: string,
    options?: any
  ): Promise<boolean>;
}
