'use strict'

exports.parseMessage = function(topic, message) {
    var topic_path = topic.split('/')
    if (topic_path.length != 3) {
        return null
    }
    var item = {
        objectId : topic_path[1], 
        objectBrand : topic_path[0]
    }
    switch (topic_path[2]) {
        case 'data':
            item.data = JSON.parse(message)
            break;
        case 'Device_Status':
            item.status = JSON.parse(message)
        default:
            break;
    }
    return [topic_path[2], item]
}