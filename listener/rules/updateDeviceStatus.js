'use strict'

exports.start = function(item) {
    
    if (item[0] === 'data') {
        db.db(dbName)
            .collection('data')
            .insertOne(item[1], function(err, r) {
                if (err) {
                    console.log(`Erro ao salvar: ${item}\t${err}`)
                }
        })

        db.db(dbName)
        .collection('Device_Status')
        .findOne(
            { objectId: item[1].objectId},
            function(err, doc) {
            if (err) {
                console.log(`Erro ao salvar: ${item}\t${err}`)
            }
            
            if (item[1].data && 'do1' in item[1].data) {
                doc.last_do = item[1].data
            }
            else if (item[1].data && 'di1' in item[1].data) {
                doc.last_di = item[1].data
            }

            db.db(dbName)
            .collection('Device_Status')
            .updateOne(
                { objectId: item[1].objectId},
                { $set: doc },
                { upsert: true},
                function(err, r) {
                if (err) {
                    console.log(`Erro ao salvar: ${item}\t${err}`)
                }
            })

        })

    }

    return true
}

