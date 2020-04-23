
/**
 * 节流函数
 * @param {需要节流的函数} callback
 * @param {节流的时间} relay
 * @param {传递进来的参数} 
 */
export default function(callback, relay){
    let flag = false;
    return function () {
        if (flag) return;
        flag = true
        setTimeout(() => {
            flag = false;
            callback.apply(this, arguments)
        }, relay)
    }
}