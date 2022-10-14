# Contributing to PDEJS

---

We would like to encourage everyone to help and support this project by contributing.

## How Can I Contribute?

### Reporting Bugs

Please submit a [GitHub issue](https://github.com/cam-inc/pde.js/issues/new?assignees=&labels=bug&template=bug_report.md&title=) to report a bug. Before submitting one, try to make sure any issue similar to your's doesn't already exist.

### Requesting Features

Please submit a [GitHub issue](https://github.com/cam-inc/pde.js/issues/new?assignees=&labels=enhancement&template=feature_request.md&title=) to suggest a feature.

### Code Contribution

We apply the monorepo architecture; see each workspace's `README.md` for details.

Use the npm command's option `--workspace` (`-w`) with a workspace name to execute workspace-specific npm scripts, like:

```shell
$ npm run dev -w @pdejs/core
$ npm run build -w @pdejs/core -w @pdejs/tool-block-paragraph
```

When you execute npm scripts without the option, Turborepo runs all tasks.

```shell
$ npm run test # turbo run test
```

Below is a quick guide to code contribution.

1. Fork and clone the repo to your local machine.
2. Create a new branch from `main` with a meaningful name for the task you work on. See [GitHub Flow](http://scottchacon.com/2011/08/31/github-flow.html) for more information.
3. Setup by running: `npm run preflight`.
4. Do your work following the `styleguide` of each package; read the readme.md files in each package directory.
5. Add changelog intentions by running `npm run changelog`.
6. Push your branch.
7. Submit a pull request to the upstream repository.

## Code of Conduct

Follow [this](./CODE_OF_CONDUCT.md).

## License

By contributing to this project, you agree to license your contribution under the [Apache-2.0 License](./LICENSE).
