export interface AhoraloProduct {
    id:          string;
    title:       string;
    slug:        string;
    tags:        string[];
    images:      string[];
    user:        AhoraloUser;
}

export interface AhoraloUser {
    id:       string;
    email:    string;
    fullName: string;
    isActive: boolean;
    roles:    string[];
}

export interface AhoraloCity {
  id: string;
  name: string;
  nameDep: string;
}

export interface AhoraloCompany {
  id: string;
  name: string;
}

export interface AhoraloComcity {
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

export interface AhoraloProdcomcity {
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

export interface AhoraloOcrResponse {
  company: string;
  products: {
      code: number;
      price: number;
  }[];
  text: string;
}

export interface LowestPriceByTag {
  companyId: string;
  companyName: string;
  productId: string;
  productTitle: string;
  lowestPrice: number;
}