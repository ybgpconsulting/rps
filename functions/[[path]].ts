import worker from '../worker/index'

export const onRequest: PagesFunction<Cloudflare.Env> = ({ request, env }) =>
  worker.fetch(request, env)
