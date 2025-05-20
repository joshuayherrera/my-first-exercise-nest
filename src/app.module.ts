import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TasksModule } from './tasks/tasks.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get<string>('DB_HOST', 'localhost'), 
        port: configService.get<number>('DB_PORT', 3306),      
        username: configService.get<string>('DB_USERNAME'),    
        password: configService.get<string>('DB_PASSWORD'),    
        database: configService.get<string>('DB_NAME'),        
        autoLoadEntities: true,
        synchronize: configService.get<boolean>('DB_SYNCHRONIZE', true),
      })

    }),
    TasksModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
