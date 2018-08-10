'use strict';

let mongoose = require("mongoose");
let Schema = mongoose.Schema;
let dns = require('dns');

let UrlSchema = new Schema({
  long: {
    type: String,
    required: true
  },
  short: Number
});

let Url = mongoose.model("Url", UrlSchema);
let regex = /^https?:\/\//m;

let createShort = function(req, res) {
  let newlink = req.body.url; // captures input field of form; "url" here matches <input name="url"> in index.html file
  
  if (regex.test(newlink)) {
    newlink = newlink.split(regex)[1]; // gets rid of http(s):// in entry if it exists so dns.lookup will work
  }
  
  dns.lookup(newlink, (err) => { // make sure URL is good
    if (err) {
      res.json({ error: "Invalid URL" });
    }
    
    else {
      checkRepeat(newlink);
    }
  });
  
  async function checkRepeat(url) { // check if url is already in database
    let check = await Url.findOne({long: url});

    if (check) { // already exists, so return info
      res.json({
        long: check.long,
        short: check.short
      });
    }
    
    else { // doesn't exist, so trigger addUrl function
      addUrl(url);
    }
  };
  
  async function addUrl(url) {
    let len = await Url.findOne().sort({ short: -1 }).limit(1).exec() // gets most recent entry using short field
    let newshort;
    
    if (len == null) { // first entry in database
      newshort = new Url({
        long: url,
        short: 1
      });
    }
    
    else {
      newshort = new Url({
        long: url,
        short: len.short + 1
      });
    }
      
    newshort.save((err, data) => {
      if (err) { console.log(err) }
      else { console.log(data) }
    });
      
    res.json(newshort);
  }

};


//----------- Do not edit below this line -----------//

exports.UrlModel = Url; // UrlModel will be how it is imported in other documents such as redirectAction.js
exports.createShort = createShort;