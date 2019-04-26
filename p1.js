const parser = require('xml2json');
const yaml = require('js-yaml');
const fs = require('fs');

/**
* Config Class
*/

class ConfigCache {

  constructor(filename,fetchFunction,timeToLive){
      this.filename = filename;
      this.millisecondsToLive = timeToLive*60*1000;
      this.fetchFunction = fetchFunction;
      this.cache = null;
      this.getData = this.getData.bind(this);
      this.resetCache = this.resetCache.bind(this);
      this.isCacheExpired = this.isCacheExpired.bind(this);
      this.fetchDate = new Date(0);
  }

  isCacheExpired(){
      return (this.fetchDate.getTime() + this.millisecondsToLive)<new Date().getTime();
  }

  getData(){
      if(!this.cache || this.isCacheExpired()){
          console.log('In cache not valid block');
          return this.fetchFunction(this.filename).then((data)=>{
                  console.log(data);
                  this.cache = data;
                  this.fetchDate = new Date();
                  return data;
              });
      }else{
          console.log('getting data from cache');
          console.log(this.cache);
          return Promise.resolve(this.cache);
      }
  }

  resetCache(){
      this.fetchDate = new Date(0);
  }

  //reloading dynamically


  //caching mechanism

}//end of class

/**
* Singleton Factory for Config Class
*/
class ConfigCacheFactory {

  constructor(fetchFunction,timeToLive) {
    if (!ConfigCacheFactory.instance) {
      ConfigCacheFactory.instance = new ConfigCache(fetchFunction,timeToLive);
    }
  }

  getInstance() {
    return ConfigCacheFactory.instance;
  }

}//end of class

function readJSON(filename){
    try {
        var output = JSON.stringify(JSON.parse(fs.readFileSync(filename)));
        return Promise.resolve(output);
    } catch (e) {
        console.log(e);
    }
}//end of function

function readYaml(filename){
    try {
        const config = yaml.safeLoad(fs.readFileSync(filename, 'utf8'));
        const indentedJson = JSON.stringify(config, null, 4);
        return Promise.resolve(indentedJson);
    } catch (e) {
        console.log(e);
    }
}//end of function

function readXML(filename){
    try {
        const output = JSON.stringify(JSON.parse(parser.toJson(fs.readFileSync(filename), {reversible: true})));
        return Promise.resolve(output);
    } catch(e) {
        console.log(e);
    }
}//end of function



/**
* Exports defined
*/

/*var output = fs.readFileSync("random.json");
console.log(JSON.parse(output));*/
module.exports = {ConfigCacheFactory,readJSON,readYaml,readXML};
