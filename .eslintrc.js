module.exports = {
  extends: 'canonical/auto',
  overrides: [{
    files: ['package.json'],
    rules: {
      // Specific sorting rules for the package.json file
      'jsonc/sort-keys': [
        2,
        {
          order: [
            // Project information
            'name',
            'version',
            'description',
            'keywords',
            'homepage',
            'bugs',
            'license',
            'author',
            'contributors',
            'repository',
            'funding',
            'private',

            // Technical usage information
            'engines',
            'engineStrict',
            'os',
            'cpu',
            'publishConfig',
            'workspaces',
            'type',
            'config',

            // Output/build definitions
            'files',
            'directories',
            'packageManager',
            'exports',
            'imports',
            'main',
            'browser',
            'bin',
            'man',

            // Scripts
            'scripts',

            // Other configuration
            'lint-staged',
            'nutkit',

            // Dependency related configuration
            'dependencies',
            'devDependencies',
            'peerDependencies',
            'peerDependenciesMeta',
            'bundleDependencies',
            'optionalDependencies',
            'overrides',
          ],
          pathPattern: '^$',
        },
        {
          order: { type: 'asc' },
          pathPattern: '^(?:dev|peer|optional|bundle)?[Dd]ependencies(?:Meta)?$',
        },
      ],
    }
  }],
  rules: {
    'id-length': 0,
    'no-console': 0,
    'prettier/prettier': 0,
    'unicorn/prevent-abbreviations': 0,
  }
};
