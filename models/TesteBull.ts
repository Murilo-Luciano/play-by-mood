import {
  getModelForClass,
  index,
  modelOptions,
  mongoose,
  prop,
} from "@typegoose/typegoose";

@index({ id: 1 })
@modelOptions({ schemaOptions: { timestamps: true } })
export class Tests {
  @prop({ required: true }) public testando!: string;
}

const TestModel =
  mongoose.models.Tests ||
  getModelForClass(Tests, { options: { customName: "tests" } });

export default TestModel;
