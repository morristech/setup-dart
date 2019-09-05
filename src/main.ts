import * as core from '@actions/core';
import * as tc from '@actions/tool-cache';
import * as path from 'path';

const IS_WINDOWS = process.platform === 'win32';
const IS_MAC = process.platform === 'darwin';

function getDartUrl(version: string, arch: string, channel: string): string {
  let platform = IS_WINDOWS ? 'windows' : IS_MAC ? 'macos' : 'linux';
  return `https://storage.googleapis.com/dart-archive/channels/${channel}/release/${version}/sdk/dartsdk-${platform}-${arch}-release.zip`;
}

async function installDart(version: string, arch: string, channel: string) {
  let toolPath: string; //tc.find('Dart', version);

  //if (toolPath) {
  //  core.info(`Tool found in cache ${toolPath}`);
  //} else {
    const dartZip = await tc.downloadTool(getDartUrl(version, arch, channel));
    const unzippedDir = await tc.extractZip(dartZip);
    core.info(`dart-sdk extracted to ${unzippedDir}`);
    const dartSdkDir = path.join(unzippedDir, 'dart-sdk');
    toolPath = dartSdkDir;// await tc.cacheDir(dartSdkDir, 'Dart', version, arch);
  //}

  let binDir = path.join(toolPath, "bin");
  core.addPath(binDir);
}

async function run() {
  try {
    const version = core.getInput('dart-version');
    const arch = core.getInput('architecture');
    const channel = core.getInput('dart-channel');
    await installDart(version, arch, channel);
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
