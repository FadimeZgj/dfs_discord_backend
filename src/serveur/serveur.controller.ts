import {
  Body,
  Controller,
  Get,
  Post,
  UseGuards,
  Request,
  Param,
} from '@nestjs/common';
import { ServeurService } from './serveur.service';
import { AuthGuard } from 'src/auth.guard';
import { Message } from './serveur.schema';

@Controller('serveur')
export class ServeurController {
  constructor(private readonly serveurService: ServeurService) {}

  @Get()
  @UseGuards(AuthGuard)
  findAll(@Request() requete) {
    console.log(requete.user.sub);

    return this.serveurService.findAllPublic();
  }

  @Get('/possede')
  @UseGuards(AuthGuard)
  findAllServerOfUser(@Request() requete) {
    return this.serveurService.findAllServerOfUser(requete.user.sub);
  }

  @Get('/serveur-salons/:id')
  @UseGuards(AuthGuard)
  findAllSalonsOfServeur(@Request() requete) {
    console.log(requete.id);
    return this.serveurService.findAllSalonsOfServeur(requete.id);
  }
  // async findAllSalonsOfServeur(@Param('id') id: string) {
  //   return this.serveurService.findAllSalonsOfServeur(id);
  // }

  @Get('/:idServeur/:nomSalon/messages')
  async getMessagesSalon(@Param() param): Promise<Message[]> {
    const idServeur = param.idServeur;
    const nomSalon = param.nomSalon;
    return this.serveurService.findAllMessagesOfSalon(idServeur, nomSalon);
  }

  @Post()
  async create(@Body() createServeurDto: any) {
    return this.serveurService.create(createServeurDto);
  }

  @Post('/ajout-salon')
  @UseGuards(AuthGuard)
  async ajouterSalon(@Body() salonAAjouterDto: any) {
    return this.serveurService.ajoutSalon(
      salonAAjouterDto.serveur,
      salonAAjouterDto.nom,
      salonAAjouterDto.public,
    );
  }

  @Post('/envoi-message/:idServeur/:nomSalon')
  @UseGuards(AuthGuard)
  async ajoutMessage(@Body() message: any, @Request() requete, @Param() param) {
    const email = requete.user.sub;
    const serveurId = param.idServeur;
    const nomSalon = param.nomSalon;
    return this.serveurService.ajoutMessage(
      serveurId,
      nomSalon,
      email,
      message.contenu,
    );
  }
}
