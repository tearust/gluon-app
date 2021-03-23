import gluon from '../gluon';

describe('test gluon object', ()=>{

  const init_gluon = ()=>{
    const g = new gluon({
      query: {
        system: {
          events: ()=>{}
        }
      }
    }, null, null, {});
    return g;
  };

  test('it should be sha256 result for data "gluon"', ()=>{
    const g = init_gluon();

    const rs = g.sha256('gluon');

    expect(rs).toEqual('f7d0155b0c0fe9a7d2d9fb30d57b2a7eda30d4610be7c4d321203562dcc62efe');
  });

  
});