import {Entity, model, property} from '@loopback/repository';

@model()
export class SliderImage extends Entity {
  @property({
    type: 'string',
    id: true,
    generated: true,
  })
  id?: string;

  @property({
    type: 'string',
    required: true,
  })
  path: string;


  constructor(data?: Partial<SliderImage>) {
    super(data);
  }
}

export interface SliderImageRelations {
  // describe navigational properties here
}

export type SliderImageWithRelations = SliderImage & SliderImageRelations;
