import request from '@/utils/request';

import { eventChannel } from 'redux-saga';

var eventSourceInitChannel = (id, stream) => {
  return eventChannel(emitter => {

    var point = `log.stream:${id}`

    var es = new EventSource(`/api/watch?point=${encodeURIComponent(point)}`);


    es.addEventListener(point, (e) => {
      var data = JSON.parse(e.data)

      stream.push(data)
      if (stream.length > 1000) {
        stream.shift()
      }
      emitter({ type: 'combine', payload: [...stream] })
    })




    return () => {
      es.close()
      // do whatever to interrupt the communication here
    }
  })
}

var channel;
export default {
  namespace: 'node',

  state: {
    base: {},
    nodes: [],
    stream: []
  },

  effects: {
    *fetch(_, { call, put }) {
      const response = yield call(async () => request('/api/node/profile'));

      yield put({
        type: 'query',
        payload: response.data || { base: {}, nodes: [] },
      });
    },

    *watch({ id }, { select,put, take, call, cancelled }) {
      const node = yield select(({ node }) => node);

      channel = yield call(eventSourceInitChannel, id, node.stream)
      try {
        while (true) {
          const action = yield take(channel)
          yield put(action)
        }
      } finally {
        console.log('watch cancelled')
      }
    },
    *unwatch(_, { put }) {
      if (channel) channel.close()

      
      yield put({ type: 'combine', payload: { stream: [] } })
    }
  },

  reducers: {
    query(state, { payload }) {
      return {
        ...state,
        base: payload.base,
        nodes: payload.nodes,
      };
    },
    combine(state, { payload }) {
      return {
        ...state,
        ...payload
      }
    }
  },
};
