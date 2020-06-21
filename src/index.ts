export type ServiceYear = 2020 | 2021 | 2022;
export type ServiceType = "Photography" | "VideoRecording" | "BlurayPackage" | "TwoDayEvent" | "WeddingSession";

export const updateSelectedServices = (
    previouslySelectedServices: ServiceType[],
    action: { type: "Select" | "Deselect"; service: ServiceType }
) => {
    
    switch (action.type) {
        case "Select":
            {
                if (previouslySelectedServices.some(value => value === action.service)) {
                    break;
                }

                if (action.service === "BlurayPackage" && !previouslySelectedServices.some(value => value === "VideoRecording")) {
                    break;
                }

                if (action.service === "TwoDayEvent" && !previouslySelectedServices.some(value => value === "Photography" || value === "VideoRecording")) {
                    break;
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

const removeFromArray = (services: ServiceType[], service: ServiceType) => {
    const index = services.indexOf(service);

    if (index > -1) {
        services.splice(index, 1);
        return true;
    }

    return false;
}