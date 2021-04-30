import {
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { LoginDto } from '../api/dto/login.dto';
import { Usuario } from '@modulos/usuario/entidates/usuario.entity';
import { ProveedorBcrypt } from '@modulos/usuario/proveedores/brcypt';
import { Variables } from '@utils/manejo-variables/variables';
import { IAuthCasoUso } from '../login-caso-uso/IAuthCasoUso';
import { Login } from './models/login';
import { plainToClass } from 'class-transformer';
import { LeerUsuarioDto } from '@modulos/auth/api/dto/leer-usuario.dto';
import { UsuarioModel } from './models/usuario';

const UserRepo = () => Inject('AuthRepo');

@Injectable()
export class LoginCasoUso {
  constructor(
    @UserRepo() private readonly _authService: IAuthCasoUso,
  ) {}
  async login(loginDto: LoginDto): Promise<Login> {
    const usuarioLimpio: LoginDto = Variables.limpiarVariables(loginDto);
    const { Usuario, Contraseña } = usuarioLimpio;
    const usuario: Usuario = await this._authService.existeUsuario(Usuario);
    if (!usuario) {
      throw new NotFoundException(`El usuario: ${Usuario} no existe`);
    }


    const isMatch = await ProveedorBcrypt.compararContra(
      Contraseña,
      usuario.Contraseña,
    );
    if (!isMatch) {
      throw new UnauthorizedException('Contraseña Incorrecta!');
    }
    const token = await this._authService.crearToken(usuario);

    const usuarioModel = new UsuarioModel(usuario);
    const usuarioDto = plainToClass(LeerUsuarioDto, usuarioModel);
    return {
      Token: token,
      Usuario: usuarioDto,
    };
  }
}
