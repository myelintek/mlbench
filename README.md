# MLBench


### Development Scripts
For developer
```bash
# install dependencies
yarn

# run application in development mode
yarn dev
```


For distribution
```bash
# compile source code and create webpack output
yarn compile

# `yarn compile` & create build with electron-builder
yarn dist
# built file in dist/win-unpacked/mlbench.exe

# `yarn compile` & create unpacked build with electron-builder
yarn dist:dir

```
