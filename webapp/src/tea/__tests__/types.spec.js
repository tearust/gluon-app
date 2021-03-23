import types from '../types';
import _ from 'lodash';

describe('test gluon types', ()=>{
  
  test('it should contain "Data" meta data', ()=>{
    const {Data} = types;
    expect(_.size(Data)).toBe(5);
  });

  test('it should be 33 factors totally', ()=>{
    const size = _.size(types);

    expect(size).toBe(33);
  });

});