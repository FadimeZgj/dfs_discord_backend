import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ServeurModule } from './serveur/serveur.module';
import { UtilisateurModule } from './utilisateur/utilisateur.module';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost/dfs_discord'),
    ServeurModule,
    UtilisateurModule,
    JwtModule.register({
      secret: 'azerty',
      global: true,
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
