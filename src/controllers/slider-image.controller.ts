const fs = require('fs');
const path = require('path');
import {
  Count,
  CountSchema,
  Filter,
  FilterExcludingWhere,
  repository,
  Where
} from '@loopback/repository';
import {
  del, get,
  getModelSchemaRef, param,


  patch, post,




  put,

  requestBody,
  response
} from '@loopback/rest';
import {SliderImage} from '../models';
import {SliderImageRepository} from '../repositories';

export class SliderImageController {
  constructor(
    @repository(SliderImageRepository)
    public sliderImageRepository: SliderImageRepository,
  ) { }

  @post('/slider-images')
  @response(200, {
    description: 'SliderImage model instance',
    content: {'application/json': {schema: getModelSchemaRef(SliderImage)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(SliderImage, {
            title: 'NewSliderImage',
            exclude: ['id'],
          }),
        },
      },
    })
    sliderImage: Omit<SliderImage, 'id'>,
  ): Promise<SliderImage> {
    return this.sliderImageRepository.create(sliderImage);
  }

  @post('/slider-images/load')
  @response(200, {
    description: 'SliderImage model instance',
    content: {'application/json': {schema: getModelSchemaRef(SliderImage)}},
  })
  async loadJson(): Promise<void> {
    return new Promise(async (resolve, reject) => {
      const content = JSON.parse(fs.readFileSync(path.resolve('assets/JSON/slide.json'), {'encoding': 'utf-8'}));
      for (const imgPath of content[0].imagens) {
        const found = await this.sliderImageRepository.find({where: {path: imgPath}});
        if (!found.length) {
          this.sliderImageRepository.create({path: imgPath}).catch(err => reject(err));
        }
      }
      return resolve();
    })
  }

  @get('/slider-images/count')
  @response(200, {
    description: 'SliderImage model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(SliderImage) where?: Where<SliderImage>,
  ): Promise<Count> {
    return this.sliderImageRepository.count(where);
  }

  @get('/slider-images')
  @response(200, {
    description: 'Array of SliderImage model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(SliderImage, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(SliderImage) filter?: Filter<SliderImage>,
  ): Promise<string[]> {
    return new Promise(async (resolve, reject) => {
      const imgPaths = await this.sliderImageRepository.find(filter || {});
      const imgFiles = [];
      for (const imgPath of imgPaths) {
        imgFiles.push(fs.readFileSync(path.resolve(`assets/Imagens/Slide/${imgPath.path}`), {encoding: 'base64'}));
      }
      return resolve(imgFiles);
    })
  }

  @patch('/slider-images')
  @response(200, {
    description: 'SliderImage PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(SliderImage, {partial: true}),
        },
      },
    })
    sliderImage: SliderImage,
    @param.where(SliderImage) where?: Where<SliderImage>,
  ): Promise<Count> {
    return this.sliderImageRepository.updateAll(sliderImage, where);
  }

  @get('/slider-images/{id}')
  @response(200, {
    description: 'SliderImage model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(SliderImage, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.string('id') id: string,
    @param.filter(SliderImage, {exclude: 'where'}) filter?: FilterExcludingWhere<SliderImage>
  ): Promise<SliderImage> {
    return this.sliderImageRepository.findById(id, filter);
  }

  @patch('/slider-images/{id}')
  @response(204, {
    description: 'SliderImage PATCH success',
  })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(SliderImage, {partial: true}),
        },
      },
    })
    sliderImage: SliderImage,
  ): Promise<void> {
    await this.sliderImageRepository.updateById(id, sliderImage);
  }

  @put('/slider-images/{id}')
  @response(204, {
    description: 'SliderImage PUT success',
  })
  async replaceById(
    @param.path.string('id') id: string,
    @requestBody() sliderImage: SliderImage,
  ): Promise<void> {
    await this.sliderImageRepository.replaceById(id, sliderImage);
  }

  @del('/slider-images/{id}')
  @response(204, {
    description: 'SliderImage DELETE success',
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.sliderImageRepository.deleteById(id);
  }
}
