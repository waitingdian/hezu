let url_config = ""

if(process.env.NODE_ENV === 'development'){
    // 开发环境
    url_config = 'http://47.105.221.99:8083'
}else{
    // 生产环境
    url_config = 'http://47.105.221.99:8083'
}

export default url_config