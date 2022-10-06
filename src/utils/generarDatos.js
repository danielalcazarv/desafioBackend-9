import { faker } from '@faker-js/faker';

export function generarProducto() {
    return {
        codigo: faker.address.zipCode('####'),
        nombre: faker.commerce.product(),
        descripcion: faker.lorem.sentence(10),
        precio: faker.commerce.price(50, 9999, 0, '$'),
        url: faker.image.imageUrl()
    }
};