var chai = require('chai');
var chaiHttp = require('chai-http');
var server = require('../index');
var should = chai.should();

chai.use(chaiHttp);

describe('part_quantity',function(){
    it('should see if user is added to table'), function(done){
        chai.request(server).get('/routes/queryPartsQuantityRouter').end(function(err,res){
            var num=res.body.length;
            chai.request(server).post('/routes/addPartRouter').send({'internal_part_number':'PCB0123-A','location_id':'1','status_id':'4','quantity': 5 ,'note':""})
                .end(function(error,res){
                    chai.request(server).get('/routes/queryPartsQuantityRouter').end(function(err,res){
                        var num2=res.body.length
                        (num2-num1).should.equal(1)
                    })
                    done();
                })
        })
    }
})