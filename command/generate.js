const certificationHelper = require('../lib/certificationHelper.js');
const common = require('@tizentv/webide-common-tizentv');
const util = require('../lib/util');
const path = require('path');

module.exports = {
    run: async () => {
        console.log(`Generate a certification............`);

        try {
            const certInfo = await certificationHelper.askQuestion();
            const resourcePath = util.RESOURCE_PATH;
            const developerCAPath = path.resolve(
                resourcePath,
                'developer',
                'tizen-developer-ca.cer'
            );
            const developerPrivateKeyPath = path.resolve(
                resourcePath,
                'developer',
                'tizen-developer-ca-privatekey.pem'
            );
            const tizenCM = new common.TizenCM(
                resourcePath,
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

            const profileManager = new common.ProfileManager(resourcePath);
            const profileName = 'test0811';
            const authorCA = path.resolve(
                resourcePath,
                'developer',
                'tizen-developer-ca.cer'
            );
            const authorCertPath = path.resolve(
                resourcePath,
                '../',
                'resource',
                'Author',
                'test0811.p12'
            );
            const authorPassword = 'test0811';
            const distributorCA = path.resolve(
                resourcePath,
                'distributor',
                'sdk-public',
                'tizen-distributor-ca.cer'
            );
            const distributorCertPath = path.resolve(
                resourcePath,
                'distributor',
                'sdk-public',
                'tizen-distributor-signer.p12'
            );
            const distributorPassword = 'tizenpkcs12passfordsigner';

            profileManager.registerProfile(
                profileName,
                authorCA,
                authorCertPath,
                authorPassword,
                distributorCA,
                distributorCertPath,
                distributorPassword
            );
            console.log('Completed to register a Profile');

            profileManager.setActivateProfile(profileName);
        } catch (e) {
            console.error(`Failed to run: ${e}`);
        }
    }
};
