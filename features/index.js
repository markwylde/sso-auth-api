require('glob')('features/**/*.js', (error, files) => {
  const testFiles = files
    .filter(name => !name.startsWith('features/_support'))
    .map(name => './' + name.slice('features/'.length))
  
    console.log(testFiles);
  testFiles.forEach(require);
})
