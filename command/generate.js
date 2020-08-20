const certificationHelper = require('../lib/certificationHelper.js');
const common = require('@tizentv/webide-common-tizentv');
const util = require('../lib/util');
const path = require('path');

module.exports = {
    run: async () => {
        console.log(`Generate a certification............`);

        const resourceDir = path.resolve(
            util.WITS_BASE_PATH,
            '../',
            'resource'
        );

        try {
            const certInfo = await certificationHelper.askQuestion();
            util.createEmptyDirectory(resourceDir);
            util.RESOURCE_PATH = resourceDir;

            const tizenCM = new common.TizenCM(resourceDir);
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

            const profileManager = new common.ProfileManager(resourceDir);
            const profileName = certInfo.authorName;
            const authorProfile = {
                authorCA: tizenCM.getTizenDeveloperCA(),
                authorCertPath: path.resolve(
                    resourceDir,
                    'Author',
                    `${certInfo.authorName}.p12`
                ),
                authorPassword: certInfo.authorPassword
            };
            const distributorProfile = tizenCM.getTizenDistributorProfile(
                certInfo.privilegeLevel
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
