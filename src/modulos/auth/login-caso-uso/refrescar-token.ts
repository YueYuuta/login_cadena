import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { LeerUsuarioDto } from '../api/dto/leer-usuario.dto';
import { Usuario } from '@modulos/usuario/entidates/usuario.entity';
import { plainToClass } from 'class-transformer';
import { IAuthCasoUso } from './IAuthCasoUso';
import { UsuarioModel } from '@modulos/usuario/usuario-caso-uso/models/usuario';
import { Login } from './models/login';

const UserRepo = () => Inject('AuthRepo');

@Injectable()
export class TokenCasoUso {
  constructor(
    @UserRepo() private readonly _authService: IAuthCasoUso,
  ) {}
  async refrescar(UsuarioID: number): Promise<Login> {
    const usuario: Usuario = await this._authService.obtenerPorId(UsuarioID);


    const token = await this._authService.crearToken(usuario);
    const usuarioModel = new UsuarioModel(usuario);
    const usuarioDto = plainToClass(LeerUsuarioDto, usuarioModel);
    return {
      Token: token,
      Usuario: usuarioDto,
    };
  }
}
