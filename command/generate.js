const certificationHelper = require('../lib/certificationHelper.js');
const common = require('@tizentv/webide-common-tizentv');
const util = require('../lib/util');
const path = require('path');

module.exports = {
    run: async () => {
        console.log(`Generate a certification............`);

        try {
            const certInfo = await certificationHelper.askQuestion();
            const developerCAPath = path.resolve(
                util.RESOURCE_PATH,
                'developer',
                'tizen-developer-ca.cer'
            );
            const developerPrivateKeyPath = path.resolve(
                util.RESOURCE_PATH,
                'developer',
                'tizen-developer-ca-privatekey.pem'
            );
            const tizenCM = new common.TizenCM(
                util.RESOURCE_PATH,
                developerCAPath,
                developerPrivateKeyPath
            );
            tizenCM.createCert(
                certInfo.keyfileName,
                certInfo.authorName,
                certInfo.authorPassword,
                certInfo.countryInfo,
                certInfo.stateInfo,
                certInfo.cityInfo,
                certInfo.organizationInfo,
                certInfo.departmentInfo,
                certInfo.emailInfo
            );
            console.log('Completed to generate a Tizen certification');
        } catch (e) {
            console.error(`Failed to run: ${e}`);
        }
    }
};
