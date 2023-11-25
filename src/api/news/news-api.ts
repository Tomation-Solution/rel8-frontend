import { NewsResponseType } from "../../types/myTypes";
import apiTenant from "../baseApi";

export const fetchAllUserNews = async ():Promise<NewsResponseType> =>{
    const response = await apiTenant.get(`/news/newsview/get_news/`);
    return response.data
}

