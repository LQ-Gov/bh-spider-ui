import request from '@/utils/request';

import { eventChannel } from 'redux-saga';

import moment from 'moment'

var es = null;




var eventSourceInitChannel = (dashboard) => {

    return eventChannel(emitter => {
        var points = {
            'event.loop.second.count': (e) => {
                var data = JSON.parse(e.data)

                dashboard.eventLoopSecondCount.push({ x: moment(data['time']).format("YYYY-MM-DD HH:mm:ss"), y: data['value'] })

                if (dashboard.eventLoopSecondCount.length > 20) {
                    dashboard.eventLoopSecondCount.shift()
                }
                return emitter({ type: "combine", payload: { eventLoopSecondCount: [...dashboard.eventLoopSecondCount] } });
            },
            'event.loop.total.count': (e) => { var data = JSON.parse(e.data); return emitter({ type: 'combine', payload: { eventLoopTotalCount: data.value } }) },

            'event.loop.day.count': (e) => { var data = JSON.parse(e.data); return emitter({ type: 'combine', payload: { eventLoopDayCount: data.value } }) },


            


            'url.day.count': (e) => {return emitter({ type: 'combine', payload: { urlDayCount: JSON.parse(e.data).value } }) },

            'url.total.count': (e) => { return emitter({ type: 'combine', payload: { urlTotalCount: JSON.parse(e.data).value } }) },

            'node.count': (e) => { return emitter({ type: 'combine', payload: { nodeCount: JSON.parse(e.data).value } }) },

            'survival.node.count': (e) => { return emitter({ type: 'combine', payload: { survivalNodeCount: JSON.parse(e.data).value } }) },

            // 'resource.used.scale': (e) => {
            //     var data = JSON.parse(e.data)

            //     dashboard.resourceUsedScale.push({ x: moment(data['time']).format("YYYY-MM-DD HH:mm:ss"), y: data['value'] })

            //     if (dashboard.resourceUsedScale.length > 20) {
            //         dashboard.resourceUsedScale.shift()
            //     }
            //     return emitter({ type: "combine", payload: { resourceUsedScale: [...dashboard.resourceUsedScale] } });
            // },
            // 'optimize.advice': (e) => { return emitter({ type: 'combine', payload: { optimizeAdvice: e.data } }) },

            'url.distribute': (e) => {
                var data = JSON.parse(e.data)
                var distribute = data['distribute']

                var content = [
                    { x: 'error', y: distribute['error'] },
                    { x: 'waiting', y: distribute['waiting'] },
                    { x: 'crawled', y: distribute['crawled'] }
                ]


                return emitter({ type: 'combine', payload: { distribute: content } })
            }
        }

        var keys = Object.keys(points)

        var params = `point=` + keys.join("&point=")

        es = new EventSource(`/api/watch?${params}`);

        keys.forEach(it => { es.addEventListener(it, points[it]) })


        return () => {
            // do whatever to interrupt the communication here
        }

    })

}

export default {
    namespace: 'dashboard',

    state: {
        eventLoopSecondCount: [],
        eventLoopDayCount: 0,
        eventLoopTotalCount: 0,

        urlDayCount: 0,
        urlTotalCount: 0,

        urlWeekOnWeekGrown: 0.0,
        urlDayOnDayGrown: 0.0,

        nodeCount: 0,

        survivalNodeCount: 0,

        resourceUsedScale: [],

        distribute: [{ x: '0', y: 1 }]
    },




    effects: {


        *fetch(_, { select, put, call, take }) {
            const dashboard = yield select(({ dashboard }) => dashboard);

            const channel = yield call(eventSourceInitChannel, dashboard)

            while (true) {
                const action = yield take(channel)
                yield put(action)
            }
        }
    },
    reducers: {
        combine(state, { payload }) {
            return {
                ...state,
                ...payload
            };
        },
    },
}