/**
 * CF Pages Function: proxy /apps/shuozhi/* → shuozhi-web Worker
 *
 * The shuozhi Next.js app is deployed as a CF Worker (shuozhi-web)
 * with basePath='/apps/shuozhi'. Requests to xiaopingfeng.com/apps/shuozhi/*
 * are forwarded here, preserving the full path so Next.js routing works.
 */
export async function onRequest(context) {
  const { request } = context;
  const url = new URL(request.url);

  // Forward to the shuozhi worker, keeping path + query intact
  const target = `https://shuozhi-web.fxp007.workers.dev${url.pathname}${url.search}`;

  const proxyRequest = new Request(target, {
    method: request.method,
    headers: request.headers,
    body: request.body,
    redirect: 'manual',
  });

  const response = await fetch(proxyRequest);

  // Pass through as-is (status, headers, body)
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers: response.headers,
  });
}
