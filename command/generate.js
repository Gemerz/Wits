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
            const profileName = 'testpartner';
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
                'testpartner.p12'
            );
            const authorPassword = 'testpartner';
            const distributorCA = path.resolve(
                resourcePath,
                'distributor',
                'sdk-partner',
                'tizen-distributor-ca.cer'
            );
            const distributorCertPath = path.resolve(
                resourcePath,
                'distributor',
                'sdk-partner',
                'tizen-distributor-signer.p12'
            );
            // const distributorPassword = 'tizenpkcs12passfordsigner';
            const distributorPassword = 'testpartner';

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
