import { ServiceType } from "../types";

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

const removeFromArray = <T>(array: T[], item: T) => {
    const itemIndex = array.indexOf(item);

    if (itemIndex > -1) {
        array.splice(itemIndex, 1);
        return true;
    }

    return false;
}