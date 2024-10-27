import { Mood } from "@/services/types";
import {
  ReturnModelType,
  getModelForClass,
  index,
  mongoose,
  prop,
} from "@typegoose/typegoose";

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
  @prop({ required: true }) public image!: string;
  @prop({ required: true }) public width!: number;
  @prop({ required: true }) public height!: number;
}

@index({ id: 1 })
export class Games {
  @prop({ required: true }) public id!: number;
  @prop({ required: true }) public name!: string;
  @prop({ required: true }) public description!: string;
  @prop({ required: true, enum: Mood, type: String }) public mood!: Mood;
  @prop({ required: true }) public rawgAddedCount!: number;
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
  (mongoose.models.games as ReturnModelType<typeof Games, {}>) ||
  getModelForClass(Games, {
    schemaOptions: { timestamps: true },
    options: { customName: "games" },
  });

export default GamesModel;
