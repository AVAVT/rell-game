import pcl from 'postchain-client';

import { gtx } from './blockchain';

const auth = (function () {
  let currentUser = {};

  const register = async username => {
    try {
      const user = pcl.util.makeKeyPair();
      const rq = gtx.newTransaction([user.pubKey]);
      rq.addOperation('register', user.pubKey, username);
      rq.sign(user.privKey, user.pubKey);

      await rq.postAndWaitConfirmation();

      const { pubKey, privKey } = user;

      currentUser = {
        username,
        pubKey,
        privKey
      };
      return {
        username,
        pubKey: pubKey.toString('hex'),
        privKey: privKey.toString('hex')
      };

    } catch (e) {
      console.error(e);
      return {};
    }
  }

  const isLoggedIn = () => !!currentUser.privKey;

  return {
    register,
    isLoggedIn
  }
})();

export default auth;