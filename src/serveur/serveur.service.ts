// src/cats/cats.service.ts
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Message, Salon, Serveur, ServeurDocument } from './serveur.schema';
import {
  Utilisateur,
  UtilisateurDocument,
} from 'src/utilisateur/utilisateur.schema';

@Injectable()
export class ServeurService {
  constructor(
    @InjectModel(Serveur.name) private serveurModel: Model<ServeurDocument>,
    @InjectModel(Salon.name) private salonModel: Model<ServeurDocument>,
    @InjectModel(Utilisateur.name)
    private utilisateurModel: Model<UtilisateurDocument>,
  ) {}

  async create(createdServeurDto: any): Promise<Serveur> {
    const createdServeur = new this.serveurModel(createdServeurDto);
    return createdServeur.save();
  }

  async findAllPublic(): Promise<Serveur[]> {
    return this.serveurModel.find({ public: true });
  }

  async findAllServerOfUser(email: string): Promise<Serveur[]> {
    const utilisateur = await this.utilisateurModel.findOne({ email });

    const serveurs = await this.serveurModel.find({
      _id: { $in: utilisateur.serveurs },
    });

    return serveurs;
  }

  async findAllMessagesOfSalon(
    idServeur: any,
    nomSalon: any,
  ): Promise<Message[]> {
    const serveur = await this.serveurModel.findById(idServeur).exec();
    const salon = serveur.salons.find((salon) => salon.nom === nomSalon);

    return salon.messages;
  }

  async findAllSalonsOfServeur(id: any): Promise<Salon[]> {
    const serveur = await this.serveurModel.findOne({ id });

    // const salons = await this.serveurModel.find({
    //   salons: { $in: serveur.salons },
    // });

    return serveur.salons;
  }

  async ajoutSalon(id: any, nomSalon: any, isPublic: any): Promise<Serveur> {
    //on ajoute le serveur a la liste des serveurs de l'utilsiateur
    const serveur = await this.serveurModel.findOneAndUpdate(
      { _id: id },
      { $addToSet: { salons: { nom: nomSalon, public: isPublic } } }, // $addToSet évite les duplications
      { new: true }, // Retourner le document mis à jour
    );

    return serveur;
  }

  async ajoutMessage(
    idServeur: any,
    nomSalon: any,
    email: any,
    contenuMsg: any,
  ): Promise<Serveur> {
    const salonSelected = await this.serveurModel.findOneAndUpdate(
      {
        _id: idServeur,
        'salons.nom': nomSalon,
      },
      {
        $push: {
          'salons.$.messages': { utilisateur: email, contenu: contenuMsg },
        },
      },
      {
        new: true,
      },
    );

    return salonSelected;
  }
}
