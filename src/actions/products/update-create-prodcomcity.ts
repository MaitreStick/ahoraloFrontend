import { isAxiosError } from "axios";
import { ahoraloApi } from "../../config/api/ahoraloApi";
import { Prodcomcity } from '../../domain/entities/prodcomcity';



export const updateCreateProdcomcity = (prodcomcity: Partial<Prodcomcity>) => {

    prodcomcity.price = isNaN(Number(prodcomcity.price)) ? 0 : Number(prodcomcity.price);
    if (prodcomcity.product) {
        prodcomcity.product.code = isNaN(Number(prodcomcity.product.code)) ? 0 : Number(prodcomcity.product.code);
    }

    if (prodcomcity.id && prodcomcity.comcity?.id !== 'new' && prodcomcity.product?.id !== 'new') {
        return updateProdcomcity(prodcomcity);
    }

    return createProdcomcity(prodcomcity);
}


const prepareImages = async (images: string[]) => {

    const fileImages = images.filter(image => image.includes('file://'));
    const currentImages = images.filter(image => !image.includes('file://'));

    if (fileImages.length > 0) {
        const uploadPromises = fileImages.map(uploadImage);
        const uploadedImages = await Promise.all(uploadPromises);
        currentImages.push(...uploadedImages);
    }


    return currentImages

}

const uploadImage = async (image: string) => {
    const formData = new FormData();
    formData.append('file', {
        uri: image,
        type: 'image/jpeg',
        name: image.split('/').pop()
    });

    const { data } = await ahoraloApi.post<string>('/files/upload', formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    });
    return data;
}


const updateProdcomcity = async (prodcomcity: Partial<Prodcomcity>) => {



    const { id, product, ...rest } = prodcomcity;
    const images = product?.images || [];
    console.log(images)

    try {
        const checkedImages = await prepareImages(images);
        const { data } = await ahoraloApi.patch(`/prodcomcity/${id}`, {
            comcity: rest.comcity?.id,
            product: {
                id: product?.id,
                title: product?.title,
                code: product?.code,
                images: checkedImages,
            },
            date: new Date().toISOString(),
            price: rest.price,
        });
        return data.prodcomcity;


    } catch (error) {
        if (isAxiosError(error)) {
            console.log(error.response?.data);
        }
        throw new Error('Error al actualizar el producto');
    }

}


const createProdcomcity = async (prodcomcity: Partial<Prodcomcity>) => {
    const { id, product, ...rest } = prodcomcity;

    const images = product?.images || [];
    console.log(images)


    try {

        const checkedImages = await prepareImages(images);
        console.log({ checkedImages })

        const { data } = await ahoraloApi.post('/prodcomcity', {
            comcity: {
                city: {
                    name: rest.comcity?.city.name,
                    nameDep: rest.comcity?.city.nameDep,
                },
                company: {
                    name: rest.comcity?.company.name
                },
            },
            product: {
                title: product?.title,
                code: product?.code,
                images: checkedImages,
            },
            date: new Date().toISOString(),
            price: rest.price,
        });

        return data;


    } catch (error) {
        if (isAxiosError(error)) {
            console.log(error.response?.data);
        }
        throw new Error('Error al crear el producto');
    }
}