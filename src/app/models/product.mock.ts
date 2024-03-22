import { Product } from './product.model';
import { faker } from '@faker-js/faker';

export const generateOneProduct = (): Product => {
  return {
    id: faker.string.uuid(),
    title: faker.commerce.productName(),
    price: +faker.commerce.price(),
    description: faker.commerce.productDescription(),
    category: {
      id: faker.number.int(),
      name: faker.commerce.department(),
    },
    images: [faker.image.dataUri(), faker.image.dataUri()],
  };
};

export const generateManyProducts = (size: number = 10): Product[] => {
  const products: Product[] = [];
  for (let index = 0; index < size; index++) {
    products.push(generateOneProduct());
  }
  return [...products];
};
