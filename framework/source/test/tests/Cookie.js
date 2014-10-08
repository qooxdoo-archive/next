describe('Cookie', function() {
 
  it("GetSetDel", function() {
    // this.require(["http"]);
    if(document.location.protocol.indexOf("http") !== 0){
      return;
    }
    var key1 = "q.test.cookie.Gorilla";
    var key2 = "q.test.cookie.Chimp";

    assert.isNull(q.cookie.get(key1));
    assert.isNull(q.cookie.get(key2));

    var value1 = "Donkey";
    var value2 = "Diddy";

    q.cookie.set(key1, value1);
    q.cookie.set(key2, value2);

    assert.equal(value1, q.cookie.get(key1));
    assert.equal(value2, q.cookie.get(key2));

    q.cookie.del(key1);
    q.cookie.del(key2);

    assert.isNull(q.cookie.get(key1));
    assert.isNull(q.cookie.get(key2));
  });
}); 