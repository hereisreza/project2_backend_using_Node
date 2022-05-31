const rank = require('../src/rankAnalyst')
test('Analyst ranking', async () => {
  const res = await rank()
  let condition = true
  for (let a = 0; a < res.length; a++) {
    if (a < res.length - 1) {
      if (res[a].accuracy < res[a + 1].accuracy) {
        condition = false
      }
    }
  }
  expect(condition).toBe(true)
})
