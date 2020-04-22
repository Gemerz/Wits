const path = require('path');

const util = require('../lib/util.js');
const userInfoHelper = require('../lib/userInfoHelper.js');
const hostAppHelper = require('../lib/hostAppHelper.js');
const appLaunchHelper = require('../lib/appLaunchHelper.js');
const watchHelper = require('../lib/watchHelper.js');

const CONTAINER_DIRECTORY_NAME = 'container';
const CONTAINER_DIRECTORY_PATH = path.join(
    util.WITS_BASE_PATH,
    '../',
    CONTAINER_DIRECTORY_NAME
);

module.exports = {
    run: async () => {
        console.log(`Start running Wits............`);

        checkConfiguration();

        let data = userInfoHelper.getRefinedData();
        let deviceInfo = await userInfoHelper.getDeviceInfo(data.deviceIp);
        let profileInfo = {
            name: data.profileName,
            path: data.profilePath,
        };

        await hostAppHelper.setHostAppEnv(data, deviceInfo);
        hostAppHelper.buildPackage(profileInfo);

        let hostAppId = hostAppHelper.getHostAppId(data.baseAppPath);
        let hostAppName = hostAppId.split('.')[1];
        let deviceName = deviceInfo.deviceName;

        appLaunchHelper.unInstallPackage(deviceName, hostAppName);
        appLaunchHelper.installPackage(deviceInfo, hostAppName);
        watchHelper.openSocketServer(data, deviceInfo);
        data.isDebugMode
            ? appLaunchHelper.launchDebugMode(
                  deviceName,
                  hostAppId,
                  data.deviceIp
              )
            : appLaunchHelper.launchApp(deviceName, hostAppId);
    },
};

function checkConfiguration() {
    if (!util.isFileExist(CONTAINER_DIRECTORY_PATH)) {
        console.error(
            `Wits configuration is failed. "wits -i" is required before running "wits -s"`
        );
    }
}