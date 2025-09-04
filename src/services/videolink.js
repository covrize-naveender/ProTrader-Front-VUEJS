import http from './http'


export async function saveLink(link) {
    try {
        
        const res = await http.post(`/videoLink`,link)
        if (res.status === 200) {
            return res.data
        } else {
            return []
        }
    } catch (error) {      
        return []
    }
}

export const getVideoList = async (userId) => {
    try{
        const {data} = await http.get(`/videoLink`)
        return data
    } catch(e) {
        return null
    }
}
export const deleteLink = async (id) => {
   
    try{
        const {data} = await http.delete(`/videoLink/${id}`)
        return data  
    } catch(e) {
        return null
    }
}