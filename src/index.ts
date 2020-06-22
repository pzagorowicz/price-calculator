import { removeFromArray } from "./helpers";
import { getServicePrice, getPhotographyAndVideoPackagePrice } from "./servicesPrices";

export type ServiceYear = 2020 | 2021 | 2022;
export type ServiceType = "Photography" | "VideoRecording" | "BlurayPackage" | "TwoDayEvent" | "WeddingSession";

const relatedToMainServicesMap = new Map<ServiceType, ServiceType[]>([
    ["BlurayPackage", ["VideoRecording"]],
    ["TwoDayEvent", ["Photography", "VideoRecording"]]
]);

export const updateSelectedServices = (
    previouslySelectedServices: ServiceType[],
    action: { type: "Select" | "Deselect"; service: ServiceType }
) => {
    
    switch (action.type) {
        case "Select":
            {
                const alreadySelected = previouslySelectedServices.some(value => value === action.service);
                if (alreadySelected) {
                    break;
                }

                const mainServices = relatedToMainServicesMap.get(action.service);
                if (mainServices && mainServices.length > 0) {
                    const atLeastOneMainServiceSelected = 
                        previouslySelectedServices.some(service => mainServices.some(mainService => mainService === service));
                        
                    if (!atLeastOneMainServiceSelected) {
                        break;
                    }
                }

                const services = [...previouslySelectedServices];            
                services.push(action.service);
                return services;
            }

        case "Deselect":
            {
                const index = previouslySelectedServices.indexOf(action.service);

                if (index > -1) {
                    let services = [...previouslySelectedServices];
                    services.splice(index, 1);

                    if (action.service === "VideoRecording") {
                        removeFromArray(services, "BlurayPackage");
                    }
                    
                    if (action.service === "Photography" || action.service === "VideoRecording") {
                        const anotherMainServiceExists = services.some(service => service === "Photography" || service === "VideoRecording");
                        if (!anotherMainServiceExists) {
                            removeFromArray(services, "TwoDayEvent");
                        }
                    }

                    return services;
                }
                
                break;                
            }
    }

    return previouslySelectedServices;
};

export const calculatePrice = (selectedServices: ServiceType[], selectedYear: ServiceYear) => {
    if (selectedServices.length === 0) {
        return { basePrice: 0, finalPrice: 0 };
    }

    let basePrice = 0, discount = 0;
    
    selectedServices.forEach(service => {
        const servicePrice = getServicePrice(service, selectedYear);
        basePrice += servicePrice;
    });

    const isSelected = (service: ServiceType) => selectedServices.some(value => value === service);

    // package of photography + video costs less: $2200 in 2020, $2300 in 2021 and $2500 in 2022
    // it is not a dicsount!
    if (isSelected("Photography") && isSelected("VideoRecording")) {
        const packagePrice = getPhotographyAndVideoPackagePrice(selectedYear);
        const photoPrice = getServicePrice("Photography", selectedYear);
        const videoPrice = getServicePrice("VideoRecording", selectedYear);
        basePrice -= photoPrice + videoPrice - packagePrice;
    }

    // wedding session costs regularly $600, but in a package with photography during
    // the wedding or with a video recording it costs $300
    if (isSelected("WeddingSession") && (isSelected("Photography") || isSelected("VideoRecording"))) {
        discount = 300;
    }

    // wedding session is free if the client chooses Photography during the wedding in 2022
    if (selectedYear === 2022) {
        if (isSelected("WeddingSession") && isSelected("Photography")) {
            discount = 600;
        }
    }

    const finalPrice = basePrice - discount;

    return { basePrice, finalPrice };
}
