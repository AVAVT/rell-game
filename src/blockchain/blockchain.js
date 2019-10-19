import pcl from 'postchain-client';

const rest = pcl.restClient.createRestClient("https://try.chromia.dev/node/11736/", '78967baa4768cbcef11c508326ffb13a956689fcb6dc3ba17f4b895cbb1577a3', 5)
export const gtx = pcl.gtxClient.createClient(
  rest,
  Buffer.from(
    '78967baa4768cbcef11c508326ffb13a956689fcb6dc3ba17f4b895cbb1577a3',
    'hex'
  ),
  []
);
