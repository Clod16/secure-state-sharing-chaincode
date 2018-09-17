//clod16 chaincode


const shim = require('fabric-shim');
const datatransform = require("./utils/datatransform");
var logger = shim.newLogger('SSS-Chaincode');

logger.level = 'debug';

var Chaincode = class {


    async Init(stub) {
        logger.debug("________Init________");
        return shim.success(Buffer.from('Init - OK!'));

    }

    async Invoke(stub) {

        logger.info('________Invoke________')
        let ret = stub.getFunctionAndParameters();
        let fcn = ret.fcn;
        let args = ret.params;

        logger.info('do this fuction:' + fcn);
        logger.info(' List of args: ' + args);

        //list of methods

        if (fcn === 'putEntity') {
            return this.putEntity(stub, args);
        }

        if (fcn === 'getEntity') {
            return this.getEntity(stub, args);
        }

        if (fcn === 'callChaincode') {
            return this.callChaincode(stub, args);
        }


        logger.error('Error...probably wrong name of fuction!!!' + fcn);
        return shim.error('Error...probably wrong name of fuction!!!' + fcn);

    }

    async callChaincode(stub, args) {
        logger.debug("___callChaincode___");

        var buffer = new ArrayBuffer(16)
        buffer[0] = args
        resp = this.stub.InvokeChaincode("sss-chaincode", buffer, "ledgerchannel");

    }

    async getEntity(stub, args) {
        logger.debug("___getEntity___");
        let entityGetbytes = null;
        if (args.length != 2) {
            return shim.error("Number of argument is wrong, expected two!!");
        }
        let keySSS = stub.createCompositeKey("", [args[0], args[1]]);

        try {
            entityGetbytes = await stub.getState(keySSS);
            if (!entityGetbytes) {
                return shim.error(' Entity with key' + keySSS + ' not found!!!');
            }
            const stringGet = datatransform.Transform.bufferToString(Buffer.from(entityGetbytes));
            logger.debug('getEntity extract: ' + entityGetbytes);
            return shim.success(Buffer.from(stringGet));
        } catch (e) {
            logger.info('getEntity - ERROR CATCH: ' + e);
            return shim.error('getEntity - Failed to get state with key: ' + keySSS);

        }
    }

    async putEntity(stub, args) {
        logger.debug("___putEntity___");
        if (args.length == 1) {
            try {
                var entityContainer = JSON.parse(args[0]);
                if (typeof entityContainer == 'undefined' || entityContainer == null ||
                    typeof entityContainer != 'object') {
                    return shim.error('entityContainer undefined or null or not object');
                }
                logger.debug("Entity parsed:" + entityContainer);
                const entity = entityContainer;
                var keySSS = stub.createCompositeKey("", [entity.Id, entity.Type]);


                try {
                    await stub.putState(keySSS, Buffer.from(entity));
                    logger.debug('putEntity payload:' + args[0]);
                    logger.debug('putEntity - Store successfull!!');
                    return shim.success(Buffer.from('putEntity - Store successfull!!!'));
                } catch (e) {
                    logger.info('putEntity - ERROR CATCH (putEntity): ' + e);
                    return shim.error(e);

                }
            } catch (e) {
                logger.info('putEntity - ERROR CATCH (JSON.parse()): ' + e);
                return shim.error('Parse error found');

            }
        } else {
            return shim.error("Argument wrong, aspected exactly one argument!!");
        }
    }
};

shim.start(new Chaincode());