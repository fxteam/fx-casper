'use strict';

// casper setting
// setting UserAgent for all the browser
var casper = require('casper').create({
  verbose: true,
  logLevel: 'debug',
  waitTimeout: 5000,
  pageSetting: {
    loadImages: true,
    loadPlugins: true,
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/36.0.1985.125 Safari/537.36'
  },
  clientScripts: [
      '../lib/jquery.1.8.3.js' // inject the jquery for dom select
  ]
});

var getSystemArg = function() {
  var url = casper.cli.get('url');
  return url;
};

// create the base path when the scripts capture starting
var pathBase = Date.parse(new Date());
var saveImg = function(imgName) {
  if (imgName) {
    this.capture('./' + pathBase + '/' + imgName);
  }
  return true;
}

// open 6pm.com
casper.start('http://www.6pm.com', function() {
  this.log('open 6pm.com', "warning");
  saveImg.call(this, 'open.png');
});

// open the goods url from the system args
casper.then(function() {
  var url = getSystemArg();
  this.open(url);
});

// evaluate the select element
// and select the right property
casper.then(function() {
  this.evaluate(function() {
    $('#d3').val('109927').change()
    return true;
  });
  saveImg.call(this, 'select.png');
});

// add checked goods to cart
casper.then(function() {
  this.log('add to cart', 'warning');
  this.evaluate(function() {
    $('#prForm').submit();
  });
});

// check the goods cart if exist
casper.waitForSelector('#cartHead', function() {
  this.log('saveImg cart success', 'warning');
  saveImg.call(this, 'add_goods_to_cart.png');
});

casper.then(function() {
  this.click('#proceed1');
});

// fill with the login form
// username and correct password
casper.then(function() {
  this.evaluate(function() {
    $('input[name="j_username"]').val('23508536@qq.com');
    $('input[name="j_password"]').val('ryan324');
    return true;
  });
  this.log('fill form success', 'warning');
  saveImg.call(this, 'form.png');
});

casper.then(function() {
  this.evaluate(function() {
    $('#returnCustomer').submit();
  });
});

casper.then(function() {
  this.log('login success capture', 'warning');
  saveImg.call(this, 'login_success.png');
});

// pay for all goods in cart
casper.waitForSelector('#cartHead', function() {
  saveImg.call(this, 'pay_for_cart.png');
});

casper.then(function() {
  this.click('#proceed1');
});

casper.then(function() {
  this.log('start checkout goods', 'warning');
  saveImg.call(this, 'start_checkout.png');
});

casper.waitForSelector('#checkoutCommand', function() {
  // var formData = {
  //   address: '南山公安分局',
  //   city: '广东深圳',
  //   postalCode: '575600',
  //   phoneNumber: '18129811214',
  //   plainTextNumber: '5643987622109987'
  // };

  // this.fillSelectors('#checkoutCommand', {
  //   'input[name="address.address1"]': 'test'
  // }, false);

  // this.evaluate(function() {
  //   $("#address.address1").attr('value', 'test');
    // $('#address.city').val(city);
    // $('#address.state').val('CA').change();
    // $('#address.postalCode').val(postalCode);
    // $('#address.phoneNumber').val(phoneNumber);
    // $('#saveShipAdr').prop('checked', true);
    // $('#creditCard.plainTextNumber').val(plainTextNumber);
    // $('#creditCard.address.address1').val(address);
    // $('#creditCard.address.city').val(city);
    // $('#creditCard.address.state').val('CA').change();
    // $('#creditCard.address.postalCode').val(postalCode);
    // $('#creditCard.address.postalCode').val(postalCode);
    // $('#creditCard.address.phoneNumber').val(phoneNumber);
    // $('#savePymtType').prop('checked', true);
  //   return true;
  // });

  this.log('check out the form values', 'warning');
  saveImg.call(this, 'checkout_form.png');
});

casper.then(function() {
  this.log('===================================', 'INFO')
  this.log('finish test');
  this.log('===================================', 'INFO')
});

// when finish above steps
// clear and exiting casperjs
casper.run(function() {
  this.clear().exit();
});
