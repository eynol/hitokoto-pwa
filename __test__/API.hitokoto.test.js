import 'isomorphic-fetch';
import HitokotoAPI from '../app/API/hitokoto'

describe('Hitokoto API', () => {
  test('fetch promise return json', () => {
    expect.assertions(2);
    return HitokotoAPI.getHitokoto().then(resp => {
      expect(resp.type).toMatch(/\s*/);
      expect(typeof resp['hitokoto']).toBe('string');
    })
  })
})