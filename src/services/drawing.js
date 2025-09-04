import http from './http'

export async function saveDraw() {
    try {
        const res = await http.get(`/symbols`)
        if (res.status === 200) {
            return res.data.data
        } else {
            return []
        }
    } catch (error) {
        return []
    }
}

export async function updateDrawingDataV1(settings){
    // const token = localStorage.getItem('state')
    try{
        const {data} = await http.post('/users/update-drawing',settings)
        return data
    } catch(e) {
        // alert(e)
        // logout()
        return false
    }
}


export async function updateDrawingDataV2(settings){
    // const token = localStorage.getItem('state')
    try{
        const {data} = await http.post('/users/update-drawing-new',settings)
        return data
    } catch(e) {
        // alert(e)
        // logout()
        return false
    }
}

export const getDrawingDataV1 = async (symbol,userId) => {
    const token = localStorage.getItem('state')
    try{
        const {data} = await http.get(`/users/get-drawing?symbolName=${symbol}&userId=${userId}`)
        return data
    } catch(e) {
        // alert(e)
        // logout()
        return null
    }
}
export const deleteAllDrawingDataV1 = async (symbol,userId) => {
    const token = localStorage.getItem('state')
    try{


        const {data} = await http.post(`/users/delete-all-drawing?symbolName=${symbol}&userId=${userId}`)
        return data.drawing
    } catch(e) {
        // alert(e)
        // logout()
        return null
    }
}
export const deleteSingleDrawingDataV1 = async (symbol,userId,drawingRef) => {
    const token = localStorage.getItem('state')
    try{


        const {data} = await http.post(`/users/delete-drawing?symbolName=${symbol}&userId=${userId}&drawingRef=${drawingRef}`)
        return data.drawing
    } catch(e) {
        // alert(e)
        // logout()
        return null
    }
}
