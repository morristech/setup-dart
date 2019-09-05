import * as core from '@actions/core';

async function run() {
  try {
    const dartVersion = core.getInput('dart-version');
    core.debug(`Hello ${dartVersion}`);
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
