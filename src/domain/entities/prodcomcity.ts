


export interface Prodcomcity {
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
      images:      string[];
    };
    price: number;
    date: string;
  }