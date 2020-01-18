# Dart Setup GitHub Action

GitHub Action that sets up the Dart SDK in a CI VM.

## Usage

#### Specific Dart version
```yaml
jobs:
  test:
    name: Run tests
    runs-on: macos-latest
    steps:
      - uses: actions/checkout@v2
      - uses: xvrh/setup-dart@v1
        with:
          dart-version: '2.7.0'
```

#### Latest version of a specific channel
```yaml
jobs:
  test:
    name: Run tests
    runs-on: macos-latest
    steps:
      - uses: actions/checkout@v2
      - uses: xvrh/setup-dart@v1
        with:
          dart-version: 'latest'
          dart-channel: 'dev'
```

#### Multiple Dart versions
```yaml
jobs:
  test:
    name: Run tests
    runs-on: macos-latest
    steps:
      - uses: actions/checkout@v2
      - uses: xvrh/setup-dart@v1
        with:
          dart-version: 'latest'
          dart-channel: 'stable'
      - run: pub get && pub run test
      - uses: xvrh/setup-dart@v1
        with:
          dart-version: 'latest'
          dart-channel: 'dev'
      - run: pub get && pub run test
      - uses: xvrh/setup-dart@v1
        with:
          dart-version: '2.6.0'
      - run: pub get && pub run test
```