import { getModelForClass, prop } from "@typegoose/typegoose";

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

class Games {
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

export const GamesModel = getModelForClass(Games);
