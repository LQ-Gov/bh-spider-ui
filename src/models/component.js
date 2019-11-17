import request from '@/utils/request';

export default {
  namespace: 'component',

  state: {
    list: [],
  },

  effects: {
    *fetch({ payload }, { call, put }) {
      const { type } = payload || { type: '' };
      const response = yield call(async () => request(`/api/component/list?type=${type}`));
      yield put({
        type: 'query',
        payload: response.data||[],
      });
    },
    *delete({ payload }, { call, put }) {
      const option = {
        method: 'DELETE',
      };
      const { name, hash } = payload;
      const response = yield call(async () =>
        request(`/api/component/${name}?hash=${hash}`, option)
      );
      yield put({ type: 'fetch' });
    },

    *submit({ payload }, { call, put }) {
      const body = new FormData();
      for (const k in payload) {
        body.append(k, payload[k]);
      }
      const option = {
        method: 'POST',
        body,
      };
      const response = yield call(async () => request('/api/component', option));
      yield put({ type: 'fetch' });
    },
    *code({ name }, { call }) {
      const response = yield call(async () => request(`/api/component/code/${encodeURIComponent(name)}`));

      return response.data
    }
  },

  reducers: {
    query(state, { payload }) {
      return {
        ...state,
        list: payload,
      };
    },
  },
};
