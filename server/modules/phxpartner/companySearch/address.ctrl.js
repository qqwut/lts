var fs = require('fs');
const path = require('path');
var moment = require('moment');
var _ = require('lodash');
var env = process.env.NODE_ENV || 'development';
var cfg = require('../../../config/config.js');
var utils = require('../../../utils/common.js');
var logger = require('../../../utils/logger');
var _CONST = require('../../../utils/constants.js');
var clientHttp = require('../../../connector/http-connector.js');
var dataLocationDummy = [];
var testDummyData = cfg.mockup_data ? parseInt(cfg.mockup_data) : 0;


exports.addressview = function (req, res) {
    logger.info('Api search location');
    var filter = req.body || {};
    logger.debug('filter:' + JSON.stringify(filter));
    var ret = {};
   try {
      //  filter.groupName = req.currentUser.userGroup;
        var queryStr = utils.getSDFFilter2QueryStr(null, filter);
        var uri = cfg.service.PANDORA.URI + '/phxPartner/v1/address/list.json?filter=' + queryStr;
        // logger.info('GET :: ' + uri);
        logger.info('prepare option to sent request : ' + uri);
        return clientHttp.get(uri, {
            service: 'phxpartners-be',
            callService: 'SEARCH_COMPANY_ADDRESS',
            reqId: req.id
        }).then(function (response) {
            logger.info('response  :: ' + response.resultCode + ':' + response.resultDescription);
            if (parseInt(response.resultCode) != 20000) {
                ret.responseCode = (parseInt(parseInt(response.resultCode) / 100)).toString();
                ret.responseDescription = response.resultDescription;
                ret.responseMoreInfo = response.moreInfo;
                if(ret.responseCode == "404"){
                    ret.responseMoreInfo = 'Data not found';
                }
                ret.responseData = {};
                res.json(ret);
                return;
            }
            ret.responseCode = '200';
            ret.responseDescription = 'Success';
            ret.responseMoreInfo = 'Success';
            ret.responseData = response.resultData[0];
            res.json(ret);
        }).catch(function (err) {
            logger.errorStack(err);
            ret.responseCode = 500;
            ret.responseMessage = 'Fail';
            ret.responseDescription = err.message;
            // ret.data = getLocationDummyData();
            res.json(ret);
        });
    } catch (error) {
        logger.errorStack(error);
        ret.responseCode = 500;
        ret.responseMessage = 'Fail';
        ret.responseDescription = error.message;
        // ret.data = getLocationDummyData();
        res.json(ret);
    }
};