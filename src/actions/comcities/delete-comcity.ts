import { ahoraloApi } from "../../config/api/ahoraloApi";

export const deleteComcity = async(id: string) =>{
    await ahoraloApi.delete(`/comcity/${id}`);
  }