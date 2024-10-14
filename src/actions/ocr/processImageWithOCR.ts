import { pricetrackerApi } from "../../config/api/pricetrackerApi";
import { Ocr } from "../../domain/entities/ocr";
import { PriceTrackerOcrResponse } from "../../infrastructure/interfaces/pricetracker-products.response";

export const processImageWithOCR = async (image: string, comcityId: string): Promise<Ocr> => {
    try {
        const formData = new FormData();

        formData.append('file', {
            uri: image,
            type: 'image/jpeg',
            name: image.split('/').pop(),
        } as any);

        formData.append('comcity', comcityId);

        const { data } = await pricetrackerApi.post<PriceTrackerOcrResponse>(
            `/files/uploadOcrImage`,
            formData,
            {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            }
        );

        return data;
    } catch (error) {
        console.error(error);
        throw new Error(`Error al aplicar OCR en la factura`);
    }
};