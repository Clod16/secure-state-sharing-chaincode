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

        let argument = stub.getArgs();
        logger.info('getArgs:' + argument);

        if (typeof argument[0] == 'string' && !argument[0].trim() || typeof argument[0] == 'undefined' || argument[0] === null) {
            return shim.error("Error: function name empty or null!");
        }
        let asset = JSON.parse(argument[1]);
        if (typeof asset.id == 'string' && !asset.id.trim() || typeof asset.id == 'undefined' || argument[0] === null) {
            if (typeof asset.type == 'string' && !asset.id.trim() || typeof asset.id == 'undefined' || argument[0] === null) {
                return shim.error("Error: It takes a valid id/type to invoke chaincode!!!");
            }
        }
        try {
            let resp = await stub.invokeChaincode("sss-chaincode-node", [argument[0], argument[1]], "ledgerchannel");
            return shim.success(Buffer.from(JSON.stringify(resp)));
        } catch (e) {
            logger.error('InvokeChaincode - ERROR CATCH: ' + e);
            return shim.error('InvokeChaincode - Failed to invoke chaincode: ' + e);
        }
    }

};

shim.start(new MasterChaincode());