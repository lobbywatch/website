const resolveFunctions = {
  RootQuery: {
    author(_, {firstName, lastName}){
      return {firstName, lastName}
    }
  }
}

module.exports = resolveFunctions
