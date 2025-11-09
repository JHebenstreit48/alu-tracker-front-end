export type Brand = {
    slug: string;
    brand: string;
    description: string;
    logo: string;
    country: string[];
    established: number;
    headquarters?: string;
    primaryMarket?: string;
    location: {
      lat: number;
      lng: number;
    };
    resources?: {
      text: string;
      url: string;
    }[];
  };  