export interface FlightLeg {
    sequence: number;
    flightId: string;
    fltNo: string;
    airlineCode: string;
    departureAirport: { code: string; time: string; terminal: { name: string } };
    arrivalAirport: { code: string; time: string; terminal: { name: string } };
    durationInMin: number;
}

export interface Fare {
    fareId: string;
    fareGroup: string;
    price: { CTC: string; pricePerAdult: string };
    refundable: boolean;
    checkInBaggageAllowed: boolean;
    fareIdentifiers: {
        cabinType: string;
        brandName: string;
        availableSeatCount: number;
        rbd: string;
    };
    benefits: { benefitType: string; value: string; description: string }[];
}

export interface FlightOption {
    flightId: string;
    sectorKey: string;
    from: string;
    to: string;
    departure: string;
    arrival: string;
    totalDuration: number;
    stops: number;
    airlines: string[];
    legs: FlightLeg[];
    fares: Fare[];
    lowestPrice: string;
}

export interface SearchResult {
    searchId: string;
    journeys: Record<string, FlightOption[]>;
}
