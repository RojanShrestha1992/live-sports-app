import axios from "axios";

const API = axios.create({
    baseURL : "https://streamed.pk"
})

export const getCategories = () =>{
    return API.get("/api/sports");
}
export const getStreamsById = (id) =>{
    return API.get(`/api/matches/${id}`);
}
export const getPopularMatches = () => {
    // return API.get("/api/matches/all/popular")
    return API.get("/api/matches/all-today/popular")

}

export const getLiveStreamBySource = (source,id)=>{
    return API.get(`/api/stream/${source}/${id}`);
}

export default API;