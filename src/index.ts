import { removeFromArray } from "./helpers";

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

export const calculatePrice = (selectedServices: ServiceType[], selectedYear: ServiceYear) => ({ basePrice: 0, finalPrice: 0 });
