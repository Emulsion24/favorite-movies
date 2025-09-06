
// __mocks__/models.js
const User = {
  findOne: jest.fn(),
  create: jest.fn(),
  findByPk: jest.fn(),
};

module.exports = {
  User,
};
