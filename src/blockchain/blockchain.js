import pcl from 'postchain-client';

const blockchain = (function () {
  let gtx;

  const init = async nodeUri => {
    try {
      console.log(nodeUri);
      const rest = pcl.restClient.createRestClient(nodeUri, '78967baa4768cbcef11c508326ffb13a956689fcb6dc3ba17f4b895cbb1577a3', 5)

      gtx = pcl.gtxClient.createClient(
        rest,
        Buffer.from(
          '78967baa4768cbcef11c508326ffb13a956689fcb6dc3ba17f4b895cbb1577a3',
          'hex'
        ),
        []
      );
      const result = await gtx.query('ping', {});
      console.log('Postchain client initialized.');
      return result;

    } catch (e) {
      console.error(e);
    }
  }

  const getGtx = () => gtx;

  return {
    init,
    getGtx
  }
})();

export default blockchain;