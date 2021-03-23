import utils from '../utils';

describe('test gluon utils', ()=>{

  test('it should be length 36 for uuid result', ()=>{
    const uuid = utils.uuid();

    expect(uuid.length).toBe(36);
  })
});