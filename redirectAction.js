'use strict';

let Url = require("./urlShortener.js").UrlModel;

let express = require('express');

async function redirect(req, res) {
  let short = req.params.short;
  let site = await Url.findOne({ short: short}).exec(); // uses short to find entry
  if (site) {
    res.redirect("http://" + site.long);
  }
  
  else {
    res.json({ Error: "No entry matches that path" });
  }
}

//----------- Do not edit below this line -----------//

exports.redirect = redirect;