const certificationHelper = require('../lib/certificationHelper.js');
const common = require('@tizentv/webide-common-tizentv');
const util = require('../lib/util');
const path = require('path');

module.exports = {
    run: async () => {
        console.log(`Generate a certification............`);

        try {
            const certInfo = await certificationHelper.askQuestion();
            const tizenCM = new common.TizenCM(util.RESOURCE_PATH);
            await tizenCM.init();
            const authorInfo = {
                authorFile: certInfo.keyfileName,
                authorName: certInfo.authorName,
                authorPassword: certInfo.authorPassword,
                authorCountry: certInfo.countryInfo,
                authorState: certInfo.stateInfo,
                authorCity: certInfo.cityInfo,
                authorOrganization: certInfo.organizationInfo,
                authorDepartment: certInfo.departmentInfo,
                authorEmail: certInfo.emailInfo
            };
            tizenCM.createCert(authorInfo);
            console.log('Completed to generate a Tizen certification');

            const profileManager = new common.ProfileManager(resourcePath);
            const profileName = certInfo.authorName;
            const authorProfile = {
                authorCA: TizenCM.getTizenDeveloperCA(),
                authorCertPath: path.resolve(
                    resourcePath,
                    'Author',
                    `${certInfo.authorName}.p12`
                ),
                authorPassword: certInfo.authorPassword
            };
            const distributorProfile = TizenCM.getTizenDistributorProfile(
                'public'
            );

            profileManager.registerProfile(
                profileName,
                authorProfile,
                distributorProfile
            );
            console.log('Completed to register a Profile');

            profileManager.setActivateProfile(profileName);
        } catch (e) {
            console.error(`Failed to run: ${e}`);
        }
    }
};
