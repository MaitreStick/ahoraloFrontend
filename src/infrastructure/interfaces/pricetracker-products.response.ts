export interface PricetrackerProduct {
    id:          string;
    title:       string;
    slug:        string;
    tags:        string[];
    images:      string[];
    user:        PricetrackerUser;
}

export interface PricetrackerUser {
    id:       string;
    email:    string;
    fullName: string;
    isActive: boolean;
    roles:    string[];
}

export interface PricetrackerCity {
  id: string;
  name: string;
  nameDep: string;
}

export interface PricetrackerCompany {
  id: string;
  name: string;
}

export interface PricetrackerComcity {
    id: string;
    city: {
      id: string;
      name: string;
      nameDep: string;
    };
    company: {
      id: string;
      name: string;
    };
}

export interface PricetrackerProdcomcity {
  id: string;
  comcity: {
    id: string;
    city: {
      id: string;
      name: string;
      nameDep: string;
    };
    company: {
      id: string;
      name: string;
    };
    user: string;
  };
  product: {
    id:          string;
    title:       string;
    slug:        string;
    tags:        string[];
    code:        number;
    images: {
      id: string;
      url: string;
    }[];
  };
  price: number;
  date: string;
}

export interface PriceTrackerOcrResponse {
  company: string;
  products: {
      code: number;
      price: number;
  }[];
  text: string;
}