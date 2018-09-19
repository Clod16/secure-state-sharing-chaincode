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
        logger.info('getFunctionAndParameters:' + ret);

        logger.info('do this fuction:' + fcn);
        logger.info(' List of args: ' + args);

        let argument = stub.getArgs();
        logger.info('getArgs:' + argument);



        //list of methods

        if (fcn === 'putEntity') {
            return this.putEntity(stub, args);
        }

        if (fcn === 'getEntity') {
            return this.getEntity(stub, args);
        }

        logger.error('Error...probably wrong name of fuction!!!' + fcn);
        return shim.error('Error...probably wrong name of fuction!!!' + fcn);

    }

    async getEntity(stub, args) {
        logger.debug("___getEntity___");
        let entityGetbytes = null;
        if (args.length != 2) {
            return shim.error("Number of argument is wrong, expected two!!");
        }
        let keySSS = stub.createCompositeKey("SSS", [args[0], args[1]]);

        try {
            entityGetbytes = await stub.getState(keySSS);
            if (!entityGetbytes) {
                return shim.error(' Entity with key' + keySSS + ' not found!!!');
            }
            const stringGet = datatransform.Transform.bufferToString(entityGetbytes);
            logger.debug('getEntity extract: ' + entityGetbytes);
            //let payload = JSON.parse(stringGet);
            return shim.success(Buffer.from(stringGet));
        } catch (e) {
            logger.error('getEntity - ERROR CATCH: ' + e);
            return shim.error('getEntity - Failed to get state with key: ' + keySSS);

        }
    }

    async putEntity(stub, args) {
        logger.debug("___putEntity___");
        if (args.length == 1) {
            try {
                logger.info("args:" +args[0])
                let entityContainer = JSON.parse(args[0]);
                if (typeof entityContainer == 'undefined' || entityContainer == null ||
                    typeof entityContainer != 'object') {
                    return shim.error('entityContainer undefined or null or not object');
                }
                logger.info("Entity parsed:" + entityContainer);
                //const entity = entityContainer;


                try {
                    logger.info("ID:" +entityContainer.id);
                    logger.info("Type:" +entityContainer.type);

                    var keySSS = stub.createCompositeKey("SSS", [entityContainer.id, entityContainer.type]);
                    logger.info("keySSS:" +keySSS);
                    
                    await stub.putState(keySSS, Buffer.from(JSON.stringify(entityContainer)));
                    logger.debug('putEntity payload:' + args[0]);
                    logger.debug('putEntity - Store successfull!!');
                    return shim.success(Buffer.from('putEntity - Store successfull!!!'));
                } catch (e) {
                    logger.error('putEntity - ERROR CATCH (putEntity): ' + e);
                    return shim.error(e);

                }
            } catch (e) {
                logger.error('putEntity - ERROR CATCH (JSON.parse()): ' + e);
                return shim.error('Parse error found');

            }
        } else {
            return shim.error("putEntity ERROR: wrong argument!!");
        }
    }
};

shim.start(new Chaincode());
