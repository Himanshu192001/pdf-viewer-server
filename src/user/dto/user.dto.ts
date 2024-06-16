export class CreateUserDto {
    readonly email: string;
    readonly name: string;
    readonly address: string;
    readonly mobile: string;
  }
  
  export class UpdateUserDto {
    readonly email?: string;
    readonly name?: string;
    readonly address?: string;
    readonly mobile?: string;
  }