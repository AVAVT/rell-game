import pcl from 'postchain-client';

import blockchain from './blockchain';

const auth = (function () {
  let currentUser = {};

  const register = async username => {
    try {
      const user = pcl.util.makeKeyPair();
      const { pubKey, privKey } = user;
      const rq = blockchain.getGtx().newTransaction([pubKey]);
      rq.addOperation('register', pubKey, username);
      rq.sign(privKey, pubKey);

      await rq.postAndWaitConfirmation();

      return await login(privKey.toString('hex'));
    } catch (e) {
      console.error(e);
      return {};
    }
  }

  const login = async privKeyAsText => {
    try {
      const privKey = Buffer.from(privKeyAsText, 'hex');
      const pubKey = pcl.util.createPublicKey(privKey);
      const pubKeyAsText = pubKey.toString('hex');
      const { id, username } = await blockchain.getGtx().query("get_user", {
        user_pubkey: pubKeyAsText
      });

      currentUser = {
        id,
        username,
        pubKey,
        privKey
      };

      return {
        username,
        pubKey: pubKeyAsText,
        privKey: privKeyAsText
      };
    } catch (e) {
      console.error(e);
      return {};
    }
  }

  const logout = () => {
    currentUser = {};
  }

  const isLoggedIn = () => !!currentUser.privKey;

  const getCurrentUser = () => ({ ...currentUser });

  return {
    register,
    login,
    logout,
    isLoggedIn,
    getCurrentUser
  }
})();

export default auth;

// a84ba12f68fdc87bed89c115d58bec19923a1583eca3a5099177731904afd120
// e2230041ff0d190f61e85e3ae33c256aa442b52fa41d6c5cc1dead84b8671db0