const {MockList} = require('graphql-tools')

const mocks = {
  Int: () => 42,
  Author: () => ({
    firstName: () => 'Andy',
    lastName: () => 'Lerok',
    posts: () => new MockList([1, 6])
  }),
  Post: () => ({
    tags: () => new MockList([1, 1], () => 'Fed'),
    title: () => 'We got \'em!',
    text: () => '...'
  }),
}

module.exports = mocks
