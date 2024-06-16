import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ServeurDocument = Serveur & Document;
export type SalonDocument = Salon & Document;
export type MessageDocument = Message & Document;

@Schema()
export class Message {
  @Prop({ required: true })
  utilisateur: string;

  @Prop({ required: true })
  contenu: string;
}
@Schema()
export class Salon {
  @Prop({ required: true })
  nom: string;

  @Prop()
  public: boolean;

  @Prop()
  messages: Message[];
}
@Schema()
export class Serveur {
  @Prop({ required: true, minlength: 3, maxlength: 50 })
  nom: string;

  @Prop({ maxlength: 100 })
  description: string;

  @Prop()
  urlLogo: string;

  @Prop()
  public: boolean;

  @Prop()
  salons: Salon[];
}

export const ServeurSchema = SchemaFactory.createForClass(Serveur);
export const SalonSchema = SchemaFactory.createForClass(Salon);
export const MessageSchema = SchemaFactory.createForClass(Message);
