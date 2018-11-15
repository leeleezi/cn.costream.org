var body = document.querySelector('body')
var oldTime = new Date(parseInt(localStorage.getItem("checkCache")))
var time = Date.now() - oldTime
if (time < 20 * 60 * 1000) {
    // 20分钟内免密
    body.style.filter = "none"
    document.querySelector('#main .menu-root .check-hide').classList.remove('check-hide')
}
else {
    ping('http://202.114.18.86/icons/powered_by_rh.png',100,success,check)
}
function success(){
    body.style.filter = "none"
    document.querySelector('#main .menu-root .check-hide').classList.remove('check-hide')
    localStorage.setItem("checkCache", Date.now())
}
//ping 函数, 检测与内网连接是否能在100ms 内响应. 实测实验室电脑连接内网 ping 为 9-11ms 左右
function ping(ip,timeout,success,callback) {
    var img = new Image()
    var start = new Date().getTime()
    img.src = /^(http)/.test(ip) ? ip + "?t=" + start : "http://" + ip + "?t=" + start
    console.log(img.src)
    var flag = false  //无法访问
    img.onload = function () {
        flag = true
        success()
        console.log('ping ok')
    }
    img.onerror = function () {
        flag = true
        success()
        console.log('ping error')
    }
    var timer = setTimeout(function () {
        if (!flag) {    //如果真的无法访问
            flag = false
            console.log('ping Timeout!')
            callback()
        }
    }, timeout)
}
function check() {
    var person = prompt("网站内容维护中,审核人员请输入密码(通过后20分钟内免密):")
    if (!person) {

    }
    else if (validate(person)) {
        body.style.filter = "none"
        localStorage.setItem("checkCache", Date.now())
    } else {
        alert("密码错误,请重新输入!")
        check()
    }
}
function validate(str) {
    str = parseInt(str)
    if (str > 10000) {
        var i = 2
        for (i = 2; i * i < str; i++) {
            if (str % i == 0) {
                return false
            }
        }
        return true
    }
    return false
}
