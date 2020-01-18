"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const core = __importStar(require("@actions/core"));
const tc = __importStar(require("@actions/tool-cache"));
const path = __importStar(require("path"));
const IS_WINDOWS = process.platform === 'win32';
const IS_MAC = process.platform === 'darwin';
function getDartUrl(options) {
    let platform = IS_WINDOWS ? 'windows' : IS_MAC ? 'macos' : 'linux';
    return `https://storage.googleapis.com/dart-archive/channels/${options.channel}/release/${options.version}/sdk/dartsdk-${platform}-${options.architecture}-release.zip`;
}
function installDart(options) {
    return __awaiter(this, void 0, void 0, function* () {
        let toolPath = tc.find('Dart', options.cacheKey);
        if (toolPath) {
            core.info(`Tool found in cache ${toolPath}`);
        }
        else {
            const dartZip = yield tc.downloadTool(getDartUrl(options));
            const unzippedDir = yield tc.extractZip(dartZip);
            core.info(`dart-sdk extracted to ${unzippedDir}`);
            const dartSdkDir = path.join(unzippedDir, 'dart-sdk');
            toolPath = yield tc.cacheDir(dartSdkDir, 'Dart', options.cacheKey);
        }
        let binDir = path.join(toolPath, "bin");
        core.addPath(binDir);
        core.exportVariable('DART_SDK', toolPath);
    });
}
function run() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield installDart(new InstallOptions(core.getInput('dart-version'), core.getInput('dart-channel'), core.getInput('architecture')));
        }
        catch (error) {
            core.setFailed(error.message);
        }
    });
}
class InstallOptions {
    constructor(version, channel, architecture) {
        this.version = version;
        this.channel = channel;
        this.architecture = architecture;
        if (!version) {
            this.version = 'latest';
        }
        if (!channel) {
            if (version.includes('-dev')) {
                this.channel = 'dev';
            }
            else {
                this.channel = 'stable';
            }
        }
        if (!architecture) {
            this.architecture = 'x64';
        }
    }
    get cacheKey() {
        return `${this.version}-${this.channel}-${this.architecture}`;
    }
}
run();
