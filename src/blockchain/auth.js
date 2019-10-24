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

// 76f4b6e5fb5339fb417676113a3d8ae112cc18e6eb424de23804f9c706e8a19d
// ef7a08a1c12e75c36c7b33416aa45fad55b6ad73cc04e40ff69da824257b48e6