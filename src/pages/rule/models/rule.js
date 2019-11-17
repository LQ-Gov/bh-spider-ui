import request from '@/utils/request';

import { eventChannel } from 'redux-saga';

import moment from 'moment'

var sse = null

var eventSourceInitChannel = (id, watch) => {

  return eventChannel(emitter => {


    var points = [
      {
        key: `rule.url.count:${id}`,
        callback: (e) => {
          var data = JSON.parse(e.data);
          var now = moment().format("MM-DD HH:mm:ss"); //当前时间
          var items = [
            { time: now, type: 'going', value: data['going'] },
            { time: now, type: 'error', value: data['error'] },
            { time: now, type: 'queue', value: data['queue'] },
          ]

          // return emitter({ type: 'push', payload: { field: 'urlCount', items: items } })
        }
      }, {
        key: `rule.text.stream:${id}`,
        callback: (e) => {
          var now = moment().format("MM-DD HH:mm:ss"); //当前时间

          var data = JSON.parse(e.data);

          return emitter({ type: 'push', payload: { field: 'stream', items: [data] } })


          // console.log(e)
        }
      }
    ]

    var keys = points.map((item) => { return item.key })

    var params = `point=` + keys.join("&point=")

    sse = new EventSource(`/api/watch?${params}`);

    for (var i in points) {
      var point = points[i]
      sse.addEventListener(point.key, point.callback)
    }


    return () => {
      // do whatever to interrupt the communication here
    }

  })

}


const init = {
  data: {
    pattern: '',
    cron: '',
    parallelCount: 0,
    description: '',
    _class: 'com.bh.spider.common.rule.Rule',
    chains: [{ name: "default", components: [] }],
    // proxies:["10.182.90.139:31880"],
    proxies: [],
    policy: ['idle'],
    repeat: true,
    nodes: []
  },
  list: [],

}


export default {
  namespace: 'rule2',




  state: {
    watch: {
      urlCount: [],
      stream: []
    }
  },

  effects: {
    *fetch(_, { call, put }) {
      const response = yield call(async () => request('/api/rule/list'));

      yield put({
        type: 'query',
        payload: response.data || [],
      });
    },

    *fetchOne({ id }, { call, put }) {
      const response = yield call(async () => request(`/api/rule/${id}`))

      return response.data
    },
    *delete({ id }, { call, put }) {
      const option = {
        method: 'DELETE',
      };
      const response = yield call(async () => request(`/api/rule/${id}`, option));

      yield put({ type: 'fetch' });
    },

    *create(_, { call, select }) {

      const rule = yield select(({ rule2 }) => rule2);
      console.log(rule)


      const option = { method: 'POST', body: JSON.stringify(rule.data), headers: { 'Content-Type': 'application/json' } };

      yield call(async () => request('/api/rule', option));
    },

    *edit(_, { call, select }) {
      const rule = yield select(({ rule2 }) => rule2);

      const option = { method: 'PATCH', body: JSON.stringify(rule.data), headers: { 'Content-Type': 'application/json' } };

      yield call(async () => request('/api/rule', option));
    },

    *submitURL({ url }, { call }) {
      const body = new FormData();
      body.append('url', url);

      const option = { method: 'POST', body };
      yield call(async () => request('/api/fetch/url', option));
    },

    *watch({ id }, { select, put, call, take }) {
      const rule2 = yield select(({ rule2 }) => rule2);

      const channel = yield call(eventSourceInitChannel, id, rule2.watch)

      while (true) {
        const action = yield take(channel)
        yield put(action)
      }
    }
  },

  reducers: {
    refresh(state, { payload }) {
      const d = {
        ...state,
        data: {
          ...state.data,
          ...payload,
        },
      };
      return d;
    },
    query(state, { payload }) {
      return {
        ...state,
        list: payload,
      };
    },
    reset(state, { payload }) {
      return payload || init
    },
    push(state, { payload }) {
      var data = { ...state }
      var watch = { ...state.watch }

      var items = watch[payload.field].concat(payload.items)

      watch[payload.field] = items

      return {
        ...state,
        ...{
          watch: watch
        }
      }
    },
  },
};
