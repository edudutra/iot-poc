var expect = require('chai').expect
var parseMessage = require('../recorder')

describe('parseMessage()', function() {
    describe('Advantech module', function() {
        it('should return null when topic is too short', function() {
            //Arrange
            var topic = 'short/topic'
            var message = '{}'
            //Act
            var parsed = parseMessage(topic, message)
            //Assert
            expect(parsed).to.be.null
        })

        it('should return null when topic is too long', function() {
            //Arrange
            var topic = 'a/very/long/topic'
            var message = '{}'
            //Act
            var parsed = parseMessage(topic, message)
            //Assert
            expect(parsed).to.be.null
        })

        it('should identify data from topic', function() {
            //Arrange
            var topic = 'Advantech/1234567890/data'
            var message = '{}'
            //Act
            var parsed = parseMessage(topic, message)
            //Assert
            expect(parsed[0]).to.be.equal('data')
            expect(parsed[1]).to.haveOwnProperty('data')
        })

        it('should identify status from topic', function() {
            //Arrange
            var topic = 'Advantech/1234567890/Device_Status'
            var message = '{}'
            //Act
            var parsed = parseMessage(topic, message)
            //Assert
            expect(parsed[0]).to.be.equal('Device_Status')
            expect(parsed[1]).to.haveOwnProperty('status')
        })
        
        it('should identify objectId from topic', function() {
            //Arrange
            var topic = 'Advantech/1234567890/data'
            var message = '{}'
            //Act
            var parsed = parseMessage(topic, message)
            //Assert
            expect(parsed[1].objectId).to.be.equal('1234567890')
        })

        it('shoud load message as object in data when topic ends in data', function() {
            //Arrange
            var topic = 'Advantech/1234567890/data'
            var data = {a : 1 , b : "123", c: false, d: Date.now()}
            var message = JSON.stringify(data)
            //Act
            var parsed = parseMessage(topic, message)
            //Assert
            expect(parsed[1].data).to.be.deep.equal(data)
        })

        it('shoud load message as object in status when topic ends in Device_Status', function() {
            //Arrange
            var topic = 'Advantech/1234567890/Device_Status'
            var data = {a : 1 , b : "123", c: false, d: Date.now()}
            var message = JSON.stringify(data)
            //Act
            var parsed = parseMessage(topic, message)
            //Assert
            expect(parsed[1].status).to.be.deep.equal(data)
        })
    })
})