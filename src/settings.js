// base
let uric_api_url = 'http://api.uric.cn:8000'   // uric_api 地址
let weather_api_url = 'https://devapi.qweather.com/v7'  // 天气api
let geoapi_url = 'https://geoapi.qweather.com/v2'       // 城市api
// auth
let login_url = uric_api_url + '/users/login/'  // 登录
// table
let table_testuser_api = uric_api_url + '/api/testuser/'
let table_instance_api = uric_api_url + '/api/instance/'
let table_instance_api_update_all_instance = table_instance_api + 'update_all/?size=3'
let table_deploy_api = uric_api_url + '/api/deploy/'
let table_deploy_api_post_remote_setssh = table_deploy_api + 'post_remote_setssh/'
let table_deploy_api_post_run_pb = table_deploy_api + 'post_run_pb/'
let deploy_modules_get_api = table_deploy_api + 'get_modules/'
let deploy_modules_post_api = table_deploy_api + 'post_modules/'
let table_deploy_group_api = uric_api_url + '/api/deploy-group/'
let table_deploy_group_detail_api = table_deploy_group_api + 'get_detail/'
let table_deploy_playbook_api = uric_api_url + '/api/deploy-playbook/'

export default {
    // base
    uric_api_url: uric_api_url,
    weather_api_url: weather_api_url,
    geoapi_url: geoapi_url,
    // auth
    login_url: login_url,
    // table
    table_testuser_api: table_testuser_api,
    table_instance_api: table_instance_api,
    table_instance_api_update_all_instance: table_instance_api_update_all_instance,
    table_deploy_api: table_deploy_api,
    table_deploy_api_post_remote_setssh: table_deploy_api_post_remote_setssh,
    table_deploy_api_post_run_pb: table_deploy_api_post_run_pb,
    deploy_modules_get_api: deploy_modules_get_api,
    deploy_modules_post_api: deploy_modules_post_api,
    table_deploy_group_api: table_deploy_group_api,
    table_deploy_group_detail_api: table_deploy_group_detail_api,
    table_deploy_playbook_api: table_deploy_playbook_api,
}
