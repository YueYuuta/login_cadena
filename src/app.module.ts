import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { Configuration } from './config/config.keys';
import { ConfigService } from './config/config.service';
import { DatabaseModule } from './database/database.module';
import { UsuarioModule } from './modulos/usuario/usuario.module';
import { ConfigModule } from '@src/config/config.module';
import { SharedModule } from './modulos/shared/shared.module';
import { AuthModule } from './modulos/auth/auth.module';

const fileup = require('express-fileupload');

@Module({
  imports: [
    DatabaseModule,
    UsuarioModule,
    ConfigModule,
    SharedModule,
    AuthModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {
  static port: number | string;
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(fileup())
      // .forRoutes({ path: 'usuario/avatar/:userId', method: RequestMethod.PUT });
      .forRoutes(
        { path: 'usuario/crear', method: RequestMethod.POST },
        // { path: 'usuario/avatar/:userId', method: RequestMethod.PATCH },
        { path: 'usuario/editar/:id', method: RequestMethod.PATCH },
        // { path: 'producto/:id', method: RequestMethod.PATCH },
        // { path: 'producto', method: RequestMethod.POST },
        // { path: 'producto/guardar/imagen/:id', method: RequestMethod.PUT },
      );
  }

  constructor(private readonly _configService: ConfigService) {
    AppModule.port = this._configService.get(Configuration.PORT_SERVER);
  }
}
