import {Prodcomcity} from '../../domain/entities/prodcomcity';
import type {AhoraloProdcomcity} from '../interfaces/ahoralo-products.response';

export class ProdComcityMapper {
  static AhoraloProdcomcityToEntity(
    ahoraloProdcomcity: AhoraloProdcomcity,
  ): Prodcomcity {
    return {
      id: ahoraloProdcomcity.id,
      comcity: {
        id: ahoraloProdcomcity.comcity.id,
        city: {
          id: ahoraloProdcomcity.comcity.city.id,
          name: ahoraloProdcomcity.comcity.city.name,
          nameDep: ahoraloProdcomcity.comcity.city.nameDep,
        },
        company: {
          id: ahoraloProdcomcity.comcity.company.id,
          name: ahoraloProdcomcity.comcity.company.name,
        },
        user: ahoraloProdcomcity.comcity.user,
      },
      product: {
        id: ahoraloProdcomcity.product.id,
        title: ahoraloProdcomcity.product.title,
        slug: ahoraloProdcomcity.product.slug,
        tags: ahoraloProdcomcity.product.tags,
        code: ahoraloProdcomcity.product.code,
        images: ahoraloProdcomcity.product.images.map(image => `${image.url}`),
      },
      price: ahoraloProdcomcity.price,
      date: ahoraloProdcomcity.date,
    };
  }
}
