export function setCookie(cname, cvalue, exdays){
    if (typeof document === "undefined") return ""; // Trả về rỗng trên Server

    var d = new Date()
    d.setTime(d.getTime() + 24*60*60*1000*exdays)
    var expires = "expires="+d.toUTCString()
    document.cookie = cname+"="+cvalue+"; "+expires+";path=/"
}   

export function deleteCookie(cname){
    if (typeof document === "undefined") return ""; // Trả về rỗng trên Server
    
    document.cookie = `${cname}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/`
}

export function getCookie(cname){
    if (typeof document === "undefined") return ""; // Trả về rỗng trên Server

    let name = cname+"="
    let ca = document.cookie.split(";")
    for(let i = 0; i < ca.length; i++){
        let c = ca[i].trim()            //Xóa khoảng trắng thừa
        if(c.indexOf(name) == 0){
            return c.substring(name.length, c.length)
        }
    }
    return ""
}