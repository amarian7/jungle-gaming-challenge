declare module '@mikro-orm/core' {
  export class MikroORM {
    static init(options?: any): Promise<MikroORM>;
    getMigrator(): any;
    close(all?: boolean): Promise<void>;
  }

  export function Entity(options?: any): ClassDecorator;
  export function PrimaryKey(options?: any): PropertyDecorator;
  export function Property(options?: any): PropertyDecorator;
  export function Version(options?: any): PropertyDecorator;
  
  export class Type<T = any, U = any> {
    convertToDatabaseValue(value: T, platform: any): U;
    convertToJSValue(value: U, platform: any): T;
    getColumnType(prop: any, platform: any): string;
  }
  
  export interface Platform {}
}