/**
 * Changes the protocol of a valid url to/from https
 * @param {String} url The url to check for protocol
 * @param {Boolean} bool The choice whether to change url protocol to page protocol
 * @return {Boolean} as false if it failed
 * @return {String} returns a string if it was successfull
 */
let toHttps = (url, bool) => {
    let finalUrl = '';
    if(url.constructor !== String || !Boolean(/^(http)/i.test(url)) || bool.constructor !== Boolean ){
        return false;
    }
    const httpsReg = /^(https)/i;
    const httpReg = /^(http)/i;
    switch(bool){
        case true:
            finalUrl = url.replace(httpReg, 'https');
        break;
        case false:
            finalUrl = httpsReg.test(httpsReg, 'http');
        break;
        default:
            finalUrl = fasle;
    }

    return finalUrl;
}

export default toHttps;