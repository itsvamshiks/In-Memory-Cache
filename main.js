const p1 = require("./p1.js");
const fact = new p1.ConfigCacheFactory("random.xml",p1.readXML,5);
const a = fact.getInstance();
a.getData().then(function () {
    const b = fact.getInstance();
    b.getData();
});
