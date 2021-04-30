export interface IJwtPayload {
  UsuarioID: number;
  Usuario: string;
  Correo: string;
  Iat?: Date;
}
