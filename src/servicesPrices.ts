import { ServiceType, ServiceYear } from "."

type ServicePrice = {
    service: ServiceType;
    year: ServiceYear;
    price: number;
}

const servicesPrices: ServicePrice[] = [
    { service: "Photography", year: 2020, price: 1700 },
    { service: "Photography", year: 2021, price: 1800 },
    { service: "Photography", year: 2022, price: 1900 },
    { service: "VideoRecording", year: 2020, price: 1700 },
    { service: "VideoRecording", year: 2021, price: 1800 },
    { service: "VideoRecording", year: 2022, price: 1900 },
    { service: "WeddingSession", year: 2020, price: 600 },
    { service: "WeddingSession", year: 2021, price: 600 },
    { service: "WeddingSession", year: 2022, price: 600 },
    { service: "BlurayPackage", year: 2020, price: 300 },
    { service: "BlurayPackage", year: 2021, price: 300 },
    { service: "BlurayPackage", year: 2022, price: 300 },
    { service: "TwoDayEvent", year: 2020, price: 400 },
    { service: "TwoDayEvent", year: 2021, price: 400 },
    { service: "TwoDayEvent", year: 2022, price: 400 },
] 

export const getServicePrice = (service: ServiceType, serviceYear: ServiceYear) => {
    const servicePrice = servicesPrices.filter(servicePrice => servicePrice.service === service && servicePrice.year === serviceYear)[0];
    return servicePrice.price;
}

export const getPhotographyAndVideoPackagePrice = (serviceYear: ServiceYear) => {
    switch (serviceYear) {
        case 2020: return 2200;
        case 2021: return 2300;
        case 2022: return 2500;
        default: throw new Error(`No price for photography + video recording package for year: ${serviceYear}`);
    }
}