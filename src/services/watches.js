import http from './http'
//import WatchesLoader from '../components/'

//const showloader = false

export  const showloaderjs = "booleannnn"


export async function saveWatches(watches) {
    try {
        const res = await http.post(`/users/watchlist`,watches)
        if (res.status === 200) {
            return res.data.isError ?  false : res.data
        } else {
            return []
        }
    } catch (error) {      
        return []
    }
}

export const getWatchListData = async (userId) => {
    const token = localStorage.getItem('state')
    try{
        const {data} = await http.get(`/users/watchlist/${userId}`)
        return data
    } catch(e) {
        // alert(e)
        // logout()
        return null
    }
}
export const deleteWatchList = async (id) => {
   
    const token = localStorage.getItem('state')
    try{
        const {data} = await http.delete(`/users/watchlist/${id}`)
        return data  
    } catch(e) {
        // alert(e)
        // logout()
        return null
    }
}