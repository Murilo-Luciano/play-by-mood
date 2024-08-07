import { getModelForClass, index, mongoose, prop } from "@typegoose/typegoose";

class Tag {
  @prop({ required: true }) public id!: number;
  @prop({ required: true }) name!: string;
}

class Genre {
  @prop({ required: true }) public id!: number;
  @prop({ required: true }) name!: string;
}

class Platform {
  @prop({ required: true }) public id!: number;
  @prop({ required: true }) name!: string;
}

class Screenshot {
  @prop({ required: true }) public id!: number;
  @prop({ required: true }) public imageUrl!: string;
  @prop({ required: true }) public width!: number;
  @prop({ required: true }) public height!: number;
}

@index({ id: 1 })
export class Games {
  @prop({ required: true }) public id!: number;
  @prop({ required: true }) public name!: string;
  @prop({ required: true }) public description!: string;
  @prop({ required: true }) public metacriticRating!: number;
  @prop({ required: true }) public imageUrl!: string;
  @prop({ required: true }) public releasedDate!: string;
  @prop({ required: true }) public redditUrl!: string;
  @prop({ required: true }) public tags!: Tag[];
  @prop({ required: true }) public genres!: Genre[];
  @prop({ required: true }) public platforms!: Platform[];
  @prop() public screenshots?: Screenshot[];
}

const GamesModel =
  mongoose.models.Games ||
  getModelForClass(Games, { options: { customName: "games" } });

export default GamesModel;
