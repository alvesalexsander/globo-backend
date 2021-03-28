import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {MongoDbDataSource} from '../datasources';
import {SliderImage, SliderImageRelations} from '../models';

export class SliderImageRepository extends DefaultCrudRepository<
  SliderImage,
  typeof SliderImage.prototype.id,
  SliderImageRelations
> {
  constructor(
    @inject('datasources.MongoDB') dataSource: MongoDbDataSource,
  ) {
    super(SliderImage, dataSource);
  }
}
