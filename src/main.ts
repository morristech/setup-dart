import * as core from '@actions/core';
import * as tc from '@actions/tool-cache';
import * as path from 'path';

const IS_WINDOWS = process.platform === 'win32';
const IS_MAC = process.platform === 'darwin';

function getDartUrl(options: InstallOptions): string {
  let platform = IS_WINDOWS ? 'windows' : IS_MAC ? 'macos' : 'linux';
  return `https://storage.googleapis.com/dart-archive/channels/${options.channel}/release/${options.version}/sdk/dartsdk-${platform}-${options.architecture}-release.zip`;
}

async function installDart(options: InstallOptions): Promise<void> {
  let toolPath = tc.find('Dart', options.cacheKey);

  if (toolPath) {
    core.info(`Tool found in cache ${toolPath}`);
  } else {
    const dartZip = await tc.downloadTool(getDartUrl(options));
    const unzippedDir = await tc.extractZip(dartZip);
    core.info(`dart-sdk extracted to ${unzippedDir}`);
    const dartSdkDir = path.join(unzippedDir, 'dart-sdk');
    toolPath = await tc.cacheDir(dartSdkDir, 'Dart', options.cacheKey);
  }

  let binDir = path.join(toolPath, "bin");
  core.addPath(binDir);
  core.exportVariable('DART_SDK', toolPath);
}

async function run() {
  try {
    await installDart(new InstallOptions(
        core.getInput('dart-version'),
        core.getInput('dart-channel'),
        core.getInput('architecture'),
    ));
  } catch (error) {
    core.setFailed(error.message);
  }
}

class InstallOptions {
  constructor(public readonly version: string,
              public readonly channel: string,
              public readonly architecture: string) {
    if (!version) {
      this.version = 'latest';
    }
    if (!channel) {
      if (version.includes('-dev')) {
        this.channel = 'dev';
      } else {
        this.channel = 'stable';
      }
    }
    if (!architecture) {
      this.architecture = 'x64';
    }
  }

  get cacheKey(): string {
    return `${this.version}-${this.channel}-${this.architecture}`;
  }
}

run();
