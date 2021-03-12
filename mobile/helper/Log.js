import _ from 'lodash';

let _log = [];
let bind_fn = ()=>{};
const max = 20;
const F = {

  _build(level, tag, log){
    return {
      level, tag, log
    };
  },

  add(level, tag, ...log){
    const obj = F._build(level, tag, log.join(''));
    _log.unshift(obj);

    if(_log.length > max){
      _log = _.slice(_log, 0, max);
    }

    bind_fn(_log);
  },

  i(tag, ...log){
    F.add('I', tag, ...log);
  },

  d(tag, ...log){
    F.add('D', tag, ...log);
  },

  bind(fn){
    bind_fn = fn;

    fn(_log);
  },

  reset(){
    _log = [];
  }


};
export default F;