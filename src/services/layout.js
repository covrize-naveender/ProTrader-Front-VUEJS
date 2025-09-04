import http from './http'


export async function saveLayout(userLayout) {
    try {
        const res = await http.post(`/users/saveLayout`,userLayout)
        if (res.status === 200) {
            return res.data
        } else {
            return []
        }
    } catch (error) {      
        return []
    }
}

export const getLayoutListData = async (userId) => {
    try{
        const {data} = await http.get(`/users/layouts/${userId}`)
        return data
    } catch(e) {
        return null
    }
}
export const deleteLayout = async (id) => {
    try{
        const {data} = await http.delete(`/users/layouts/${id}`)
        return data  
    } catch(e) {
        return null
    }
}
