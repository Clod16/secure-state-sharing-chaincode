//clod16 chaincode


const shim = require('fabric-shim');
const datatransform = require("./utils/datatransform");
var logger = shim.newLogger('SSS-MasterChaincode');

logger.level = 'debug';

var MasterChaincode = class {


    async Init(stub) {
        logger.debug("________Init________");
        return shim.success(Buffer.from('Init - OK!'));

    }

    async Invoke(stub) {

        logger.info('________Invoke________')

      //  let ret = stub.getArgs();


      let ret = stub.getFunctionAndParameters();
      let fcn = ret.fcn;
      let args = ret.params;
      logger.info('getFunctionAndParameters:' + ret);

      logger.info('do this fuction:' + fcn);
      logger.info(' List of args: ' + args);

      let argument = stub.getArgs();
      logger.info('getArgs:' + argument);

        try {
            
            let resp = await stub.invokeChaincode("sss-chaincode-node", [argument[0],argument[1]], "ledgerchannel");
            return shim.success(Buffer.from(JSON.stringify(resp)));
        } catch (e) {
            logger.error('InvokeChaincode - ERROR CATCH: ' + e);
            return shim.error('InvokeChaincode - Failed to invoke chaincode: ' + e);
        }
    }

};

shim.start(new MasterChaincode());